import React from 'react';
import { ACTIVE_CYCLONE } from '../data/mausamWeatherData';
import { Wind, Compass, AlertOctagon, ShieldAlert, ArrowUpRight, Gauge, Radio, Waves } from 'lucide-react';

interface CycloneTrackerViewProps {
  onNavigateToAlertSetu?: () => void;
}

export const CycloneTrackerView: React.FC<CycloneTrackerViewProps> = ({ onNavigateToAlertSetu }) => {
  const storm = ACTIVE_CYCLONE;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest bg-red-500/20 text-red-300 border border-red-500/50 uppercase flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 animate-spin" />
                ACTIVE TROPICAL CYCLONE ALERT
              </span>
              <span className="text-xs font-mono text-slate-400 bg-slate-950/70 px-2.5 py-1 rounded-md border border-slate-800">
                BASIN: {storm.basin}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white">{storm.name}</h1>
            <p className="text-base text-rose-300 font-bold mt-1">{storm.category}</p>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
              Projected Landfall: <strong className="text-white">{storm.projectedLandfall}</strong>
            </p>
          </div>

          {onNavigateToAlertSetu && (
            <button
              type="button"
              onClick={onNavigateToAlertSetu}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white transition-all shadow-xl shadow-rose-950/50 shrink-0"
            >
              <span>Dispatch Cyclone Alert in AlertSetu</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Vital Storm Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">MAX SUSTAINED WIND</span>
            <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono mt-0.5">
              {storm.maxWindSpeedKm} <span className="text-xs font-sans text-slate-400">km/h</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">({storm.maxWindSpeedKnots} Knots)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">ESTIMATED CENTRAL PRESSURE</span>
            <div className="text-xl sm:text-2xl font-black text-slate-100 font-mono mt-0.5">
              {storm.centralPressureHpa} <span className="text-xs font-sans text-slate-400">hPa</span>
            </div>
            <span className="text-[10px] font-mono text-rose-400">Deep Low Core</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">STORM FORWARD SPEED</span>
            <div className="text-xl sm:text-2xl font-black text-teal-300 font-mono mt-0.5">
              {storm.movementSpeedKm} <span className="text-xs font-sans text-slate-400">km/h</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">{storm.movementDirection}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">COASTAL EVACUATION</span>
            <div className="text-sm font-bold text-amber-300 mt-1 line-clamp-1">
              Active Relief Camps
            </div>
            <span className="text-[10px] text-slate-400">Puri & Khordha Belt</span>
          </div>
        </div>
      </div>

      {/* Storm Track Projection Table & Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-rose-400" />
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
                Historical Track & 24-Hour Forecast Cone
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">RSMC Tropical Cyclones New Delhi</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-slate-400 uppercase border-b border-slate-800 bg-slate-900/60">
                <tr>
                  <th className="py-2.5 px-3">Date / Time (IST)</th>
                  <th className="py-2.5 px-3">Coordinates</th>
                  <th className="py-2.5 px-3">Intensity Stage</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {storm.coordinatesPath.map((pt, i) => (
                  <tr
                    key={i}
                    className={`hover:bg-slate-900/50 ${
                      pt.time.includes('Current') ? 'bg-red-500/10 text-red-200 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 px-3">{pt.time}</td>
                    <td className="py-2.5 px-3">
                      {pt.lat}°N, {pt.lon}°E
                    </td>
                    <td className="py-2.5 px-3">{pt.stage}</td>
                    <td className="py-2.5 px-3 text-right">
                      {pt.time.includes('Current') ? (
                        <span className="px-2 py-0.5 rounded bg-red-500 text-white font-black text-[10px]">
                          EYE CENTER
                        </span>
                      ) : pt.time.includes('Forecast') ? (
                        <span className="text-amber-400 font-bold">PROJECTED</span>
                      ) : (
                        <span className="text-slate-500">RECORDED</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coastal Safety Protocols */}
        <div className="glass-panel rounded-3xl p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-300">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>IMD 4-Stage Cyclone Warning System</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="font-bold text-yellow-400">Stage 1: Pre-Cyclone Watch (72h prior)</div>
              <p className="text-slate-400 text-[11px]">Early advisory issued to Cabinet Secretariat & State Chief Secretaries.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="font-bold text-amber-400">Stage 2: Cyclone Alert (48h prior)</div>
              <p className="text-slate-400 text-[11px]">Yellow alert issued to designated coastal districts.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="font-bold text-orange-400">Stage 3: Cyclone Warning (24h prior)</div>
              <p className="text-slate-400 text-[11px]">Orange alert specifying probable landfall point and estimated surge height.</p>
            </div>
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 space-y-1">
              <div className="font-bold text-red-300">Stage 4: Post-Landfall Outlook (Active)</div>
              <p className="text-slate-300 text-[11px]">Red alert 12 hours prior to landfall detailing interior gale wind paths.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
