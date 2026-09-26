import React from 'react';
import { WeatherCity } from '../data/mausamWeatherData';
import { Calendar, CloudRain, Wind, Droplets, Sun, Sunrise, Sunset, Compass, Sparkles } from 'lucide-react';

interface ForecastViewProps {
  currentCity: WeatherCity;
}

export const ForecastView: React.FC<ForecastViewProps> = ({ currentCity }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>7-Day Synoptic Outlook</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Extended Weather Forecast • {currentCity.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Deterministic numerical weather prediction (NWP) model outputs calibrated with regional IMD observational networks.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-slate-500 block">Sunrise</span>
                <span className="font-mono font-bold text-slate-200">05:42 IST</span>
              </div>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="flex items-center gap-1.5">
              <Sunset className="w-4 h-4 text-orange-400" />
              <div>
                <span className="text-slate-500 block">Sunset</span>
                <span className="font-mono font-bold text-slate-200">17:51 IST</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {currentCity.forecast.map((day, idx) => (
          <div
            key={day.day}
            className={`rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
              idx === 0
                ? 'bg-slate-800/80 border-sky-500/40 shadow-lg ring-1 ring-sky-500/20'
                : 'glass-panel hover:bg-slate-850'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-100">{day.day}</span>
                <span className="text-xs font-mono text-slate-400">{day.date}</span>
              </div>

              <div className="text-2xl my-3 text-center">
                {day.rainProb > 60 ? '🌧️' : day.rainProb > 30 ? '🌦️' : '⛅'}
              </div>

              <div className="text-xs font-semibold text-slate-300 text-center line-clamp-2 min-h-[32px]">
                {day.condition}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Temp Range</span>
                <span className="font-mono font-bold text-slate-200">
                  {day.high}° / <span className="text-sky-400">{day.low}°</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <CloudRain className="w-3 h-3 text-sky-400" />
                  Rain
                </span>
                <span className="font-mono font-bold text-sky-400">{day.rainProb}%</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-teal-400" />
                  Gusts
                </span>
                <span className="font-mono text-slate-300">{day.wind} km/h</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Meteorological Confidence & Model Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass-panel rounded-3xl p-5 md:p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-300">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Precipitation Ensemble Trends</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Monsoon trough axis currently situated south of its normal position, passing directly through the Odisha and Gangetic Bengal coast. High probability of intermittent localized squalls through the next 48 to 72 hours.
          </p>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
            <span>Model Ensemble Confidence:</span>
            <span className="text-emerald-400 font-bold">88% (High Verification)</span>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-5 md:p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-300">
            <Compass className="w-4 h-4 text-teal-400" />
            <span>Wind Flow & Upper Air Circulation</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Cyclonic circulation extends up to 7.6 km above mean sea level tilting southwestwards with height. Coastal gale force winds up to 35-45 km/h gusting to 55 km/h likely along north Odisha and adjoining West Bengal coasts.
          </p>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
            <span>Sea Surface Temperature (SST):</span>
            <span className="text-amber-400 font-bold">29.8°C (Favorable for Convection)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
