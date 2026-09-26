import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SAMPLE_ALERTS,
  AlertLanguage,
  OfficialEmergencyAlert,
} from '../data/lastMileAlerts';
import {
  Audience,
  DeliveryMode,
  DeliveryReceipt,
  createReceipts,
  encodeLowBandwidthPayload,
  getTranslation,
  loadReceipts,
  saveReceipts,
} from '../services/lastMileAlertService';

import { ProcessFlow } from '../components/last-mile/ProcessFlow';
import { AlertSourceCard } from '../components/last-mile/AlertSourceCard';
import { AudiencePreview } from '../components/last-mile/AudiencePreview';
import { LanguageBank } from '../components/last-mile/LanguageBank';
import { VisualStudio } from '../components/last-mile/VisualStudio';
import { AlertMap } from '../components/last-mile/AlertMap';
import { DeliveryPanel } from '../components/last-mile/DeliveryPanel';
import { ReceiptTracker } from '../components/last-mile/ReceiptTracker';
import { ProvenanceBadge } from '../components/last-mile/ProvenanceBadge';
import { MassBroadcastSection } from '../components/last-mile/MassBroadcastSection';

import {
  Siren,
  Wifi,
  WifiOff,
  Radio,
  HeartHandshake,
  AlertTriangle,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock3,
} from 'lucide-react';

const COMMUNITY_NOTE_KEY = 'alertsetu-community-note-v1';

