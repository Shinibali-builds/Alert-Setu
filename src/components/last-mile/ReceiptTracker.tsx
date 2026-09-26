import React from 'react';
import { DeliveryReceipt, DeliveryStatus } from '../../services/lastMileAlertService';
import { ProvenanceBadge } from './ProvenanceBadge';
import {
  Clock3,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  CheckCheck,
  Send,
  Radio,
  FileCheck,
  XCircle,
  Hash,
} from 'lucide-react';

interface ReceiptTrackerProps {
  receipts: DeliveryReceipt[];
  onAcknowledge: (receiptId: string) => void;
  onRetry: (receiptId: string) => void;
  onClearReceipts?: () => void;
}

const STATUS_CONFIG: Record<
  DeliveryStatus,
  { label: string; badge: string; icon: React.ComponentType<{ className?: string }> }
> = {
  queued: {
    label: 'QUEUED',
    badge: 'bg-slate-700/50 text-slate-300 border-slate-600',
    icon: Clock3,
  },
  syncing: {
    label: 'SYNCING',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40 animate-pulse',
    icon: RotateCw,
  },
  sent: {
    label: 'SENT',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    icon: Send,
  },
  delivered: {
    label: 'DELIVERED',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: CheckCircle2,
  },
  acknowledged: {
    label: 'ACKNOWLEDGED',
    badge: 'bg-teal-500/25 text-teal-200 border-teal-500/50 font-black',
    icon: CheckCheck,
  },
  failed: {
    label: 'FAILED',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    icon: XCircle,
  },
};

export const ReceiptTracker: React.FC<ReceiptTrackerProps> = ({
  receipts,
  onAcknowledge,
  onRetry,
  onClearReceipts,
}) => {
  // Compute aggregate counters
  const total = receipts.length;
  const sentCount = receipts.filter(
    (r) => r.status === 'sent' || r.status === 'delivered' || r.status === 'acknowledged'
  ).length;
  const deliveredCount = receipts.filter(
    (r) => r.status === 'delivered' || r.status === 'acknowledged'
  ).length;
  const ackCount = receipts.filter((r) => r.status === 'acknowledged').length;
  const failedCount = receipts.filter((r) => r.status === 'failed').length;

  return (
    <section className="glass-panel rounded-3xl p-5 md:p-6" aria-labelledby="receipt-tracker-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              08 / DELIVERY RECEIPT & ACKNOWLEDGEMENT
            </span>
            <ProvenanceBadge type="DEMO TELEMETRY" />
          </div>
          <h2 id="receipt-tracker-heading" className="text-xl font-bold text-slate-100">
            Receipt Telemetry & Confirmation Log
          </h2>
        </div>

        {receipts.length > 0 && onClearReceipts && (
          <button
            type="button"
            onClick={onClearReceipts}
            className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1 rounded-lg border border-slate-800 hover:bg-slate-800/40 transition-colors"
          >
            Clear Log
          </button>
        )}
      </div>

      {/* Aggregate Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
            TOTAL TARGETS
          </span>
          <span className="text-2xl font-bold text-slate-100 mt-1 block font-mono">{total}</span>
        </div>

        <div className="p-3.5 rounded-2xl border border-indigo-500/20 bg-indigo-950/20">
          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase block">
            TRANSMITTED
          </span>
          <span className="text-2xl font-bold text-indigo-200 mt-1 block font-mono">{sentCount}</span>
        </div>

        <div className="p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-950/20">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">
            DELIVERED
          </span>
          <span className="text-2xl font-bold text-emerald-200 mt-1 block font-mono">
            {deliveredCount}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl border border-teal-500/30 bg-teal-950/30">
          <span className="text-[10px] font-mono font-bold text-teal-300 uppercase block">
            ACKNOWLEDGED
          </span>
          <span className="text-2xl font-bold text-teal-200 mt-1 block font-mono">{ackCount}</span>
        </div>

        <div className="p-3.5 rounded-2xl border border-rose-500/20 bg-rose-950/20 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono font-bold text-rose-400 uppercase block">
            FAILED / RETRIED
          </span>
          <span className="text-2xl font-bold text-rose-200 mt-1 block font-mono">
            {failedCount}
          </span>
        </div>
      </div>

      {/* Receipts Table / Cards */}
      {receipts.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <Radio className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-pulse" />
          <p className="text-sm font-semibold text-slate-400">No active delivery dispatches</p>
          <p className="text-xs text-slate-500 mt-1">
            Simulate a transmission above via SMS, Low-BW Packet, or Mesh Relay to generate audit telemetry.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Receipt ID / Target</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Queued</th>
                  <th className="py-3 px-4">Delivered</th>
                  <th className="py-3 px-4">Ack</th>
                  <th className="py-3 px-4">Payload</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 bg-slate-950/40">
                {receipts.map((r) => {
                  const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.queued;
                  const Icon = cfg.icon;

                  return (
                    <tr key={r.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-200 font-mono">{r.target}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">
                          {r.id}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-300">{r.channel}</td>
                      <td className="py-3 px-4" aria-live="polite">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.badge}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{cfg.label}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {r.queuedAt ? new Date(r.queuedAt).toLocaleTimeString() : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {r.deliveredAt ? new Date(r.deliveredAt).toLocaleTimeString() : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-teal-300">
                        {r.acknowledgedAt ? new Date(r.acknowledgedAt).toLocaleTimeString() : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">{r.bytes} B</td>
                      <td className="py-3 px-4 text-right">
                        {r.status === 'delivered' && (
                          <button
                            type="button"
                            onClick={() => onAcknowledge(r.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors shadow-sm"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Mark Ack</span>
                          </button>
                        )}
                        {r.status === 'acknowledged' && (
                          <span className="text-[11px] text-teal-400 font-bold flex items-center justify-end gap-1">
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        )}
                        {r.status === 'failed' && (
                          <button
                            type="button"
                            onClick={() => onRetry(r.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            <span>Retry</span>
                          </button>
                        )}
                        {(r.status === 'queued' || r.status === 'syncing' || r.status === 'sent') && (
                          <span className="text-[11px] text-slate-500 font-mono">In transit</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="md:hidden space-y-3">
            {receipts.map((r) => {
              const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.queued;
              const Icon = cfg.icon;

              return (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-200 text-sm">{r.target}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{r.channel}</div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.badge}`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{cfg.label}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                    <div>Queued: {r.queuedAt ? new Date(r.queuedAt).toLocaleTimeString() : '—'}</div>
                    <div>
                      Delivered: {r.deliveredAt ? new Date(r.deliveredAt).toLocaleTimeString() : '—'}
                    </div>
                  </div>

                  {r.status === 'delivered' && (
                    <button
                      type="button"
                      onClick={() => onAcknowledge(r.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span>MARK ACKNOWLEDGEMENT RECEIVED</span>
                    </button>
                  )}

                  {r.status === 'acknowledged' && (
                    <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-teal-300">
                      <CheckCheck className="w-4 h-4" />
                      <span>ACKNOWLEDGED & CONFIRMED</span>
                    </div>
                  )}

                  {r.status === 'failed' && (
                    <button
                      type="button"
                      onClick={() => onRetry(r.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span>RETRY TRANSMISSION</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Audit Banner */}
      <div
        className="mt-5 p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200 flex items-start gap-2.5"
        role="status"
      >
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">
            DEMO TELEMETRY — NOT PROOF OF REAL-WORLD RECEIPT
          </strong>
          <span>
            Telemetry timestamps and acknowledgement handshakes demonstrate the resilient state machine pipeline for disaster command centers.
          </span>
        </div>
      </div>
    </section>
  );
};
