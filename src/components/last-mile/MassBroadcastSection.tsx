/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  BroadcastAudience,
  BroadcastChannel,
  BroadcastLanguage,
  BroadcastRecord,
} from '../../types/broadcastTypes';
import { OfficialEmergencyAlert } from '../../data/lastMileAlerts';
import { useAuth } from '../../auth/AuthContext';
import { getRoleDisplayName } from '../../auth/authTypes';
import { ProvenanceBadge } from './ProvenanceBadge';
import {
  Send,
  Radio,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Users,
  Layers,
  CheckCircle2,
  Clock,
  RefreshCw,
  Building,
  Check,
  Play,
  Lock,
  History,
  Info,
} from 'lucide-react';

interface MassBroadcastSectionProps {
  activeAlert: OfficialEmergencyAlert;
}

const AUDIENCE_OPTIONS: BroadcastAudience[] = [
  'General Public',
  'Low Literacy',
  'Older Adults',
  'People with Disabilities',
  'Visitors / New Residents',
];

const LANGUAGE_OPTIONS: BroadcastLanguage[] = [
  'English',
  'Odia',
  'Hindi',
  'Bengali',
  'Telugu',
];

const CHANNEL_OPTIONS: BroadcastChannel[] = [
  'SMS',
  'Web Notification',
  'Mobile Push',
  'Low-Bandwidth Web',
  'Offline Relay',
  'Community Radio',
];

