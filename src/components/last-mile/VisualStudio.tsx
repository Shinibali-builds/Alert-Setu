import React, { useState } from 'react';
import { VISUAL_ACTIONS } from '../../data/lastMileAlerts';
import { ProvenanceBadge } from './ProvenanceBadge';
import { Smartphone, Zap, Check } from 'lucide-react';

interface VisualStudioProps {
  visualMode: boolean;
  onToggleVisualMode: () => void;
  activeHazard?: string;
  activeSeverity?: string;
  audience?: string;
}

export const VisualStudio: React.FC<VisualStudioProps> = ({
  visualMode,
  onToggleVisualMode,
  activeHazard = 'Flood',
  activeSeverity = 'ORANGE',
  audience = 'General Public',
}) => {
  const [selectedLabels, setSelectedLabels] = useState<string[]>(['Stay safe indoors', 'Avoid flood water']);
  const isLowLiteracy = audience === 'Low Literacy';

  const toggleAction = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <section className="glass-panel rounded-3xl p-5 md:p-6" aria-labelledby="visual-studio-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              05 / VISUAL STUDIO
            </span>
            <ProvenanceBadge type="VISUAL VERSION" />
            {isLowLiteracy && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ENLARGED PICTOGRAPHIC MODE
              </span>
            )}
          </div>
          <h2 id="visual-studio-heading" className="text-lg font-bold text-slate-100">
            Icon-First Emergency Action Cards
          </h2>
        </div>

        <button
          type="button"
          onClick={onToggleVisualMode}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/40 ${
            visualMode
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          aria-pressed={visualMode}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Visual Mode: {visualMode ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Emergency Summary Badge */}
      <div className="mb-4 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 text-base font-black">
            !
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">
              UNIVERSAL CRISIS CUE
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-100">
              {activeSeverity} ALERT: {activeHazard.toUpperCase()} SAFETY ACTIONS
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono hidden sm:flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-slate-400" />
          <span>{selectedLabels.length} Active Protocol(s)</span>
        </div>
      </div>

      {/* Visual action cards grid - Interactive and scalable for Low Literacy */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {VISUAL_ACTIONS.map((action, idx) => {
          const isSelected = selectedLabels.includes(action.label);

          return (
            <button
              key={action.label}
              type="button"
              onClick={() => toggleAction(action.label)}
              aria-pressed={isSelected}
              className={`relative rounded-2xl p-3.5 text-center transition-all duration-200 flex flex-col justify-between items-center border text-left focus:outline-none focus:ring-2 focus:ring-rose-500/50 ${
                isSelected
                  ? 'bg-rose-500/15 border-rose-500/50 shadow-md shadow-rose-950/30 ring-1 ring-rose-500/40'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              } ${!visualMode ? 'opacity-60' : ''}`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}

              <div
                className={`rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center mb-2 shadow-inner transition-transform duration-200 ${
                  isLowLiteracy ? 'w-16 h-16 text-4xl' : 'w-12 h-12 text-2xl'
                }`}
              >
                {action.icon}
              </div>

              <div className="w-full text-center">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">
                  STEP 0{idx + 1}
                </span>
                <h4
                  className={`font-bold leading-tight mb-0.5 text-slate-200 ${
                    isLowLiteracy ? 'text-sm sm:text-base font-black text-white' : 'text-xs'
                  }`}
                >
                  {action.label}
                </h4>
                <p
                  className={`text-slate-400 font-medium ${
                    isLowLiteracy ? 'text-xs text-amber-200' : 'text-[10px]'
                  }`}
                >
                  {action.labelHi}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
