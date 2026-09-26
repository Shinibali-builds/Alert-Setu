/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense } from 'react';
import {
  CloudSun,
  Calendar,
  AlertTriangle,
  Radio,
  Wind,
  Sprout,
  FileText,
  Siren,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Activity,
  Shield,
  Search,
} from 'lucide-react';

import { MAUSAM_CITIES, WeatherCity } from './data/mausamWeatherData';
import { WeatherView } from './pages/WeatherView';
import { ForecastView } from './pages/ForecastView';
import { WarningsView } from './pages/WarningsView';
import { RadarView } from './pages/RadarView';
import { CycloneTrackerView } from './pages/CycloneTrackerView';
import { AqiView } from './pages/AqiView';
import { AgrometView } from './pages/AgrometView';
import { ReportsView } from './pages/ReportsView';

// Lazy load AlertSetu for performance isolation
const AlertSetuPage = React.lazy(() =>
  import('./pages/AlertSetu').then((m) => ({
    default: m.AlertSetuPage,
  }))
);

export type NavTabId =
  | 'weather'
  | 'forecast'
  | 'warnings'
  | 'radar'
  | 'cyclone-tracker'
  | 'aqi'
  | 'agromet'
  | 'reports'
  | 'last-mile';

interface NavItem {
  id: NavTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  isEmergency?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'weather', label: 'Weather', icon: CloudSun, route: '/weather' },
  { id: 'forecast', label: 'Forecast', icon: Calendar, route: '/forecast' },
  { id: 'warnings', label: 'Warnings', icon: AlertTriangle, route: '/warnings' },
  { id: 'radar', label: 'Radar', icon: Radio, route: '/radar' },
  { id: 'cyclone-tracker', label: 'Cyclone Tracker', icon: Wind, route: '/cyclone-tracker' },
  { id: 'aqi', label: 'AQI', icon: Activity, route: '/aqi' },
  { id: 'agromet', label: 'Agromet', icon: Sprout, route: '/agromet' },
  { id: 'reports', label: 'Reports', icon: FileText, route: '/reports' },
  {
    id: 'last-mile',
    label: 'LAST-MILE',
    icon: Siren,
    route: '/last-mile',
    isEmergency: true,
  },
];

function resolvePathToTab(path: string): NavTabId {
  const clean = path.toLowerCase().replace(/\/+$/, '') || '/';
  if (clean === '/last-mile' || clean === '/alertsetu' || clean === '/emergency') {
    return 'last-mile';
  }
  if (clean === '/forecast') return 'forecast';
  if (clean === '/warnings') return 'warnings';
  if (clean === '/radar') return 'radar';
  if (clean === '/cyclone-tracker' || clean === '/cyclone') return 'cyclone-tracker';
  if (clean === '/aqi') return 'aqi';
  if (clean === '/agromet') return 'agromet';
  if (clean === '/reports') return 'reports';
  return 'weather';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>(() => {
    return resolvePathToTab(window.location.pathname);
  });

  const [currentCity, setCurrentCity] = useState<WeatherCity>(MAUSAM_CITIES[0]); // Bhubaneswar default
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  // Sync browser URL and handle popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(resolvePathToTab(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToTab = (tabId: NavTabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);

    const targetItem = NAV_ITEMS.find((n) => n.id === tabId);
    const targetRoute = targetItem ? targetItem.route : '/weather';

    if (window.location.pathname !== targetRoute) {
      window.history.pushState(null, '', targetRoute);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-rose-500/30 selection:text-rose-200">
      {/* Top Alert Ticker */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 border-b border-rose-500/30 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex items-center gap-1 text-rose-400 font-bold uppercase tracking-wider shrink-0 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
              PRIORITY NOWCAST:
            </span>
            <span className="truncate text-slate-300 font-medium">
              Extremely heavy rain & coastal inundation alert for Coastal Odisha & Gangetic West Bengal.
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigateToTab('last-mile')}
            className="shrink-0 text-[11px] font-bold text-rose-300 hover:text-white flex items-center gap-1 underline underline-offset-2"
          >
            <span>Launch AlertSetu</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      {/* Main Atmospheric Navigation Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigateToTab('weather')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 p-0.5 shadow-lg shadow-rose-950/40">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <CloudSun className="w-5 h-5 text-rose-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    MAUSAM
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                    IN
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest hidden sm:block">
                  Atmospheric Intelligence & AlertSetu
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1.5" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateToTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 focus:outline-none ${
                    item.isEmergency
                      ? isActive
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-950/50 ring-2 ring-rose-400/40'
                        : 'border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                      : isActive
                      ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      item.isEmergency ? 'text-rose-400 group-hover:text-white' : ''
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Header Controls: City Selector & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* City Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCityDropdownOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-850 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                aria-expanded={cityDropdownOpen}
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate max-w-[90px] sm:max-w-[130px]">{currentCity.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-slate-400 border-b border-slate-800">
                    Select Meteorological Station:
                  </div>
                  <div className="space-y-1 mt-1">
                    {MAUSAM_CITIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCurrentCity(c);
                          setCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          currentCity.id === c.id
                            ? 'bg-rose-500/20 text-rose-300 font-bold'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <div>{c.name}</div>
                          <div className="text-[10px] text-slate-500">{c.state}</div>
                        </div>
                        <span className="font-mono text-xs">{c.temp}°C</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="xl:hidden p-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden glass-panel border-b border-slate-800 px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateToTab(item.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold transition-all text-left ${
                      item.isEmergency
                        ? isActive
                          ? 'bg-rose-500 text-white col-span-2 shadow-lg shadow-rose-950/50'
                          : 'border border-rose-500/40 bg-rose-500/10 text-rose-300 col-span-2'
                        : isActive
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        {activeTab === 'weather' && (
          <WeatherView
            currentCity={currentCity}
            onNavigateToAlertSetu={() => navigateToTab('last-mile')}
          />
        )}

        {activeTab === 'forecast' && <ForecastView currentCity={currentCity} />}

        {activeTab === 'warnings' && (
          <WarningsView onNavigateToAlertSetu={() => navigateToTab('last-mile')} />
        )}

        {activeTab === 'radar' && <RadarView />}

        {activeTab === 'cyclone-tracker' && (
          <CycloneTrackerView onNavigateToAlertSetu={() => navigateToTab('last-mile')} />
        )}

        {activeTab === 'aqi' && <AqiView />}

        {activeTab === 'agromet' && <AgrometView />}

        {activeTab === 'reports' && <ReportsView />}

        {activeTab === 'last-mile' && (
          <Suspense
            fallback={
              <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className="w-10 h-10 border-3 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                <div className="text-sm font-bold text-slate-300">
                  Initializing AlertSetu Emergency Pipeline...
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Loading multi-lingual dictionaries & OpenStreetMap GIS layer
                </div>
              </div>
            }
          >
            <AlertSetuPage />
          </Suspense>
        )}
      </main>

      {/* Atmospheric Footer */}
      <footer className="border-t border-slate-850 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-200">MAUSAM</span>
            <span>•</span>
            <span>Team Algnite Weather Intelligence</span>
            <span>•</span>
            <span className="text-rose-400 font-semibold">AlertSetu Emergency Module</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <span>IMD Meteorological Standards</span>
            <span>•</span>
            <span>OpenStreetMap GIS</span>
            <span>•</span>
            <span>CAP Protocol v1.2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
