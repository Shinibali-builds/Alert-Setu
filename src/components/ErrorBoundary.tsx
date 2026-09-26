/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MAUSAM ErrorBoundary caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center p-6 selection:bg-rose-500/30 selection:text-rose-200">
          <div className="max-w-lg w-full bg-[#0b1220] border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-lg shadow-rose-950/50">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold">
                RECOVERY BOUNDARY ACTIVATED
              </span>
              <h2 className="text-xl font-bold text-white mt-1">MAUSAM Atmospheric Portal Notice</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                A rendering issue was intercepted. Your session credentials and background feeds remain intact.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-rose-300 text-left overflow-x-auto max-h-28">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.history.replaceState(null, '', '/weather');
                  window.location.reload();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload MAUSAM Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.history.replaceState(null, '', '/login');
                  window.location.reload();
                }}
                className="py-3 px-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
