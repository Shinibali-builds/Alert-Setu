import React from 'react';
import { FileText, CircleAlert, Languages, Smartphone, Send, CheckCircle2, ChevronRight } from 'lucide-react';

interface ProcessFlowProps {
  currentStep: number;
  onStepSelect?: (stepIndex: number) => void;
}

export const ProcessFlow: React.FC<ProcessFlowProps> = ({ currentStep, onStepSelect }) => {
  const steps = [
    {
      num: '01',
      title: 'Official Alert',
      icon: FileText,
      desc: 'Immutable source alert',
    },
    {
      num: '02',
      title: 'Plain Language',
      icon: CircleAlert,
      desc: 'Audience-specific wording',
    },
    {
      num: '03',
      title: 'Translation',
      icon: Languages,
      desc: 'Local language version',
    },
    {
      num: '04',
      title: 'Visual Version',
      icon: Smartphone,
      desc: 'Icon-first cards',
    },
    {
      num: '05',
      title: 'Delivery',
      icon: Send,
      desc: 'Simulated last-mile channel',
    },
    {
      num: '06',
      title: 'Acknowledgement',
      icon: CheckCircle2,
      desc: 'Receipt confirmation',
    },
  ];

  return (
    <section className="glass-panel rounded-3xl p-5 md:p-6" aria-label="Emergency Communication Pipeline Stages">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            03 / COMMUNICATION PIPELINE
          </span>
          <h2 className="mt-1 text-xl font-bold text-slate-100">AlertSetu Process Flow</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Active Step:</span>
          <span className="font-mono font-bold text-rose-400">
            {currentStep + 1} / {steps.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = currentStep === idx;
          const isComplete = currentStep > idx;

          return (
            <button
              key={step.num}
              type="button"
              onClick={() => onStepSelect && onStepSelect(idx)}
              className={`relative text-left rounded-2xl p-4 transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-rose-500/50 ${
                isCurrent
                  ? 'bg-rose-500/15 border-rose-500/50 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/30'
                  : isComplete
                  ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold ${
                    isCurrent ? 'text-rose-400' : isComplete ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {step.num}
                </span>
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Icon
                    className={`w-4 h-4 ${
                      isCurrent ? 'text-rose-400 animate-pulse' : 'text-slate-500'
                    }`}
                  />
                )}
              </div>

              <h3 className="mt-3 text-sm font-bold text-slate-200 truncate">{step.title}</h3>
              <p className="mt-1 text-xs text-slate-400 line-clamp-1">{step.desc}</p>

              {idx < steps.length - 1 && (
                <div className="hidden xl:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 items-center justify-center pointer-events-none text-slate-400">
                  <ChevronRight className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