export function AlertSetuPage() {
  const [selectedAlertId, setSelectedAlertId] = useState<string>(SAMPLE_ALERTS[0]?.id ?? '');
  const [audience, setAudience] = useState<Audience>('General Public');
  const [language, setLanguage] = useState<AlertLanguage>('English');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('SMS');
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [lowBandwidth, setLowBandwidth] = useState<boolean>(true);
  const [visualMode, setVisualMode] = useState<boolean>(true);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [communityNote, setCommunityNote] = useState<string>(() => {
    try {
      return localStorage.getItem(COMMUNITY_NOTE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [receipts, setReceipts] = useState<DeliveryReceipt[]>(() => loadReceipts());
  const [sending, setSending] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setActiveToast(msg);
    const t = setTimeout(() => setActiveToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  // Save receipts to localStorage
  useEffect(() => {
    saveReceipts(receipts);
  }, [receipts]);

  // Save community notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(COMMUNITY_NOTE_KEY, communityNote);
    } catch {
      // localStorage may be disabled
    }
  }, [communityNote]);

  const activeAlert: OfficialEmergencyAlert = useMemo(() => {
    return SAMPLE_ALERTS.find((a) => a.id === selectedAlertId) || SAMPLE_ALERTS[0];
  }, [selectedAlertId]);

  const translation = useMemo(() => {
    return getTranslation(activeAlert, language);
  }, [activeAlert, language]);

  const bandwidthPacket = useMemo(() => {
    return encodeLowBandwidthPayload(activeAlert, translation, !lowBandwidth);
  }, [activeAlert, translation, lowBandwidth]);

  // Synchronize queued packets when offlineMode is turned off
  const handleToggleOfflineMode = useCallback(() => {
    setOfflineMode((prev) => {
      const willBeOnline = prev; // if prev was true, now it will be false (online)
      if (willBeOnline) {
        // Gateway back online: sync any queued transmissions
        setReceipts((current) => {
          const queuedIds = current.filter((r) => r.status === 'queued').map((r) => r.id);
          if (queuedIds.length > 0) {
            showToast(`Gateway restored online. Synchronizing ${queuedIds.length} queued packet(s)...`);
            setTimeout(() => {
              setReceipts((curr) =>
                curr.map((r) => (queuedIds.includes(r.id) ? { ...r, status: 'syncing' } : r))
              );
            }, 350);
            setTimeout(() => {
              setReceipts((curr) =>
                curr.map((r) =>
                  queuedIds.includes(r.id)
                    ? { ...r, status: 'sent', sentAt: new Date().toISOString() }
                    : r
                )
              );
            }, 750);
            setTimeout(() => {
              setReceipts((curr) =>
                curr.map((r) =>
                  queuedIds.includes(r.id)
                    ? { ...r, status: 'delivered', deliveredAt: new Date().toISOString(), errorMessage: undefined }
                    : r
                )
              );
              showToast('Queued emergency packets successfully synced and delivered');
            }, 1400);
          } else {
            showToast('Gateway restored online (Direct Sync)');
          }
          return current;
        });
      } else {
        showToast('Offline Mode active: New packets will be buffered locally');
      }
      return !prev;
    });
  }, [showToast]);

  // Delivery simulation with deterministic state machine
  const handleSimulateDelivery = useCallback(
    (channel: DeliveryMode, targets: string[], shouldFail = false) => {
      if (sending) return;

      const created = createReceipts(activeAlert, channel, targets, bandwidthPacket.bytes);
      const activeReceipts = created.map((r) => ({
        ...r,
        status: 'queued' as const,
        errorMessage: offlineMode ? 'Queued locally in edge buffer (Gateway Offline)' : undefined,
      }));

      setReceipts((prev) => [...activeReceipts, ...prev].slice(0, 100));
      setPipelineStep(4); // Stage 5: Delivery

      // If offline mode is ON: keep packet strictly in QUEUED state!
      if (offlineMode) {
        showToast(`Packet buffered locally in edge queue for ${targets.length} node(s) (Offline)`);
        return;
      }

      setSending(true);
      showToast(shouldFail ? 'Testing failure handling...' : `Transmission queued for ${targets.length} target node(s)`);

      // Progress: QUEUED -> SYNCING
      setTimeout(() => {
        setReceipts((current) =>
          current.map((r) =>
            activeReceipts.some((ar) => ar.id === r.id) ? { ...r, status: 'syncing' } : r
          )
        );
      }, 350);

      if (shouldFail) {
        // Failure simulation: SYNCING -> FAILED
        setTimeout(() => {
          setReceipts((current) =>
            current.map((r) =>
              activeReceipts.some((ar) => ar.id === r.id)
                ? {
                    ...r,
                    status: 'failed',
                    errorMessage: 'Carrier Tower Timeout: Handshake packet unacknowledged (Simulated Failure)',
                  }
                : r
            )
          );
          setSending(false);
          showToast('Simulated transmission failure recorded');
        }, 800);
        return;
      }

      // Normal path: SYNCING -> SENT -> DELIVERED
      setTimeout(() => {
        setReceipts((current) =>
          current.map((r) =>
            activeReceipts.some((ar) => ar.id === r.id)
              ? { ...r, status: 'sent', sentAt: new Date().toISOString() }
              : r
          )
        );
      }, 750);

      setTimeout(() => {
        setReceipts((current) =>
          current.map((r) =>
            activeReceipts.some((ar) => ar.id === r.id)
              ? { ...r, status: 'delivered', deliveredAt: new Date().toISOString() }
              : r
          )
        );
        setSending(false);
        showToast('Emergency packet delivered to endpoint');
      }, 1400);
    },
    [activeAlert, bandwidthPacket.bytes, offlineMode, sending, showToast]
  );

  // Acknowledge receipt: DELIVERED -> ACKNOWLEDGED
  const handleAcknowledge = useCallback((receiptId: string) => {
    setReceipts((current) =>
      current.map((r) =>
        r.id === receiptId
          ? {
              ...r,
              status: 'acknowledged',
              acknowledgedAt: new Date().toISOString(),
            }
          : r
      )
    );
    setPipelineStep(5); // Stage 6: Acknowledgement
    showToast('Acknowledgement recorded and timestamped');
  }, [showToast]);

  // Retry failed delivery: FAILED -> QUEUED -> SYNCING -> SENT -> DELIVERED
  const handleRetry = useCallback((receiptId: string) => {
    setReceipts((current) =>
      current.map((r) =>
        r.id === receiptId
          ? {
              ...r,
              status: 'queued',
              errorMessage: undefined,
              retryCount: (r.retryCount || 0) + 1,
            }
          : r
      )
    );
    showToast('Retry initialized: Transitioning through state machine...');

    setTimeout(() => {
      setReceipts((current) =>
        current.map((r) => (r.id === receiptId ? { ...r, status: 'syncing' } : r))
      );
    }, 350);

    setTimeout(() => {
      setReceipts((current) =>
        current.map((r) =>
          r.id === receiptId
            ? { ...r, status: 'sent', sentAt: new Date().toISOString() }
            : r
        )
      );
    }, 750);

    setTimeout(() => {
      setReceipts((current) =>
        current.map((r) =>
          r.id === receiptId
            ? { ...r, status: 'delivered', deliveredAt: new Date().toISOString(), errorMessage: undefined }
            : r
        )
      );
      showToast('Retried delivery completed successfully');
    }, 1400);
  }, [showToast]);

  const handleClearReceipts = useCallback(() => {
    setReceipts([]);
    localStorage.removeItem('alertsetu-receipts-v1');
    showToast('Receipt audit log cleared');
  }, [showToast]);

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {activeToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 text-slate-100 border border-rose-500/40 shadow-2xl backdrop-blur-md text-xs font-semibold animate-in fade-in slide-in-from-bottom-3"
        >
          <div className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          <span>{activeToast}</span>
        </div>
      )}

      {/* 1. COMPACT COMMAND-CENTER HERO */}
      <section className="glass-panel rounded-3xl p-5 md:p-6 border border-slate-700/60 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                <Siren className="w-3.5 h-3.5" />
                ALERTSETU
              </span>
              <span className="text-xs font-mono text-slate-400">
                LAST-MILE EMERGENCY INTELLIGENCE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              Last-Mile Emergency Intelligence
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Turn official warnings into clear, multilingual, visual and low-bandwidth actions.
            </p>
          </div>

          {/* Right: Active Alert Snapshot */}
          <div className="shrink-0 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-2 min-w-[280px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono uppercase text-slate-400">ACTIVE ADVISORY</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  activeAlert.severity === 'RED'
                    ? 'border-red-500/50 bg-red-500/20 text-red-300'
                    : 'border-orange-500/50 bg-orange-500/20 text-orange-300'
                }`}
              >
                {activeAlert.severity} ALERT
              </span>
            </div>

            <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span>{activeAlert.hazard} Warning</span>
              <span className="text-xs text-slate-400 font-mono">({activeAlert.id})</span>
            </div>

            <div className="text-xs text-slate-400 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
              <span className="truncate">{activeAlert.affectedArea}</span>
            </div>

            <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Valid: {activeAlert.validUntil}</span>
              <ProvenanceBadge type="SAMPLE / SYNTHETIC DATA" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROCESS FLOW PIPELINE */}
      <ProcessFlow
        currentStep={pipelineStep}
        onStepSelect={(step) => {
          setPipelineStep(step);
        }}
      />

      {/* 3. ROW 1: OFFICIAL ALERT (LEFT) + AUDIENCE PREVIEW (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AlertSourceCard
          alerts={SAMPLE_ALERTS}
          selectedAlert={activeAlert}
          onSelectAlert={(id) => {
            setSelectedAlertId(id);
            setPipelineStep(0);
            showToast(`Switched active advisory to ${id}`);
          }}
        />

        <AudiencePreview
          alert={activeAlert}
          audience={audience}
          onAudienceChange={(aud) => {
            setAudience(aud);
            setPipelineStep(1);
            showToast(`Modulated plain language for: ${aud}`);
          }}
        />
      </div>

      {/* 4. ROW 2: LANGUAGE BANK */}
      <LanguageBank
        alert={activeAlert}
        selectedLanguage={language}
        onLanguageChange={(lang) => {
          setLanguage(lang);
          setPipelineStep((prev) => Math.max(prev, 2));
          showToast(`Regional translation switched to ${lang}`);
        }}
      />

      {/* 5. ROW 3: VISUAL STUDIO (LEFT) + AFFECTED AREA MAP (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <VisualStudio
          visualMode={visualMode}
          onToggleVisualMode={() => {
            setVisualMode((v) => !v);
            setPipelineStep((prev) => Math.max(prev, 3));
          }}
          activeHazard={activeAlert.hazard}
          activeSeverity={activeAlert.severity}
          audience={audience}
        />

        <AlertMap alert={activeAlert} />
      </div>

      {/* 6. ROW 4: DELIVERY CONTROL (LEFT) + RECEIPT TRACKER (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DeliveryPanel
          alert={activeAlert}
          language={language}
          deliveryMode={deliveryMode}
          onDeliveryModeChange={(mode) => setDeliveryMode(mode)}
          onSimulateDelivery={handleSimulateDelivery}
          sending={sending}
          lowBandwidth={lowBandwidth}
          onToggleLowBandwidth={() => setLowBandwidth((v) => !v)}
          offlineMode={offlineMode}
          onToggleOfflineMode={handleToggleOfflineMode}
        />

        <ReceiptTracker
          receipts={receipts}
          onAcknowledge={handleAcknowledge}
          onRetry={handleRetry}
          onClearReceipts={handleClearReceipts}
        />
      </div>

      {/* 7. MASS EMERGENCY BROADCAST (MULTI-CHANNEL DISPATCH & BATCH QUEUE) */}
      <MassBroadcastSection activeAlert={activeAlert} />

      {/* 8. ROW 5: LOW BANDWIDTH (LEFT) + OFFLINE RELAY (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Low-Bandwidth Packet Technical Compactor */}
        <section className="glass-panel rounded-3xl p-5 md:p-6" aria-labelledby="low-bw-heading">
          <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                  09 / LOW-BANDWIDTH PACKET
                </span>
                <ProvenanceBadge type="DERIVED CONTENT" />
              </div>
              <h2 id="low-bw-heading" className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-rose-400" />
                <span>Compact UTF-8 Telegram</span>
              </h2>
            </div>

            <div className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300">
              {bandwidthPacket.bytes} BYTES
            </div>
          </div>

          <pre className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-52 leading-relaxed">
            {bandwidthPacket.text}
          </pre>

          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Encoding: UTF-8 / TextEncoder</span>
            <span>2G Delivery Time: &lt;0.12s</span>
          </div>
        </section>

        {/* Offline Relay Buffer (Labeled Simulated Nodes) */}
        <section className="glass-panel rounded-3xl p-5 md:p-6" aria-labelledby="offline-relay-heading">
          <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                  10 / OFFLINE COMMUNITY RELAY
                </span>
                <ProvenanceBadge type="DEMO TELEMETRY" />
              </div>
              <h2 id="offline-relay-heading" className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <span>Edge Store & Forward Mesh</span>
              </h2>
            </div>

            <button
              type="button"
              onClick={handleToggleOfflineMode}
              className={`text-xs font-mono font-bold px-3 py-1 rounded-full border transition-all ${
                offlineMode
                  ? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
                  : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {offlineMode ? 'GATEWAY OFFLINE' : 'GATEWAY ONLINE'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { name: 'Ward Community Relay', tag: 'SIMULATED NODE', status: 'SYNCHRONIZED' },
              { name: 'Cyclone Shelter 4B', tag: 'SIMULATED NODE', status: 'STANDBY' },
              { name: 'District Radio Desk', tag: 'SIMULATED NODE', status: 'LISTENING' },
              { name: 'Volunteer Bike Dispatch', tag: 'SIMULATED NODE', status: 'READY' },
            ].map((node) => (
              <div key={node.name} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-200 truncate">{node.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">{node.tag}</span>
                  <span className="text-emerald-400">{node.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 8. ROW 6: COMMUNITY RELAY NOTE (PERSISTENT IN LOCALSTORAGE) */}
      <section className="glass-panel rounded-3xl p-5 md:p-6 border border-amber-500/30" aria-labelledby="community-note-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-amber-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                11 / GROUND VOLUNTEER RELAY NOTE
              </span>
              <ProvenanceBadge type="COMMUNITY-GENERATED • NOT OFFICIAL" />
            </div>
            <h2 id="community-note-heading" className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-amber-400" />
              <span>Ground Volunteer Community Notes</span>
            </h2>
          </div>
          <span className="text-xs text-amber-300 font-mono">
            Appended Layer • Cannot Mutate Official Alert
          </span>
        </div>

        <div className="space-y-3">
          <textarea
            value={communityNote}
            onChange={(e) => setCommunityNote(e.target.value)}
            rows={3}
            placeholder="e.g. Ward 4 Community Center has clean drinking water and generator power. Avoid Sector 9 underpass due to standing water."
            className="w-full rounded-2xl bg-slate-950/70 border border-slate-800 p-3.5 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
          />

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              COMMUNITY-GENERATED • NOT OFFICIAL
            </span>
            <span className="font-mono">{communityNote.length} characters • Saved locally</span>
          </div>

          {communityNote && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
              <div className="flex items-center gap-2">
                <ProvenanceBadge type="COMMUNITY-GENERATED • NOT OFFICIAL" />
                <span className="text-[11px] text-slate-400">Recorded by Local Ward Volunteer</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 whitespace-pre-wrap leading-relaxed">
                {communityNote}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 9. ROW 7: PROVENANCE & SAFETY (COMPACT TAXONOMY GRID) */}
      <section className="glass-panel rounded-3xl p-5 md:p-6" aria-labelledby="provenance-heading">
        <div className="mb-4 pb-3 border-b border-slate-800">
          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block mb-1">
            12 / CONTENT PROVENANCE TAXONOMY
          </span>
          <h2 id="provenance-heading" className="text-lg font-bold text-slate-100">
            Audit Safeguards & Provenance Protocol
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <ProvenanceBadge type="OFFICIAL SOURCE CONTENT" />
            <h4 className="text-xs font-bold text-slate-200">Immutable Official Alert</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Direct from IMD/CAP authorities. Strictly read-only; cannot be altered downstream.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <ProvenanceBadge type="DERIVED CONTENT" />
            <h4 className="text-xs font-bold text-slate-200">Algorithmic Plain-Language</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Modulated for specific literacy groups while preserving hazard severity and action.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <ProvenanceBadge type="TRANSLATION" />
            <h4 className="text-xs font-bold text-slate-200">Regional Vernacular</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Non-authoritative regional translations in Hindi, Odia, Bengali, and Telugu.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <ProvenanceBadge type="COMMUNITY-GENERATED • NOT OFFICIAL" />
            <h4 className="text-xs font-bold text-slate-200">Community Ground Notes</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Volunteer observation layer displayed independently from official warnings.
            </p>
          </div>
        </div>
      </section>

      {/* 10. DEMO / STATUS FOOTER */}
      <footer className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-center space-y-1.5">
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs font-bold text-slate-300">
          <span className="text-rose-400 font-mono">ALERTSETU</span>
          <span className="text-slate-600">•</span>
          <span>LAST-MILE EMERGENCY INTELLIGENCE</span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-400">SAMPLE / SYNTHETIC DATA</span>
        </div>
        <p className="text-[11px] text-slate-500 max-w-xl mx-auto">
          All emergency alerts and delivery receipts shown are synthetic demonstrations designed to test resilient disaster communication pipelines under low-bandwidth and offline conditions.
        </p>
      </footer>
    </div>
  );
}

export default AlertSetuPage;
