import React from 'react';
import { VISUAL_ACTIONS } from '../../data/lastMileAlerts';
import { ProvenanceBadge } from './ProvenanceBadge';
import { Eye, Smartphone, Zap, Sparkles, Check } from 'lucide-react';

interface VisualStudioProps {
  visualMode: boolean;
  onToggleVisualMode: () => void;
  activeHazard?: string;
  activeSeverity?: string;
}

export const VisualStudio: React.FC<VisualStudioProps> = ({
  visualMode,
  onToggleVisualMode,
  activeHazard = 'Flood',
  activeSeverity = 'ORANGE',
}) => {
  return (
    <section className="glass-panel rounded-3xl p-5 md:p-6" aria-labelledby="visual-studio-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              05 / VISUAL STUDIO
            </span>
            <ProvenanceBadge type="VISUAL VERSION" />
          </div>
          <h2 id="visual-studio-heading" className="text-xl font-bold text-slate-100">
            Icon-First Emergency Action Cards
          </h2>
        </div>

        <button
          type="button"
          onClick={onToggleVisualMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/40 ${
            visualMode
              ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-md ring-1 ring-teal-500/30'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          aria-pressed={visualMode}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Visual Mode: {visualMode ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <p className="text-xs md:text-sm text-slate-400 mb-5">
        Optimized for zero-literacy populations, children, and rapid glanceability under high-stress conditions.
      </p>

      {/* Emergency Summary Badge */}
      <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 text-xl font-black">
            !
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-slate-400 uppercase">
              GLANCEABLE CRISIS CUE
            </div>
            <div className="text-sm font-bold text-slate-100">
              {activeSeverity} ALERT: {activeHazard.toUpperCase()} SAFETY PROTOCOL
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Smartphone className="w-4 h-4 text-teal-400" />
          <span>Universal Symbol Standard</span>
        </div>
      </div>

      {/* Visual action cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {VISUAL_ACTIONS.map((action, idx) => (
          <div
            key={action.label}
            className={`rounded-2xl p-4 border text-center transition-all duration-300 flex flex-col justify-between items-center ${
              visualMode
                ? 'bg-slate-900/60 border-slate-700/80 hover:border-teal-500/50 hover:bg-slate-850 transform hover:-translate-y-0.5'
                : 'bg-slate-900/30 border-slate-800 opacity-60'
            }`}
            role="article"
            aria-label={`Action: ${action.label}`}
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center text-3xl mb-3 shadow-inner">
              {action.icon}
            </div>

            <div className="w-full">
              <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                STEP 0{idx + 1}
              </span>
              <h4 className="text-xs md:text-sm font-bold text-slate-200 leading-tight mb-1">
                {action.label}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium">{action.labelHi}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
