import React from 'react';
import { AlertLanguage, LANGUAGE_OPTIONS, OfficialEmergencyAlert } from '../../data/lastMileAlerts';
import { getTranslation } from '../../services/lastMileAlertService';
import { ProvenanceBadge } from './ProvenanceBadge';
import { Globe2, Languages, MapPin, ShieldAlert, Sparkles } from 'lucide-react';

interface LanguageBankProps {
  alert: OfficialEmergencyAlert;
  selectedLanguage: AlertLanguage;
  onLanguageChange: (language: AlertLanguage) => void;
}

export const LanguageBank: React.FC<LanguageBankProps> = ({
  alert,
  selectedLanguage,
  onLanguageChange,
}) => {
  const translation = getTranslation(alert, selectedLanguage);

  return (
    <section className="glass-panel rounded-3xl p-5 md:p-6" aria-labelledby="language-bank-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              04 / REGIONAL LANGUAGE BANK
            </span>
            <ProvenanceBadge type="TRANSLATION" />
          </div>
          <h2 id="language-bank-heading" className="text-xl font-bold text-slate-100">
            Multilingual Emergency Translation
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Globe2 className="w-4 h-4 text-sky-400" />
          <span>5 Indian Regional Languages Supported</span>
        </div>
      </div>

      {/* Language Switcher Buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        {LANGUAGE_OPTIONS.map((item) => {
          const isSelected = selectedLanguage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onLanguageChange(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40 ${
                isSelected
                  ? 'bg-sky-500/20 border-sky-500/60 text-sky-200 shadow-md ring-1 ring-sky-500/30'
                  : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <span>{item.native}</span>
              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                {item.short}
              </span>
            </button>
          );
        })}
      </div>

      {/* Translated Content Display */}
      <div className="rounded-2xl border border-sky-500/30 bg-slate-900/50 p-5 md:p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase text-sky-400">
              Active Locale: {selectedLanguage}
            </span>
            <span className="text-xs text-slate-500">|</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Humanitarian Linguistic Adaptation
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800">
            Original: English (Official)
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-slate-100 leading-snug">
          {translation.headline}
        </h3>

        <p className="mt-3 text-sm md:text-base text-slate-200 leading-relaxed">
          {translation.body}
        </p>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              अनुशंसित कार्रवाई / Recommended Action
            </span>
            <p className="mt-1 text-sm font-semibold text-slate-200">{translation.action}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              प्रभावित क्षेत्र / Affected Area
            </span>
            <p className="mt-1 text-sm text-slate-300">{translation.area}</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Derived translation for rapid humanitarian uptake. Reference official CAP for legal notice.</span>
          <Languages className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </section>
  );
};
