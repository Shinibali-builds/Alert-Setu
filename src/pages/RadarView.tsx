import React, { useState } from 'react';
import { RADAR_STATIONS, RadarStation } from '../data/mausamWeatherData';
import { Radio, Play, Pause, RotateCw, Layers, Compass, Zap, Shield, Eye } from 'lucide-react';

export const RadarView: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<RadarStation>(RADAR_STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [radarLayer, setRadarLayer] = useState<'reflectivity' | 'velocity' | 'accumulated'>('reflectivity');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
              <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Doppler Weather Radar (DWR) Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Radar Echo Scans & Live Cloud Reflectivity
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Real-time volumetric radar scanning tracking convective thunderstorm cells, rain bands, and cyclonic vortex cores.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Sweep' : 'Resume Sweep'}</span>
            </button>
            <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE FEED (0.5° Elevation)</span>
            </div>
          </div>
        </div>

        {/* Station Selector */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-800">
          {RADAR_STATIONS.map((station) => (
            <button
              key={station.id}
              type="button"
              onClick={() => setSelectedStation(station)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedStation.id === station.id
                  ? 'bg-rose-500/20 border border-rose-500/60 text-rose-300 shadow-md ring-1 ring-rose-500/30'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {station.name} ({station.state})
            </button>
          ))}
        </div>
      </div>

      {/* Main Radar Screen Display */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-panel rounded-3xl p-5 md:p-6 flex flex-col justify-between relative overflow-hidden bg-slate-950">
          <div className="flex items-center justify-between mb-4 z-10">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase">
                Active Radar Station
              </span>
              <h3 className="text-lg font-bold text-slate-100">{selectedStation.name}</h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span>Freq: {selectedStation.frequency}</span>
              <span>Range: {selectedStation.rangeKm} km</span>
            </div>
          </div>

          {/* Interactive Radar Visual Canvas Container */}
          <div className="relative w-full aspect-square max-h-[500px] mx-auto rounded-full border border-teal-500/30 bg-radial from-slate-900 via-slate-950 to-[#020617] overflow-hidden flex items-center justify-center shadow-2xl">
            {/* Concentric Range Rings */}
            <div className="absolute inset-8 rounded-full border border-teal-500/15 pointer-events-none" />
            <div className="absolute inset-20 rounded-full border border-teal-500/20 pointer-events-none" />
            <div className="absolute inset-32 rounded-full border border-teal-500/25 pointer-events-none" />
            <div className="absolute inset-44 rounded-full border border-teal-500/30 pointer-events-none" />

            {/* Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-teal-500/20 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-teal-500/20 pointer-events-none" />

            {/* Simulated Weather Echo Clouds */}
            <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-rose-500/40 via-amber-500/40 to-emerald-500/30 blur-2xl top-1/4 left-1/3 animate-pulse pointer-events-none" />
            <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-red-600/50 via-orange-500/40 to-transparent blur-xl top-1/3 right-1/4 pointer-events-none" />
            <div className="absolute w-60 h-28 rounded-full bg-gradient-to-r from-emerald-500/25 via-teal-500/30 to-blue-500/20 blur-xl bottom-1/4 left-1/5 pointer-events-none" />

            {/* Rotating Radar Sweep Beam */}
            {isPlaying && (
              <div
                className="absolute inset-0 origin-center pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 0deg, rgba(20, 184, 166, 0.4) 0deg, rgba(20, 184, 166, 0.15) 30deg, transparent 60deg)',
                  animation: 'spin 4s linear infinite',
                }}
              />
            )}

            {/* Center Station Marker */}
            <div className="relative z-10 w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-lg shadow-rose-500/50 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            {/* Range Labels */}
            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-teal-400/80">
              0° N (250 km)
            </span>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-teal-400/80">
              180° S
            </span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-teal-400/80">
              90° E
            </span>
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-teal-400/80">
              270° W
            </span>
          </div>

          {/* dBZ Reflectivity Scale Bar */}
          <div className="mt-5 z-10 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Reflectivity Index (dBZ)</span>
              <span>Convective Rain Intensity</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex w-full border border-slate-800">
              <div className="flex-1 bg-blue-900" title="0-10 dBZ: Very Light Drizzle" />
              <div className="flex-1 bg-blue-600" title="10-20 dBZ: Light Rain" />
              <div className="flex-1 bg-cyan-500" title="20-30 dBZ: Moderate Rain" />
              <div className="flex-1 bg-green-500" title="30-40 dBZ: Steady Showers" />
              <div className="flex-1 bg-yellow-400" title="40-48 dBZ: Heavy Rain" />
              <div className="flex-1 bg-orange-500" title="48-55 dBZ: Very Heavy Rain / Hail" />
              <div className="flex-1 bg-red-600" title="55-65 dBZ: Extreme Convective Core" />
              <div className="flex-1 bg-purple-600" title=">65 dBZ: Severe Hail / Cyclone Eye" />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
              <span>0 dBZ</span>
              <span>20</span>
              <span>35</span>
              <span>48</span>
              <span>55</span>
              <span>65+ dBZ</span>
            </div>
          </div>
        </div>

        {/* Radar Station Analysis Side Column */}
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Convective Echo Analysis</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400">Peak Echo Reflectivity:</div>
              <div className="text-3xl font-black font-mono text-rose-400">
                {selectedStation.currentEchoDbz} dBZ
              </div>
              <div className="text-xs font-semibold text-slate-200">
                {selectedStation.precipitationEcho}
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Reflectivity values exceeding 50 dBZ indicate deep convective towers with severe updrafts capable of producing localized cloudbursts and lightning.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-5 space-y-3 text-xs">
            <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Doppler Operational Parameters
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Pulse Width:</span>
              <span className="font-mono text-slate-300">1.0 µs / 2.0 µs</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Rotation Speed:</span>
              <span className="font-mono text-slate-300">3.0 RPM (360° Scan)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Beam Width:</span>
              <span className="font-mono text-slate-300">1.0° (Symmetrical)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Nyquist Velocity:</span>
              <span className="font-mono text-slate-300">± 32 m/s</span>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
              Calibrated every 6 minutes using National Weather Radar Central Server.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