export function MassBroadcastSection({ activeAlert }: MassBroadcastSectionProps) {
  const { user, can } = useAuth();

  // State targeting
  const [targetState, setTargetState] = useState<string>('Odisha');
  const [targetDistrict, setTargetDistrict] = useState<string>('Khordha');
  const [blockArea, setBlockArea] = useState<string>('Bhubaneswar, Balianta & Coastal Blocks');
  const [radiusKm, setRadiusKm] = useState<number>(35);

  // Audience & Modalities
  const [selectedAudience, setSelectedAudience] = useState<BroadcastAudience>('General Public');
  const [selectedLanguages, setSelectedLanguages] = useState<BroadcastLanguage[]>([
    'Odia',
    'Hindi',
    'English',
  ]);
  const [selectedChannels, setSelectedChannels] = useState<BroadcastChannel[]>([
    'SMS',
    'Web Notification',
    'Low-Bandwidth Web',
  ]);

  // Modals & Flows
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [authorizing, setAuthorizing] = useState<boolean>(false);
  const [dispatching, setDispatching] = useState<boolean>(false);
  const [currentBroadcast, setCurrentBroadcast] = useState<BroadcastRecord | null>(null);
  const [auditLogs, setAuditLogs] = useState<BroadcastRecord[]>([]);
  const [showAuditDrawer, setShowAuditDrawer] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canAuthorizeBroadcast =
    can('AUTHORIZE_DISTRICT_BROADCAST') || can('AUTHORIZE_STATE_BROADCAST');

  const eligibleRecipients = 12480;
  const batchSize = 100;
  const totalBatches = Math.ceil(eligibleRecipients / batchSize);

  // Fetch recent broadcasts & audit log
  const fetchBroadcasts = useCallback(async () => {
    try {
      const res = await fetch('/api/broadcasts');
      if (res.ok) {
        const data: BroadcastRecord[] = await res.json();
        setAuditLogs(data);
        if (data.length > 0 && !currentBroadcast) {
          setCurrentBroadcast(data[0]);
        }
      }
    } catch {
      // offline / mock fallback
    }
  }, [currentBroadcast]);

  useEffect(() => {
    fetchBroadcasts();
  }, [fetchBroadcasts]);

  // Poll active broadcast status if dispatching
  useEffect(() => {
    if (!currentBroadcast || currentBroadcast.status !== 'DISPATCHING') return;

    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/broadcasts/${currentBroadcast.broadcastId}`);
        if (res.ok) {
          const updated: BroadcastRecord = await res.json();
          setCurrentBroadcast(updated);
          if (updated.status === 'COMPLETED' || updated.status === 'FAILED') {
            setDispatching(false);
            fetchBroadcasts();
          }
        }
      } catch {
        // silent
      }
    }, 600);

    return () => clearInterval(timer);
  }, [currentBroadcast, fetchBroadcasts]);

  const toggleLanguage = (lang: BroadcastLanguage) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? (prev.length > 1 ? prev.filter((l) => l !== lang) : prev) : [...prev, lang]
    );
  };

  const toggleChannel = (ch: BroadcastChannel) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? (prev.length > 1 ? prev.filter((c) => c !== ch) : prev) : [...prev, ch]
    );
  };

  // Step: Server-side Authorization & Queueing
  const handleAuthorizeAndQueue = async () => {
    setAuthorizing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/broadcasts/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: activeAlert.id,
          hazard: activeAlert.hazard,
          severity: activeAlert.severity,
          headline: activeAlert.headline,
          target: {
            state: targetState,
            district: targetDistrict,
            blockArea,
            radiusKm,
          },
          audience: selectedAudience,
          languages: selectedLanguages,
          channels: selectedChannels,
          totalRecipients: eligibleRecipients,
          batchSize,
        }),
      });

      const data = await res.json();
      setAuthorizing(false);

      if (res.ok && data.success) {
        setCurrentBroadcast(data.broadcast);
        setShowReviewModal(false);
        fetchBroadcasts();
      } else {
        setErrorMessage(data.error || 'Server authorization failed.');
      }
    } catch (err: unknown) {
      setAuthorizing(false);
      const msg = err instanceof Error ? err.message : 'Network error during authorization';
      setErrorMessage(msg);
    }
  };

  // Step: Dispatch Batches
  const handleDispatch = async () => {
    if (!currentBroadcast) return;
    setDispatching(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/broadcasts/${currentBroadcast.broadcastId}/dispatch`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentBroadcast(data.broadcast);
      } else {
        setErrorMessage(data.error || 'Dispatch trigger failed.');
        setDispatching(false);
      }
    } catch {
      setDispatching(false);
    }
  };

  return (
    <section
      className="glass-panel rounded-3xl p-5 md:p-6 border border-rose-500/30 shadow-2xl relative"
      aria-labelledby="mass-broadcast-heading"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase">
              07 / MASS EMERGENCY BROADCAST
            </span>
            <ProvenanceBadge type="SAMPLE / SYNTHETIC DATA" />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              DEMO BROADCAST • SYNTHETIC RECIPIENTS
            </span>
          </div>
          <h2 id="mass-broadcast-heading" className="text-xl font-bold text-white flex items-center gap-2.5">
            <Send className="w-5 h-5 text-rose-400" />
            <span>Authorized Multi-Channel Emergency Dispatch</span>
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowAuditDrawer((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
        >
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Targeting & Geography */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase">
            <Building className="w-4 h-4 text-rose-400" />
            <span>Geographic Targeting</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">State / Apex Authority</label>
              <select
                value={targetState}
                onChange={(e) => setTargetState(e.target.value)}
                className="w-full text-xs rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="Odisha">Odisha (OSDMA)</option>
                <option value="West Bengal">West Bengal (WB-SDMA)</option>
                <option value="Andhra Pradesh">Andhra Pradesh (AP-SDMA)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Target District</label>
              <select
                value={targetDistrict}
                onChange={(e) => setTargetDistrict(e.target.value)}
                className="w-full text-xs rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="Khordha">Khordha (SEOC Active)</option>
                <option value="Puri">Puri (Coastal Zone)</option>
                <option value="Cuttack">Cuttack (Mahanadi River Basin)</option>
                <option value="Ganjam">Ganjam (South Coastal)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Local Affected Areas / Blocks</label>
              <input
                type="text"
                value={blockArea}
                onChange={(e) => setBlockArea(e.target.value)}
                className="w-full text-xs rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                <span>Emergency Radius:</span>
                <span className="font-mono text-rose-300 font-bold">{radiusKm} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Middle Column: Audience & Modalities */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Audience & Languages</span>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Audience Segment</label>
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value as BroadcastAudience)}
              className="w-full text-xs rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
            >
              {AUDIENCE_OPTIONS.map((aud) => (
                <option key={aud} value={aud}>
                  {aud}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
              Languages ({selectedLanguages.length} active)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGE_OPTIONS.map((lang) => {
                const active = selectedLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                      active
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    {active && <Check className="w-3 h-3" />}
                    <span>{lang}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
              Channels ({selectedChannels.length} active)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {CHANNEL_OPTIONS.map((ch) => {
                const active = selectedChannels.includes(ch);
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => toggleChannel(ch)}
                    className={`p-2 rounded-xl text-left text-xs font-semibold transition-colors flex items-center justify-between ${
                      active
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{ch}</span>
                    {active && <Check className="w-3 h-3 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Synthetic Population Summary & Action */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase mb-3">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Recipient Pool & Rate Limiter</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Eligible Recipients:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {eligibleRecipients.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Batch Processing:</span>
                <span className="font-mono font-bold text-slate-200">
                  {totalBatches} batches of {batchSize}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Rate Limiter Safe-Guard:</span>
                <span className="font-mono text-emerald-400 font-bold">100 req / 450ms</span>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  Provider abstraction running in synthetic demo mode. Carrier cell towers simulated with zero SMS billing.
                </span>
              </div>
            </div>
          </div>

          <div>
            {canAuthorizeBroadcast ? (
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>[ REVIEW BROADCAST ]</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authority Clearance Required</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Your current role ({user ? getRoleDisplayName(user.role) : 'Guest'}) cannot authorize mass broadcasts. Switch to <strong className="text-slate-200">District Authority</strong> in header to dispatch.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Dispatch State Machine Banner */}
      {currentBroadcast && (
        <div className="mt-5 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-rose-400">
                JOB ID: {currentBroadcast.broadcastId}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  currentBroadcast.status === 'COMPLETED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : currentBroadcast.status === 'DISPATCHING' || currentBroadcast.status === 'PARTIALLY_SENT'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {currentBroadcast.status}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Authorized by: <strong className="text-slate-200">{currentBroadcast.initiatedBy}</strong> ({currentBroadcast.initiatorRole})
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1.5">
              <span>
                Progress: {currentBroadcast.sentCount.toLocaleString()} / {currentBroadcast.totalRecipients.toLocaleString()} (Batch {currentBroadcast.currentBatch} of {currentBroadcast.totalBatches})
              </span>
              <span className="text-emerald-400 font-bold">
                {Math.round((currentBroadcast.sentCount / currentBroadcast.totalRecipients) * 100)}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-300"
                style={{
                  width: `${(currentBroadcast.sentCount / currentBroadcast.totalRecipients) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-center font-mono">
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-500">QUEUED</div>
              <div className="text-sm font-bold text-amber-400">
                {currentBroadcast.queuedCount.toLocaleString()}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-500">SENT</div>
              <div className="text-sm font-bold text-cyan-400">
                {currentBroadcast.sentCount.toLocaleString()}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-500">DELIVERED</div>
              <div className="text-sm font-bold text-emerald-400">
                {currentBroadcast.deliveredCount.toLocaleString()}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-500">ACKNOWLEDGED</div>
              <div className="text-sm font-bold text-slate-200">
                {currentBroadcast.acknowledgedCount.toLocaleString()}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-500">FAILED / RETRY</div>
              <div className="text-sm font-bold text-rose-400">
                {currentBroadcast.failedCount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Trigger Dispatch Button if in Authorized/Queued state */}
          {(currentBroadcast.status === 'AUTHORIZED' || currentBroadcast.status === 'QUEUED') &&
            canAuthorizeBroadcast && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleDispatch}
                  disabled={dispatching}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>START DISPATCH BATCHES</span>
                </button>
              </div>
            )}
        </div>
      )}

      {/* Review & Confirmation Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1220] border border-rose-500/50 shadow-2xl rounded-3xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold">
                  OFFICIAL PROTOCOL CONFIRMATION
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Confirm Emergency Mass Broadcast
                </h3>
              </div>
              <ShieldCheck className="w-6 h-6 text-rose-400 shrink-0" />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">ALERT:</span>
                <span className="font-bold text-rose-300">
                  {activeAlert.hazard} • {activeAlert.severity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">TARGET:</span>
                <span className="text-slate-200">
                  {targetState} &rarr; {targetDistrict} ({blockArea})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AUDIENCE:</span>
                <span className="text-slate-200">{selectedAudience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">LANGUAGES:</span>
                <span className="text-slate-200">{selectedLanguages.join(' + ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CHANNELS:</span>
                <span className="text-slate-200">{selectedChannels.join(' + ')}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-400">ELIGIBLE RECIPIENTS:</span>
                <span className="font-mono font-bold text-amber-300">
                  {eligibleRecipients.toLocaleString()} (DEMO / SYNTHETIC)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">BATCH COUNT:</span>
                <span className="font-mono font-bold text-slate-200">{totalBatches} Batches</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              By authorizing, this alert will be entered into the state disaster dispatch queue under the authority of{' '}
              <strong className="text-white">{user?.name}</strong> (<span className="text-rose-300">{user?.role}</span>).
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAuthorizeAndQueue}
                disabled={authorizing}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-950/60 flex items-center gap-2"
              >
                {authorizing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>AUTHORIZE &amp; QUEUE BROADCAST</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Drawer */}
      {showAuditDrawer && (
        <div className="mt-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <History className="w-4 h-4 text-rose-400" />
              <span>Immutable Regulatory Audit Trail</span>
            </span>
            <button
              type="button"
              onClick={() => setShowAuditDrawer(false)}
              className="text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {auditLogs.map((log) => (
              <div
                key={log.broadcastId}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-rose-400">{log.broadcastId}</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-slate-300 font-semibold">{log.headline}</div>
                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>Authorizer: {log.initiatedBy} ({log.initiatorRole})</span>
                  <span>•</span>
                  <span>Target: {log.target.district}</span>
                  <span>•</span>
                  <span>Recipients: {log.totalRecipients.toLocaleString()}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
