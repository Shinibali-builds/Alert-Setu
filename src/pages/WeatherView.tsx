import React from 'react';
import { WeatherCity } from '../data/mausamWeatherData';
import {
  CloudRain,
  Wind,
  Droplets,
  Gauge,
  Sun,
  Eye,
  Thermometer,
  Waves,
  Sprout,
  Compass,
  Clock,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

interface WeatherViewProps {
  currentCity: WeatherCity;
  onNavigateToAlertSetu?: () => void;
}

export const WeatherView: React.FC<WeatherViewProps> = ({ currentCity, onNavigateToAlertSetu }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Warning Banner if city has adverse weather */}
      {currentCity.precipitationChance > 70 && (
        <div className="glass-panel border-l-4 border-l-rose-500 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-rose-400">
                  METEOROLOGICAL WARNING ACTIVE
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  ORANGE ALERT
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-200 mt-0.5">
                Heavy to Very Heavy Rainfall expected in {currentCity.name} and surrounding districts.
              </p>
            </div>
          </div>

          {onNavigateToAlertSetu && (
            <button
              type="button"
              onClick={onNavigateToAlertSetu}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white transition-all shadow-md shrink-0"
            >
              <span>Open in AlertSetu</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Hero Weather Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
              <span>{currentCity.region}</span>
              <span>•</span>
              <span>{currentCity.state}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {currentCity.name}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mt-1 font-medium">
              {currentCity.condition}
            </p>

            <div className="flex items-baseline gap-4 mt-4">
              <span className="text-6xl sm:text-7xl font-black text-white font-mono tracking-tighter">
                {currentCity.temp}°
              </span>
              <div className="space-y-0.5 text-xs sm:text-sm text-slate-400 font-medium">
                <div>Feels like {currentCity.feelsLike}°C</div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">H: {currentCity.high}°</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-sky-400">L: {currentCity.low}°</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>Humidity</span>
              </div>
              <div className="text-lg font-bold text-slate-100 font-mono mt-1">
                {currentCity.humidity}%
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                <span>Wind</span>
              </div>
              <div className="text-lg font-bold text-slate-100 font-mono mt-1">
                {currentCity.windSpeed} <span className="text-xs font-normal">km/h {currentCity.windDirection}</span>
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <CloudRain className="w-3.5 h-3.5 text-indigo-400" />
                <span>Precipitation</span>
              </div>
              <div className="text-lg font-bold text-indigo-300 font-mono mt-1">
                {currentCity.precipitationChance}%
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                <span>Pressure</span>
              </div>
              <div className="text-lg font-bold text-slate-100 font-mono mt-1">
                {currentCity.pressure} <span className="text-xs font-normal">hPa</span>
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Sun className="w-3.5 h-3.5 text-yellow-400" />
                <span>UV Index</span>
              </div>
              <div className="text-lg font-bold text-slate-100 font-mono mt-1">
                {currentCity.uvIndex} <span className="text-xs font-normal text-emerald-400">(Low)</span>
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>Visibility</span>
              </div>
              <div className="text-lg font-bold text-slate-100 font-mono mt-1">
                {currentCity.visibility} <span className="text-xs font-normal">km</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Strip */}
      <div className="glass-panel rounded-3xl p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              24-Hour Micro-Forecast
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">IST (Indian Standard Time)</span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {currentCity.hourly.map((h, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-between p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 min-w-[76px] shrink-0 text-center hover:bg-slate-850 transition-colors"
            >
              <span className="text-xs font-mono text-slate-400">{h.time}</span>
              <span className="text-2xl my-2">{h.icon}</span>
              <span className="text-sm font-bold font-mono text-slate-100">{h.temp}°</span>
              <span className="text-[10px] font-mono font-semibold text-sky-400 mt-1">
                {h.pop}% rain
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Atmospheric & Agricultural Indices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Soil Moisture */}
        <div className="glass-panel rounded-3xl p-5 md:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-300">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Agromet Soil Moisture</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">{currentCity.soilMoisture}%</span>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentCity.soilMoisture}%` }}
            />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {currentCity.soilMoisture > 75
              ? 'Soil profile is saturated. Root aeration restricted in heavy clay soils. Drainage advised.'
              : 'Soil moisture adequate for active vegetative crop growth.'}
          </p>
        </div>

        {/* Marine & Tide Conditions */}
        <div className="glass-panel rounded-3xl p-5 md:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-300">
              <Waves className="w-4 h-4 text-sky-400" />
              <span>Marine & Coastal Status</span>
            </div>
            <span className="text-xs font-mono text-sky-400 font-bold">Bay of Bengal / Coast</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-200">
            {currentCity.tideCondition || 'Inland Station — River Basin Runoff High'}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Fishermen are advised not to venture into deep sea waters along and off the coastal belt.
          </p>
        </div>

        {/* Air Quality Quick Summary */}
        <div className="glass-panel rounded-3xl p-5 md:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-300">
              <Wind className="w-4 h-4 text-teal-400" />
              <span>National Air Quality (NAQI)</span>
            </div>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                currentCity.airQualityIndex <= 50
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : currentCity.airQualityIndex <= 100
                  ? 'bg-sky-500/20 text-sky-300'
                  : currentCity.airQualityIndex <= 200
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {currentCity.airQualityStatus}
            </span>
          </div>

          <div className="text-3xl font-black font-mono text-slate-100">
            {currentCity.airQualityIndex}{' '}
            <span className="text-xs font-normal font-sans text-slate-400">AQI (PM2.5 primary)</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {currentCity.airQualityIndex <= 50
              ? 'Air quality is satisfactory and poses little or no risk to public health.'
              : 'Sensitive groups may experience minor breathing discomfort during prolonged exertion.'}
          </p>
        </div>
      </div>
    </div>
  );
};
