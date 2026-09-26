import React from 'react';
import { AGROMET_ADVISORIES } from '../data/mausamWeatherData';
import { Sprout, Droplets, Bug, AlertTriangle, CheckCircle2, ShieldCheck, Sun } from 'lucide-react';

export const AgrometView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Gramin Krishi Mausam Sewa (GKMS)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Agrometeorological Advisory Bulletin
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Field-level micro-climate advisory for agrarian belts, irrigation management, and crop-specific pest defenses.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-xl text-emerald-300">
            <ShieldCheck className="w-4 h-4" />
            <span>Kharif Crop Cycle 2026</span>
          </div>
        </div>
      </div>

      {/* Advisories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {AGROMET_ADVISORIES.map((adv) => (
          <div key={adv.crop} className="glass-panel rounded-3xl p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-100">{adv.crop}</h3>
                <span className="text-xs text-slate-400">Varieties: {adv.variety}</span>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {adv.stage}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="font-bold text-sky-400 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                  <Droplets className="w-3.5 h-3.5" />
                  Soil Moisture & Drainage Direction
                </span>
                <p className="text-slate-300">{adv.soilMoistureStatus}</p>
                <p className="text-slate-400 text-[11px] font-medium">{adv.irrigationNotice}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                  <Bug className="w-3.5 h-3.5" />
                  Pest & Disease Forewarning
                </span>
                <p className="text-slate-300">{adv.pestRisk}</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Recommended Cultural Practice
                </span>
                <p className="text-slate-200 font-semibold">{adv.recommendedAction}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
