/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CloudSun,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Radio,
  Users,
  Building2,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../auth/authTypes';

interface LoginPageProps {
  onSuccess?: () => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      window.history.replaceState(null, '', '/weather');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your official email or username');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      handleLoginSuccess();
    } else {
      setError(res.error || 'Invalid credentials. Please verify your official account.');
    }
  };

  const handleQuickLogin = async (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('demopass123');
    setLoading(true);
    setError(null);

    const res = await login(roleEmail, 'demopass123');
    setLoading(false);

    if (res.success) {
      handleLoginSuccess();
    } else {
      setError(res.error || 'Demo role authentication failed.');
    }
  };

  const DEMO_ACCOUNTS: {
    role: UserRole;
    label: string;
    email: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeColor: string;
  }[] = [
    {
      role: 'DISTRICT_AUTHORITY',
      label: 'District Authority',
      email: 'district.khordha@mausam.gov.in',
      desc: 'SEOC Khordha / Mass Broadcast Authorization',
      icon: Building2,
      badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    },
    {
      role: 'STATE_AUTHORITY',
      label: 'State Authority',
      email: 'osdma.state@mausam.gov.in',
      desc: 'State Disaster Management Authority',
      icon: Shield,
      badgeColor: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
    },
    {
      role: 'FIELD_OPERATOR',
      label: 'Field Operator',
      email: 'operator.bhubaneswar@mausam.gov.in',
      desc: 'Ground Volunteer / Edge Relay / Delivery',
      icon: Radio,
      badgeColor: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
    },
    {
      role: 'PUBLIC_USER',
      label: 'Public User',
      email: 'citizen@mausam.gov.in',
      desc: 'Public Weather, Forecast, Warnings, Radar',
      icon: Users,
      badgeColor: 'border-slate-500/40 bg-slate-500/10 text-slate-300',
    },
    {
      role: 'SYSTEM_ADMIN',
      label: 'System Admin',
      email: 'admin@mausam.gov.in',
      desc: 'Full System Administration & User Management',
      icon: Sliders,
      badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-rose-500/30 selection:text-rose-200">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 p-0.5 shadow-2xl shadow-rose-950/60">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <CloudSun className="w-7 h-7 text-rose-400" />
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-white">MAUSAM</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
              PORTAL
            </span>
          </div>
          <p className="mt-1 text-xs font-mono uppercase tracking-widest text-slate-400">
            Atmospheric Intelligence & AlertSetu Module
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-[#0b1220] border border-slate-700/80 shadow-2xl rounded-3xl p-6 sm:p-8">
          <div className="mb-6 pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-rose-400" />
              <span>Official Emergency Portal Sign-In</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Sign in with your authorized agency credentials to access weather intelligence and AlertSetu emergency pipelines.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="official-email"
                className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-1.5"
              >
                Agency / User Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="official-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@mausam.gov.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="official-password"
                className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="official-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-950/50 transition-all focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Switcher */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                ONE-CLICK ROLE DEMO ACCESS
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-3 h-3" />
                TEST READY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleQuickLogin(acc.email)}
                    disabled={loading}
                    className="text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all flex items-start gap-2.5 group"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 group-hover:text-white mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                          {acc.label}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{acc.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security & Provenance Note */}
          <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>HTTP-Only Session Cookie</span>
            <span>CAP Protocol v1.2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
