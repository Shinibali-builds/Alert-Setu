/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, useCallback } from 'react';
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
  Crosshair,
  RefreshCw,
  CheckCircle2,
  LogOut,
  User,
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
import { useAuth } from './auth/AuthContext';
import { UserRole, getRoleDisplayName } from './auth/authTypes';
import { LoginPage } from './pages/LoginPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  detectCurrentLocationAndStation,
  NearestStationResult,
} from './services/locationService';

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
    label: 'AlertSetu',
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
  const { user, role, loading: authLoading, initError, retrySession, logout, switchRoleDemo } = useAuth();

  const [activeTab, setActiveTab] = useState<NavTabId>(() => {
    return resolvePathToTab(window.location.pathname);
  });

  const [currentCity, setCurrentCity] = useState<WeatherCity>(MAUSAM_CITIES[0]); // Bhubaneswar default
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  // Geolocation detection state
  const [locationDetecting, setLocationDetecting] = useState<boolean>(false);
  const [detectedLocation, setDetectedLocation] = useState<NearestStationResult | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Sync browser URL and handle popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/login' && user) {
        window.history.replaceState(null, '', '/weather');
        setActiveTab('weather');
      } else {
        setActiveTab(resolvePathToTab(currentPath));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);

  // Requirement 5: Unauthenticated direct access must reliably redirect to /login
  useEffect(() => {
    if (!authLoading && !user) {
      if (window.location.pathname !== '/login') {
        window.history.replaceState(null, '', '/login');
      }
    }
  }, [authLoading, user]);

  // Requirement 1: Successful login must reliably redirect to the existing MAUSAM dashboard
  useEffect(() => {
    if (user && window.location.pathname === '/login') {
      window.history.replaceState(null, '', '/weather');
      setActiveTab('weather');
    }
  }, [user]);

  // Keyboard navigation & accessibility for Station Dropdown (Escape key dismiss)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && cityDropdownOpen) {
        setCityDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cityDropdownOpen]);

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

  // Requirement 4: Logout must reliably return to /login
  const handleLogout = async () => {
    await logout();
    window.history.replaceState(null, '', '/login');
    setMobileMenuOpen(false);
  };

  // 'Use my current location' handler
  const handleUseCurrentLocation = async () => {
    setLocationDetecting(true);
    setLocationError(null);

    try {
      const result = await detectCurrentLocationAndStation(MAUSAM_CITIES);
      setDetectedLocation(result);
      setCurrentCity(result.station);
      setLocationDetecting(false);
    } catch (err: any) {
      setLocationDetecting(false);
      setLocationError(err.message || 'Unable to retrieve your current location.');
    }
  };

  // 1. Initial Authentication Loading State (Requirements 6 & 7)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 border-3 border-rose-500/30 border-t-rose-500 rounded-full animate-spin shadow-lg shadow-rose-950/50" />
        <div className="space-y-1">
          <div className="text-base font-bold text-slate-100">
            MAUSAM &amp; AlertSetu Atmospheric Portal
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Verifying server-side HTTP-only session credentials...
          </div>
        </div>

        {initError && (
          <div className="max-w-md p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-3 mt-2">
            <div>{String(initError)}</div>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={retrySession}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-bold"
              >
                Retry Gateway Verification
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Unauthenticated Gate: Prompt for Login (Requirements 1, 4, 5)
  if (!user) {
    return (
      <LoginPage
        onSuccess={() => {
          window.history.replaceState(null, '', '/weather');
          setActiveTab('weather');
        }}
      />
    );
  }

  return (
    <ErrorBoundary>
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
              Extremely heavy rain &amp; coastal inundation alert for Coastal Odisha &amp; Gangetic West Bengal.
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
      <header className="sticky top-0 z-40 glass-panel border-b border-white/10 backdrop-blur-xl overflow-visible isolate">
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
                  Atmospheric Intelligence • AlertSetu
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

          {/* Header Controls: Role Selector, City Selector & Sign Out */}
          <div className="flex items-center gap-2">
            {/* User Role Selector & Fast Switcher */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-800 bg-[#0b1220] text-xs">
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <select
                aria-label="Active Authority Role"
                value={user.role}
                onChange={(e) => switchRoleDemo(e.target.value as UserRole)}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none text-xs cursor-pointer"
              >
                <option value="PUBLIC_USER" className="bg-[#0b1220] text-slate-200">
                  Public User
                </option>
                <option value="FIELD_OPERATOR" className="bg-[#0b1220] text-slate-200">
                  Field Operator
                </option>
                <option value="DISTRICT_AUTHORITY" className="bg-[#0b1220] text-slate-200">
                  District Authority
                </option>
                <option value="STATE_AUTHORITY" className="bg-[#0b1220] text-slate-200">
                  State Authority
                </option>
                <option value="SYSTEM_ADMIN" className="bg-[#0b1220] text-slate-200">
                  System Admin
                </option>
              </select>
            </div>

            {/* City Selector Dropdown with fully opaque isolated popover & Current Location helper */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCityDropdownOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-700/80 bg-[#0b1220] hover:bg-[#111c33] text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/40 shadow-sm"
                aria-expanded={cityDropdownOpen}
                aria-haspopup="listbox"
                id="station-selector-btn"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate max-w-[85px] sm:max-w-[130px]">{currentCity.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {cityDropdownOpen && (
                <>
                  {/* Backdrop to close dropdown on outside click */}
                  <div
                    className="fixed inset-0 z-[9990]"
                    onClick={() => setCityDropdownOpen(false)}
                    aria-hidden="true"
                  />

                  {/* Fully Opaque Isolated Dropdown Popover */}
                  <div
                    role="listbox"
                    aria-labelledby="station-selector-btn"
                    className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#0b1220] border border-slate-700 shadow-2xl p-2.5 z-[9999] isolate max-w-[calc(100vw-1.5rem)]"
                    style={{ backgroundColor: '#0b1220' }}
                  >
                    {/* Header */}
                    <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase text-slate-400 border-b border-slate-800 flex items-center justify-between mb-2">
                      <span>Select Weather Station:</span>
                      <span className="text-[9px] text-rose-400 font-bold">RADAR NETWORK</span>
                    </div>

                    {/* Prominent Action Button: Use my current location */}
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={locationDetecting}
                      className="w-full mb-2 p-2.5 rounded-xl bg-gradient-to-r from-rose-500/20 via-rose-500/15 to-amber-500/20 hover:from-rose-500/30 hover:to-amber-500/30 border border-rose-500/40 text-xs font-bold text-rose-200 flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-1 focus:ring-rose-400 disabled:opacity-50"
                    >
                      {locationDetecting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-400" />
                          <span>Detecting GPS Location...</span>
                        </>
                      ) : (
                        <>
                          <Crosshair className="w-3.5 h-3.5 text-rose-400" />
                          <span>Use my current location</span>
                        </>
                      )}
                    </button>

                    {/* Error Banner if Geolocation fails */}
                    {locationError && (
                      <div className="mb-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <div className="leading-tight">{String(locationError)}</div>
                      </div>
                    )}

                    {/* Location Detected Confirmation Banner */}
                    {detectedLocation && (
                      <div className="mb-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-emerald-400 font-bold font-mono text-[10px]">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            LOCATION DETECTED
                          </span>
                          <span>{detectedLocation.distanceKm} km away</span>
                        </div>
                        <div className="text-slate-200 font-medium">
                          Nearest MAUSAM station:{' '}
                          <strong className="text-white">{detectedLocation.station.name}</strong>
                        </div>
                        <div className="text-[10px] text-slate-400 leading-tight">
                          Station observation ({detectedLocation.station.name}, approx.{' '}
                          {detectedLocation.distanceKm} km from your detected GPS fix{' '}
                          {detectedLocation.gpsCoordinates.latitude.toFixed(3)}°N,{' '}
                          {detectedLocation.gpsCoordinates.longitude.toFixed(3)}°E at{' '}
                          {detectedLocation.detectedAt})
                        </div>
                      </div>
                    )}

                    {/* Station List with Opaque Surfaces */}
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {MAUSAM_CITIES.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          role="option"
                          aria-selected={currentCity.id === c.id}
                          onClick={() => {
                            setCurrentCity(c);
                            setCityDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            currentCity.id === c.id
                              ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                              : 'text-slate-300 hover:bg-[#141f38]'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-white">{c.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {c.state} • {c.condition}
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-rose-300">
                            {c.temp}°C
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sign Out Action Button */}
            <button
              type="button"
              onClick={handleLogout}
              title={`Sign Out (${user.name})`}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl border border-slate-800 bg-[#0b1220] hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors"
              aria-label="Sign Out of Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>

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
          <div className="xl:hidden glass-panel border-b border-slate-800 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
            {/* Mobile Role Switcher */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Role:</span>
              </div>
              <select
                value={user.role}
                onChange={(e) => switchRoleDemo(e.target.value as UserRole)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 font-semibold text-xs"
              >
                <option value="PUBLIC_USER">Public User</option>
                <option value="FIELD_OPERATOR">Field Operator</option>
                <option value="DISTRICT_AUTHORITY">District Authority</option>
                <option value="STATE_AUTHORITY">State Authority</option>
                <option value="SYSTEM_ADMIN">System Admin</option>
              </select>
            </div>

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
                  Loading multi-lingual dictionaries &amp; OpenStreetMap GIS layer
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
    </ErrorBoundary>
  );
}
