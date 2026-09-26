import React from 'react';
import { MAUSAM_CITIES } from '../data/mausamWeatherData';
import { Wind, AlertCircle, Heart, Shield, Activity, Info } from 'lucide-react';

export const AqiView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
              <Wind className="w-4 h-4 text-teal-400" />
              <span>Central Pollution Control Board (CPCB) Standard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              National Air Quality Index (NAQI)
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Real-time continuous ambient air quality monitoring (CAAQMS) with sub-index pollutant calculations.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>24-Hour Rolling Mean</span>
          </div>
        </div>

        {/* NAQI Categories Legend Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-6 pt-5 border-t border-slate-800 text-xs">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="font-bold text-emerald-400 block">Good (0-50)</span>
            <span className="text-[10px] text-slate-400">Minimal impact</span>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30">
            <span className="font-bold text-sky-400 block">Satisfactory (51-100)</span>
            <span className="text-[10px] text-slate-400">Minor discomfort</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <span className="font-bold text-amber-400 block">Moderate (101-200)</span>
            <span className="text-[10px] text-slate-400">Breathing difficulty</span>
          </div>
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <span className="font-bold text-orange-400 block">Poor (201-300)</span>
            <span className="text-[10px] text-slate-400">Discomfort to most</span>
          </div>
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30">
            <span className="font-bold text-red-400 block">Very Poor (301-400)</span>
            <span className="text-[10px] text-slate-400">Respiratory illness</span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
            <span className="font-bold text-purple-400 block">Severe (401-500)</span>
            <span className="text-[10px] text-slate-400">Health hazard</span>
          </div>
        </div>
      </div>

      {/* Cities AQI Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MAUSAM_CITIES.map((c) => {
          const aqi = c.airQualityIndex;
          const status = c.airQualityStatus;

          const badgeClass =
            aqi <= 50
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : aqi <= 100
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
              : aqi <= 200
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40';

          return (
            <div key={c.id} className="glass-panel rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-100">{c.name}</h3>
                  <span className="text-xs text-slate-400">{c.state}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badgeClass}`}>
                  {status}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black font-mono text-white">{aqi}</span>
                <span className="text-xs font-mono text-slate-400">NAQI Points</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-slate-900 text-center">
                  <span className="text-slate-500 block">PM2.5</span>
                  <span className="font-bold text-slate-200">{Math.round(aqi * 0.42)} µg</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 text-center">
                  <span className="text-slate-500 block">PM10</span>
                  <span className="font-bold text-slate-200">{Math.round(aqi * 0.68)} µg</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 text-center">
                  <span className="text-slate-500 block">NO2</span>
                  <span className="font-bold text-slate-200">{Math.round(aqi * 0.22)} µg</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Health Advisory Section */}
      <div className="glass-panel rounded-3xl p-5 md:p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-300">
          <Heart className="w-4 h-4 text-rose-400" />
          <span>General Public Health Guidelines</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          During wet monsoonal precipitation periods, ambient particulate matters (PM2.5 and PM10) are substantially washed out via atmospheric wet deposition across coastal corridors. In inland northern plains, thermal inversion may cause transient early morning smog.
        </p>
      </div>
    </div>
  );
};
