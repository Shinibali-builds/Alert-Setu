import React from 'react';
import { Audience, getPlainLanguage } from '../../services/lastMileAlertService';
import { OfficialEmergencyAlert } from '../../data/lastMileAlerts';
import { ProvenanceBadge } from './ProvenanceBadge';
import { Users, BookOpen, HeartHandshake, Accessibility, Compass, AlertCircle, CheckCircle } from 'lucide-react';

interface AudiencePreviewProps {
  alert: OfficialEmergencyAlert;
  audience: Audience;
  onAudienceChange: (audience: Audience) => void;
}

const AUDIENCE_OPTIONS: { id: Audience; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  {
    id: 'General Public',
    label: 'General Public',
    icon: Users,
    desc: 'Clear, concise everyday emergency language',
  },
  {
    id: 'Low Literacy',
    label: 'Low Literacy',
    icon: BookOpen,
    desc: 'Step-by-step action phrases, bold warning cues',
  },
  {
    id: 'Older Adults',
    label: 'Older Adults',
    icon: HeartHandshake,
    desc: 'High contrast, medication & shelter guidance',
  },
  {
    id: 'People with Disabilities',
    label: 'Disabilities',
    icon: Accessibility,
    desc: 'Power backup, accessibility routes & helplines',
  },
  {
    id: 'Visitors / New Residents',
    label: 'Visitors / New',
    icon: Compass,
    desc: 'Navigational cautions, landmarks & verified shelters',
  },
];

export const AudiencePreview: React.FC<AudiencePreviewProps> = ({
  alert,
  audience,
  onAudienceChange,
}) => {
  const plain = getPlainLanguage(alert, audience);
  const isLowLit = audience === 'Low Literacy';
  const isOlder = audience === 'Older Adults';

  return (
    <section className="glass-panel rounded-3xl p-5 md:p-6" aria-labelledby="audience-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              02 / AUDIENCE MODULATION
            </span>
            <ProvenanceBadge type="PLAIN-LANGUAGE VERSION" />
          </div>
          <h2 id="audience-heading" className="text-xl font-bold text-slate-100">
            Target Audience Plain-Language Engine
          </h2>
        </div>
        <span className="text-xs text-slate-400">
          Transforming complex CAP terminology into accessible phrasing
        </span>
      </div>

      {/* Audience selector buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-6">
        {AUDIENCE_OPTIONS.map((item) => {
          const Icon = item.icon;
          const isSelected = audience === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onAudienceChange(item.id)}
              className={`text-left p-3 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/40 ${
                isSelected
                  ? 'bg-rose-500/20 border-rose-500/60 shadow-md ring-1 ring-rose-500/40'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={`w-4 h-4 ${
                    isSelected ? 'text-rose-400' : 'text-slate-400'
                  }`}
                />
                <span className="text-xs font-bold text-slate-200 truncate">{item.label}</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-tight">
                {item.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Audience Preview Card */}
      <div
        className={`rounded-2xl border p-5 md:p-6 transition-all duration-200 ${
          isLowLit
            ? 'bg-amber-950/20 border-amber-500/40 text-amber-100'
            : isOlder
            ? 'bg-indigo-950/20 border-indigo-500/40'
            : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">
              Audience Mode:
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-white/10 text-white">
              {audience}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Source Anchor: <strong className="text-slate-300">{alert.hazard}</strong> (
            {alert.severity})
          </span>
        </div>

        {/* Dynamic Typography based on audience mode */}
        <h3
          className={`font-black text-slate-100 ${
            isLowLit
              ? 'text-2xl md:text-3xl tracking-wide uppercase text-amber-200'
              : isOlder
              ? 'text-xl md:text-2xl font-bold'
              : 'text-lg md:text-xl font-bold'
          }`}
        >
          {plain.headline}
        </h3>

        <div
          className={`mt-4 whitespace-pre-line leading-relaxed ${
            isLowLit
              ? 'text-base md:text-lg font-bold text-slate-100 bg-black/40 p-4 rounded-xl border border-amber-500/30'
              : isOlder
              ? 'text-base text-slate-200 leading-8'
              : 'text-sm md:text-base text-slate-300'
          }`}
        >
          {plain.body}
        </div>

        <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Immediate Safety Directive
            </div>
            <p
              className={`mt-1 font-bold ${
                isLowLit ? 'text-base text-emerald-300' : 'text-sm text-slate-200'
              }`}
            >
              {plain.action}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            Derived content preserves official severity ({alert.severity}) & affected area.
          </span>
          <span className="hidden sm:inline-block font-mono text-[11px]">
            Target: {alert.affectedArea}
          </span>
        </div>
      </div>
    </section>
  );
};
