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

import {
  Siren,
  Wifi,
  WifiOff,
  Radio,
  HeartHandshake,
  AlertTriangle,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Languages,
  RotateCw,
} from 'lucide-react';

export function AlertSetuPage() {
  const [selectedAlertId, setSelectedAlertId] = useState<string>(SAMPLE_ALERTS[0]?.id ?? '');
  const [audience, setAudience] = useState<Audience>('General Public');
  const [language, setLanguage] = useState<AlertLanguage>('English');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('SMS');
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [lowBandwidth, setLowBandwidth] = useState<boolean>(true);
  const [visualMode, setVisualMode] = useState<boolean>(true);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [communityNote, setCommunityNote] = useState<string>('');
  const [receipts, setReceipts] = useState<DeliveryReceipt[]>(() => loadReceipts());
  const [sending, setSending] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setActiveToast(msg);
    const t = setTimeout(() => setActiveToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  // Save receipts to localStorage whenever updated
  useEffect(() => {
    saveReceipts(receipts);
  }, [receipts]);

  const activeAlert: OfficialEmergencyAlert = useMemo(() => {
    return SAMPLE_ALERTS.find((a) => a.id === selectedAlertId) || SAMPLE_ALERTS[0];
  }, [selectedAlertId]);

  const translation = useMemo(() => {
    return getTranslation(activeAlert, language);
  }, [activeAlert, language]);

  const bandwidthPacket = useMemo(() => {
    return encodeLowBandwidthPayload(activeAlert, translation, !lowBandwidth);
  }, [activeAlert, translation, lowBandwidth]);

  // Delivery simulation with deterministic asynchronous state progression
  const handleSimulateDelivery = useCallback(
    (channel: DeliveryMode, targets: string[]) => {
      if (sending) return;

      const created = createReceipts(activeAlert, channel, targets, bandwidthPacket.bytes);
      const activeReceipts = created.map((r) => ({
        ...r,
        status: 'queued' as const,
      }));

      setReceipts((prev) => [...activeReceipts, ...prev].slice(0, 100));
      setSending(true);
      setPipelineStep(4); // Stage 5: Delivery
      showToast(`Transmission queued for ${targets.length} target node(s)`);

      // Progress through state machine: QUEUED -> SYNCING -> SENT -> DELIVERED
      setTimeout(() => {
        setReceipts((current) =>
          current.map((r) =>
            activeReceipts.some((ar) => ar.id === r.id) ? { ...r, status: 'syncing' } : r
          )
        );
      }, 350);

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
    [activeAlert, bandwidthPacket.bytes, sending, showToast]
  );

  // Acknowledge receipt
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

  // Retry failed delivery
  const handleRetry = useCallback((receiptId: string) => {
    setReceipts((current) =>
      current.map((r) =>
        r.id === receiptId
          ? {
              ...r,
              status: 'queued',
              retryCount: (r.retryCount || 0) + 1,
            }
          : r
      )
    );
    showToast('Scheduled retry for delivery packet');
    setTimeout(() => {
      setReceipts((current) =>
        current.map((r) =>
          r.id === receiptId
            ? { ...r, status: 'delivered', deliveredAt: new Date().toISOString() }
            : r
        )
      );
    }, 1000);
  }, [showToast]);

  const handleClearReceipts = useCallback(() => {
    setReceipts([]);
    localStorage.removeItem('alertsetu-receipts-v1');
    showToast('Receipt audit log cleared');
  }, [showToast]);

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* 1. ALERTSETU MASTHEAD */}
      <section className="glass-panel-accent rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-700/60 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                <Siren className="w-3.5 h-3.5 animate-pulse" />
                ALERTSETU
              </span>
              <span className="text-xs font-mono text-slate-400">
                MODULE v2.6 • MAUSAM ECOSYSTEM
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEM READY
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              LAST-MILE EMERGENCY INTELLIGENCE
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Turn official warnings into clear, multilingual, visual and low-bandwidth actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <ProvenanceBadge type="SAMPLE / SYNTHETIC DATA" />
            <ProvenanceBadge type="DEMO TELEMETRY" />
            <button
              type="button"
              onClick={() => {
                setOfflineMode((v) => !v);
                showToast(offlineMode ? 'Network restored' : 'Offline simulation active');
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                offlineMode
                  ? 'border-amber-500/60 bg-amber-500/20 text-amber-300'
                  : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {offlineMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>OFFLINE MODE</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ONLINE RELAY</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dashboard Top Summary Metrics */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">ACTIVE ALERTS</span>
            <span className="text-xl sm:text-2xl font-black text-rose-300 font-mono mt-0.5 block">
              {SAMPLE_ALERTS.length} BULLETINS
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">TARGETS MONITORED</span>
            <span className="text-xl sm:text-2xl font-black text-slate-100 font-mono mt-0.5 block">
              {Math.max(receipts.length, 12)} NODES
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">DELIVERED PACKETS</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-300 font-mono mt-0.5 block">
              {receipts.filter((r) => r.status === 'delivered' || r.status === 'acknowledged').length}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">ACKNOWLEDGED</span>
            <span className="text-xl sm:text-2xl font-black text-teal-300 font-mono mt-0.5 block">
              {receipts.filter((r) => r.status === 'acknowledged').length}
            </span>
          </div>
        </div>
      </section>

      {/* 2. OFFICIAL ALERT SELECTOR */}
      <AlertSourceCard
        alerts={SAMPLE_ALERTS}
        selectedAlert={activeAlert}
        onSelectAlert={(id) => {
          setSelectedAlertId(id);
          setPipelineStep(0);
          showToast(`Switched active advisory to ${id}`);
        }}
      />

      {/* 3. TARGET AUDIENCE SELECTOR */}
      <AudiencePreview
        alert={activeAlert}
        audience={audience}
        onAudienceChange={(aud) => {
          setAudience(aud);
          setPipelineStep(1);
          showToast(`Modulated plain language for: ${aud}`);
        }}
      />

      {/* 4. PROCESS FLOW CHART */}
      <ProcessFlow
        currentStep={pipelineStep}
        onStepSelect={(step) => {
          setPipelineStep(step);
        }}
      />

      {/* 5. LANGUAGE BANK */}
      <LanguageBank
        alert={activeAlert}
        selectedLanguage={language}
        onLanguageChange={(lang) => {
          setLanguage(lang);
          setPipelineStep((prev) => Math.max(prev, 2));
          showToast(`Regional translation switched to ${lang}`);
        }}
      />

      {/* 6. VISUAL STUDIO */}
      <VisualStudio
        visualMode={visualMode}
        onToggleVisualMode={() => {
          setVisualMode((v) => !v);
          setPipelineStep((prev) => Math.max(prev, 3));
        }}
        activeHazard={activeAlert.hazard}
        activeSeverity={activeAlert.severity}
      />

      {/* 7. AFFECTED AREA MAP */}
      <AlertMap alert={activeAlert} />

      {/* 8. SIMULATED DELIVERY */}
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
        onToggleOfflineMode={() => setOfflineMode((v) => !v)}
      />

      {/* 9. LOW-BANDWIDTH PACKET */}
      <section className="glass-panel rounded-3xl p-5 md:p-6" aria-labelledby="low-bw-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                09 / LOW-BANDWIDTH PACKET COMPACTOR
              </span>
              <ProvenanceBadge type="DERIVED CONTENT" />
            </div>
            <h2 id="low-bw-heading" className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-teal-400" />
              <span>Compact Emergency Data Telegram</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl border border-teal-500/40 bg-teal-500/10 text-teal-300 font-bold">
              {bandwidthPacket.bytes} BYTES
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Compresses CAP schema into an ultra-lean JSON object stripped of metadata, guaranteeing rapid delivery across congested 2G networks, SMS payloads, or edge LoRa relays.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl bg-slate-950/80 border border-slate-800 p-4">
            <div className="text-[11px] font-mono text-slate-400 uppercase mb-2 flex items-center justify-between">
              <span>RAW TELEGRAM PAYLOAD</span>
              <span className="text-emerald-400 font-bold">{bandwidthPacket.bytes} Bytes</span>
            </div>
            <pre className="font-mono text-xs text-teal-300 overflow-x-auto leading-relaxed max-h-56">
              {bandwidthPacket.text}
            </pre>
          </div>

          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-4 space-y-3 text-xs">
            <div className="font-bold text-slate-200 uppercase text-[11px] tracking-wider">
              Network Efficiency Report
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Payload Size:</span>
              <span className="font-mono text-emerald-400 font-bold">{bandwidthPacket.bytes} B</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Standard 2G Tx Time:</span>
              <span className="font-mono text-slate-300">&lt; 0.12 sec</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>SMS Character Segments:</span>
              <span className="font-mono text-slate-300">1 Segment</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Encoding:</span>
              <span className="font-mono text-slate-300">UTF-8 / TextEncoder</span>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 leading-tight">
              Calculated using browser-native TextEncoder. Suitable for packet radio, satellite SMS, and low-power mesh radios.
            </div>
          </div>
        </div>
      </section>

      {/* 10. OFFLINE RELAY BUFFER */}
      <section className="glass-panel rounded-3xl p-5 md:p-6" aria-labelledby="offline-relay-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                10 / OFFLINE COMMUNITY RELAY
              </span>
              <ProvenanceBadge type="DEMO TELEMETRY" />
            </div>
            <h2 id="offline-relay-heading" className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Radio className="w-5 h-5 text-indigo-400" />
              <span>Offline Edge Mesh Store & Forward</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                offlineMode
                  ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
                  : 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
              }`}
            >
              {offlineMode ? 'ISOLATED MESH ACTIVE' : 'CLOUD GATEWAY LINKED'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: 'Ward Community Relay', status: 'SYNCHRONIZED', count: '142 Households' },
            { name: 'Cyclone Shelter 4B', status: 'LISTENING', count: '520 Evacuees' },
            { name: 'District Radio Desk', status: 'BROADCASTING', count: 'FM 102.4 MHz' },
            { name: 'Volunteer Bike Dispatch', status: 'EN ROUTE', count: 'Handheld Megaphones' },
          ].map((node) => (
            <div key={node.name} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-200">{node.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-emerald-400 font-mono text-[11px] font-semibold">{node.status}</div>
              <div className="text-slate-400 text-[11px] mt-1">{node.count}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. RECEIPT TRACKER */}
      <ReceiptTracker
        receipts={receipts}
        onAcknowledge={handleAcknowledge}
        onRetry={handleRetry}
        onClearReceipts={handleClearReceipts}
      />

      {/* 12. COMMUNITY RELAY NOTE */}
      <section className="glass-panel rounded-3xl p-5 md:p-6" aria-labelledby="community-note-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                12 / COMMUNITY RELAY NOTE
              </span>
              <ProvenanceBadge type="COMMUNITY-GENERATED • NOT OFFICIAL" />
            </div>
            <h2 id="community-note-heading" className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-amber-400" />
              <span>Ground Volunteer Community Notes</span>
            </h2>
          </div>
          <span className="text-xs text-amber-400/90 font-mono">
            Appended Layer • Cannot Mutate Official Alert
          </span>
        </div>

        <div className="space-y-4">
          <label className="text-xs text-slate-300 block font-semibold">
            Input Ground Observations or Shelter Directions (e.g. fallen tree locations, open relief kitchen locations):
          </label>

          <textarea
            value={communityNote}
            onChange={(e) => setCommunityNote(e.target.value)}
            rows={4}
            placeholder="e.g. Ward 4 Community Center has clean drinking water and generator power. Avoid Sector 9 underpass due to 3ft standing water."
            className="w-full rounded-2xl bg-slate-950/70 border border-slate-800 p-4 text-xs md:text-sm text-slate-200 placeholder-slate-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
          />

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              COMMUNITY-GENERATED • NOT OFFICIAL
            </span>
            <span>Character count: {communityNote.length}</span>
          </div>

          {communityNote && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center gap-2">
                <ProvenanceBadge type="COMMUNITY-GENERATED • NOT OFFICIAL" />
                <span className="text-xs text-slate-400">Recorded by Local Relay Operator</span>
              </div>
              <p className="text-xs md:text-sm text-amber-100 font-medium whitespace-pre-wrap leading-relaxed">
                {communityNote}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 13. PROVENANCE & SAFETY */}
      <section className="glass-panel rounded-3xl p-5 md:p-6" aria-labelledby="provenance-heading">
        <div className="mb-5 pb-4 border-b border-slate-800">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-1">
            13 / PROVENANCE SYSTEM & SAFETY AUDIT
          </span>
          <h2 id="provenance-heading" className="text-xl font-bold text-slate-100">
            Emergency Content Provenance Taxonomy
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            To prevent misinformation and unauthorized mutations during natural hazards, every piece of information is strictly categorized.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <ProvenanceBadge type="OFFICIAL SOURCE CONTENT" />
            <h4 className="text-xs font-bold text-slate-200">Immutable Official Alert</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Direct from meteorological authorities (IMD/CAP). Guaranteed read-only. Cannot be modified by users or downstream engines.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
            <ProvenanceBadge type="DERIVED CONTENT" />
            <h4 className="text-xs font-bold text-slate-200">Algorithmic Plain-Language</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Derived for specific literacy groups. Preserves severity, hazard type, and boundary while simplifying phrasing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/30 space-y-2">
            <ProvenanceBadge type="TRANSLATION" />
            <h4 className="text-xs font-bold text-slate-200">Regional Translation</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Linguistic adaptation for vernacular audiences. Clearly demarcated as non-authoritative machine translation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <ProvenanceBadge type="COMMUNITY-GENERATED • NOT OFFICIAL" />
            <h4 className="text-xs font-bold text-slate-200">Community Relay Notes</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Crowdsourced ground observations. Displayed as a separate layer, never altering official advisories.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Strict CAP Schema Integrity</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Audit-Logged Local Telemetry</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Deterministic State Machine</span>
          </div>
        </div>
      </section>

      {/* 14. DEMO / STATUS FOOTER */}
      <footer className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-center space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-300">
          <span className="text-rose-400">ALERTSETU</span>
          <span className="text-slate-600">•</span>
          <span>LAST-MILE EMERGENCY INTELLIGENCE</span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-400">SAMPLE / SYNTHETIC DATA</span>
        </div>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          All emergency warnings and delivery telemetry shown in this interface are synthetic demonstrations designed to test resilient last-mile disaster communication infrastructure.
        </p>
      </footer>
    </div>
  );
}

export default AlertSetuPage;
