import React from 'react';
import { OfficialEmergencyAlert, AlertSeverity } from '../../data/lastMileAlerts';
import { ProvenanceBadge } from './ProvenanceBadge';
import { ShieldAlert, MapPin, Calendar, Clock, Lock, FileText, AlertTriangle } from 'lucide-react';

interface AlertSourceCardProps {
  alerts: OfficialEmergencyAlert[];
  selectedAlert: OfficialEmergencyAlert;
  onSelectAlert: (alertId: string) => void;
}

export function getSeverityStyle(severity: AlertSeverity) {
  switch (severity) {
    case 'RED':
      return {
        badge: 'bg-red-500/20 text-red-300 border-red-500/40 ring-1 ring-red-500/30',
        border: 'border-red-500/40',
        bgGlow: 'from-red-500/10 via-transparent to-transparent',
        dot: 'bg-red-500',
        text: 'text-red-400',
      };
    case 'ORANGE':
      return {
        badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40 ring-1 ring-orange-500/30',
        border: 'border-orange-500/40',
        bgGlow: 'from-orange-500/10 via-transparent to-transparent',
        dot: 'bg-orange-500',
        text: 'text-orange-400',
      };
    case 'YELLOW':
    default:
      return {
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30',
        border: 'border-amber-500/40',
        bgGlow: 'from-amber-500/10 via-transparent to-transparent',
        dot: 'bg-amber-400',
        text: 'text-amber-400',
      };
  }
}

export const AlertSourceCard: React.FC<AlertSourceCardProps> = ({
  alerts,
  selectedAlert,
  onSelectAlert,
}) => {
  const currentSeverityStyle = getSeverityStyle(selectedAlert.severity);

  return (
    <section className="glass-panel rounded-3xl p-5 md:p-6" aria-labelledby="official-alert-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              01 / OFFICIAL SOURCE INTAKE
            </span>
            <ProvenanceBadge type="OFFICIAL SOURCE CONTENT" />
          </div>
          <h2 id="official-alert-heading" className="text-xl font-bold text-slate-100">
            Authoritative Emergency Bulletin
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Immutable Record (Read-Only)</span>
        </div>
      </div>

      {/* Alert Selector Tabs */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Select Authoritative Alert:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {alerts.map((item) => {
            const isSelected = item.id === selectedAlert.id;
            const sev = getSeverityStyle(item.severity);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectAlert(item.id)}
                className={`relative text-left p-3.5 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/40 ${
                  isSelected
                    ? 'bg-slate-800/80 border-rose-500/50 shadow-md ring-1 ring-rose-500/30'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-semibold text-slate-400 truncate">
                    {item.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border uppercase ${sev.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${sev.dot} animate-pulse`} />
                    {item.severity}
                  </span>
                </div>
                <div className="font-bold text-sm text-slate-200 truncate">{item.hazard}</div>
                <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{item.affectedArea}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Alert Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div
          className={`lg:col-span-2 rounded-2xl border ${currentSeverityStyle.border} bg-slate-900/50 p-5 md:p-6 relative overflow-hidden`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${currentSeverityStyle.bgGlow} pointer-events-none`}
          />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase ${currentSeverityStyle.badge}`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {selectedAlert.severity} ALERT • {selectedAlert.hazard.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800">
                CAP-ID: {selectedAlert.sourceReference}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-slate-100 leading-tight">
              {selectedAlert.headline}
            </h3>

            <p className="mt-3 text-sm md:text-base text-slate-300 leading-relaxed font-normal">
              {selectedAlert.body}
            </p>

            <div className="mt-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Mandatory Recommended Action:
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-200">
                {selectedAlert.recommendedAction}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong className="text-slate-400">Issued:</strong> {selectedAlert.issuedAt}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong className="text-slate-400">Valid Until:</strong> {selectedAlert.validUntil}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Provenance & Source Metadata Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Source Attribution
              </span>
              <FileText className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase">
                  Issuing Authority
                </label>
                <div className="text-sm font-semibold text-slate-200 mt-0.5">
                  {selectedAlert.source}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase">
                  Targeted Affected Area
                </label>
                <div className="text-xs text-slate-300 mt-0.5 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{selectedAlert.affectedArea}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase">
                  Geospatial Anchor
                </label>
                <div className="text-xs font-mono text-slate-300 mt-0.5">
                  Lat: {selectedAlert.coordinates.lat.toFixed(4)}°N, Lon:{' '}
                  {selectedAlert.coordinates.lon.toFixed(4)}°E
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3.5 rounded-xl border border-rose-500/25 bg-rose-500/5 text-xs text-rose-300 leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <Lock className="w-3.5 h-3.5" />
              Immutability Policy
            </div>
            Official source text cannot be altered by translation, visual conversion, or community notes.
          </div>
        </div>
      </div>
    </section>
  );
};
