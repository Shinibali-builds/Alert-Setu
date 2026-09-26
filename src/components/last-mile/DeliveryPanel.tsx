import React, { useState } from 'react';
import {
  DeliveryMode,
  encodeLowBandwidthPayload,
  createRadioScript,
  getTranslation,
} from '../../services/lastMileAlertService';
import { OfficialEmergencyAlert, AlertLanguage } from '../../data/lastMileAlerts';
import { ProvenanceBadge } from './ProvenanceBadge';
import {
  Send,
  Smartphone,
  Radio,
  WifiOff,
  Cpu,
  Copy,
  Check,
  AlertTriangle,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface DeliveryPanelProps {
  alert: OfficialEmergencyAlert;
  language: AlertLanguage;
  deliveryMode: DeliveryMode;
  onDeliveryModeChange: (mode: DeliveryMode) => void;
  onSimulateDelivery: (channel: DeliveryMode, targets: string[]) => void;
  sending: boolean;
  lowBandwidth: boolean;
  onToggleLowBandwidth: () => void;
  offlineMode: boolean;
  onToggleOfflineMode: () => void;
}

const DELIVERY_MODES: {
  id: DeliveryMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}[] = [
  { id: 'SMS', label: 'SMS Gateway', icon: Smartphone, tag: '160-char GSM' },
  { id: 'Low-bandwidth Web', label: 'Low-BW Packet', icon: Cpu, tag: 'JSON <1KB' },
  { id: 'Offline Relay', label: 'Offline / Mesh', icon: WifiOff, tag: 'Store & Fwd' },
  { id: 'Community Radio', label: 'Radio Broadcast', icon: Radio, tag: 'Voice Script' },
];

export const DeliveryPanel: React.FC<DeliveryPanelProps> = ({
  alert,
  language,
  deliveryMode,
  onDeliveryModeChange,
  onSimulateDelivery,
  sending,
  lowBandwidth,
  onToggleLowBandwidth,
  offlineMode,
  onToggleOfflineMode,
}) => {
  const [copiedRadio, setCopiedRadio] = useState(false);
  const [customTarget, setCustomTarget] = useState('WARD-07-SHELTER-DESK');

  const translation = getTranslation(alert, language);
  const packet = encodeLowBandwidthPayload(alert, translation, !lowBandwidth);
  const radioScript = createRadioScript(alert, translation);

  const handleCopyRadio = () => {
    navigator.clipboard.writeText(radioScript);
    setCopiedRadio(true);
    setTimeout(() => setCopiedRadio(false), 2000);
  };

  const handleTrigger = () => {
    onSimulateDelivery(deliveryMode, [customTarget || 'PRIMARY-DISASTER-NODE']);
  };

  return (
    <section className="glass-panel rounded-3xl p-5 md:p-6" aria-labelledby="delivery-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              07 / LAST-MILE MULTI-CHANNEL DELIVERY
            </span>
            <ProvenanceBadge type="DEMO TELEMETRY" />
          </div>
          <h2 id="delivery-heading" className="text-xl font-bold text-slate-100">
            Multi-Channel Dispatch Engine
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-orange-300 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Simulated Telemetry — No Live SMS Sent</span>
        </div>
      </div>

      {/* Channel selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {DELIVERY_MODES.map((mode) => {
          const Icon = mode.icon;
          const isSelected = deliveryMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onDeliveryModeChange(mode.id)}
              className={`text-left p-3.5 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/40 ${
                isSelected
                  ? 'bg-rose-500/20 border-rose-500/60 shadow-lg ring-1 ring-rose-500/30'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon
                  className={`w-5 h-5 ${
                    isSelected ? 'text-rose-400' : 'text-slate-400'
                  }`}
                />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                  {mode.tag}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-200">{mode.label}</div>
            </button>
          );
        })}
      </div>

      {/* Active Channel Preview Area */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 md:p-6 mb-6">
        {deliveryMode === 'SMS' && (
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">
                SMS Channel Preview (GSM 03.38 Compliant)
              </span>
              <span className="text-xs font-mono text-emerald-400">142 Chars • 1 Segment</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs md:text-sm text-slate-200 leading-relaxed max-w-xl">
              [ALERTSETU] {alert.severity} ALERT: {alert.hazard.toUpperCase()} for {alert.affectedArea}.{' '}
              {alert.recommendedAction} Ref: {alert.sourceReference}. Call 112 for relief.
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="text-xs text-slate-400">Target Node / SIM Group:</label>
              <input
                type="text"
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:border-rose-500 focus:outline-none"
                placeholder="e.g. WARD-VOLUNTEERS-OD-9"
              />
            </div>
          </div>
        )}

        {deliveryMode === 'Low-bandwidth Web' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-slate-400 block">
                  Low-Bandwidth JSON Payload Inspector
                </span>
                <span className="text-xs text-slate-400">
                  TextEncoder Byte Count:{' '}
                  <strong className="text-emerald-400 font-mono text-sm">{packet.bytes} Bytes</strong>{' '}
                  (under 2G connectivity)
                </span>
              </div>

              <button
                type="button"
                onClick={onToggleLowBandwidth}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-850 text-slate-300"
              >
                {lowBandwidth ? 'Strip Decorative Media (Active)' : 'Include Rich Assets'}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-teal-300 overflow-x-auto max-h-56 leading-5">
              {packet.text}
            </pre>
          </div>
        )}

        {deliveryMode === 'Offline Relay' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-slate-400 block">
                  Offline Mesh Store-and-Forward Buffer
                </span>
                <span className="text-xs text-slate-400">
                  Queues payload in IndexedDB / localStorage until edge gateway reconnects
                </span>
              </div>

              <button
                type="button"
                onClick={onToggleOfflineMode}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  offlineMode
                    ? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
                    : 'border-slate-700 bg-slate-900 text-slate-300'
                }`}
              >
                {offlineMode ? 'Simulate Edge Gateway Offline' : 'Gateway Online (Direct Sync)'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Ward Community Relay (Node 01)', 'District Shelter Desk', 'Volunteer Ham Relay'].map(
                (relayNode, idx) => (
                  <div
                    key={relayNode}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-900/70 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-300">{relayNode}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Queue Delay: {idx * 150 + 200}ms
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {deliveryMode === 'Community Radio' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">
                Radio Announcer Emergency Bulletin Script
              </span>

              <button
                type="button"
                onClick={handleCopyRadio}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-850 text-slate-200"
              >
                {copiedRadio ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Radio Script</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs md:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {radioScript}
            </div>
          </div>
        )}
      </div>

      {/* Action Simulation Trigger Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-rose-950/30 via-slate-900 to-slate-900 border border-rose-500/30">
        <div>
          <div className="text-sm font-bold text-slate-200">
            Transmit Over Selected Emergency Channel
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Channel: <strong className="text-slate-300">{deliveryMode}</strong> • Target:{' '}
            <span className="font-mono text-slate-300">{customTarget}</span> • Locale: {language}
          </div>
        </div>

        <button
          type="button"
          disabled={sending}
          onClick={handleTrigger}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 transition-all shadow-lg shadow-rose-950/50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-rose-500/50"
        >
          {sending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Simulating Transmission...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Simulate {deliveryMode} Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </section>
  );
};
