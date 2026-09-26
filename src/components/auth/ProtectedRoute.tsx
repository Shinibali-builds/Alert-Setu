/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { LoginPage } from '../../pages/LoginPage';
import { PermissionAction, UserRole, getRoleDisplayName } from '../../auth/authTypes';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: PermissionAction;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  allowedRoles,
  fallback,
}: ProtectedRouteProps) {
  const { user, loading, can } = useAuth();

  React.useEffect(() => {
    if (!loading && !user && window.location.pathname !== '/login') {
      window.history.replaceState(null, '', '/login');
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
        <div className="text-sm font-bold text-slate-300">Verifying MAUSAM Portal Authorization...</div>
        <div className="text-xs text-slate-500 font-mono">Authenticating secure HTTP session</div>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginPage
        onSuccess={() => {
          window.history.replaceState(null, '', '/weather');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }}
      />
    );
  }

  // Check required permission if specified
  if (requiredPermission && !can(requiredPermission)) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="max-w-2xl mx-auto my-12 p-6 rounded-3xl bg-[#0b1220] border border-amber-500/40 shadow-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-100">Elevated Authorization Required</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Your current active role (<span className="text-amber-300 font-bold">{getRoleDisplayName(user.role)}</span>) does not have sufficient clearance for this operation (<code className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">{requiredPermission}</code>).
        </p>
        <p className="text-xs text-slate-400">
          To test mass emergency broadcast dispatch, please switch to a <strong className="text-white">District Authority</strong> or <strong className="text-white">State Authority</strong> profile via the role selector in the header.
        </p>
      </div>
    );
  }

  // Check allowed roles if specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="max-w-2xl mx-auto my-12 p-6 rounded-3xl bg-[#0b1220] border border-amber-500/40 shadow-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-100">Role Restriction</h3>
        <p className="text-xs sm:text-sm text-slate-300">
          This operation is restricted to: {allowedRoles.map(getRoleDisplayName).join(', ')}.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
