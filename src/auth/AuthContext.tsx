/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, UserRole, PermissionAction, hasPermission } from './authTypes';

const MAUSAM_AUTH_USER_KEY = 'mausam_auth_user_v1';
const MAUSAM_AUTH_TOKEN_KEY = 'mausam_auth_token_v1';

interface AuthContextValue {
  user: AuthUser | null;
  role: UserRole | null;
  loading: boolean;
  initError: string | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRoleDemo: (role: UserRole) => Promise<void>;
  retrySession: () => Promise<void>;
  can: (action: PermissionAction) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous cache hydration prevents post-login blank screen & layout thrashing
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const cached = localStorage.getItem(MAUSAM_AUTH_USER_KEY);
      return cached ? (JSON.parse(cached) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState<boolean>(() => {
    // If we already have a cached session, we don't block initial rendering
    try {
      return !localStorage.getItem(MAUSAM_AUTH_USER_KEY);
    } catch {
      return true;
    }
  });

  const [initError, setInitError] = useState<string | null>(null);

  // Check authenticated session with server on initial boot
  const checkSession = useCallback(async () => {
    try {
      const token = localStorage.getItem(MAUSAM_AUTH_TOKEN_KEY);
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['x-session-token'] = token;
      }

      // Bound network verification with 3.5s timeout to prevent infinite hang
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('/api/auth/me', {
        headers,
        credentials: 'include',
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          localStorage.setItem(MAUSAM_AUTH_USER_KEY, JSON.stringify(data.user));
          setInitError(null);
        } else {
          // If server explicitly reports session invalid and no token was sent
          if (!token) {
            setUser(null);
            localStorage.removeItem(MAUSAM_AUTH_USER_KEY);
          }
        }
      } else {
        // If server responded with error status, keep cached user if present
        const hasCached = !!localStorage.getItem(MAUSAM_AUTH_USER_KEY);
        if (!hasCached) {
          setUser(null);
        }
      }
    } catch (err: unknown) {
      const hasCached = !!localStorage.getItem(MAUSAM_AUTH_USER_KEY);
      if (!hasCached) {
        setInitError('Atmospheric authentication gateway verification delayed. You can retry or proceed.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        if (data.token) {
          localStorage.setItem(MAUSAM_AUTH_TOKEN_KEY, data.token);
        }
        localStorage.setItem(MAUSAM_AUTH_USER_KEY, JSON.stringify(data.user));
        setInitError(null);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error during login';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem(MAUSAM_AUTH_TOKEN_KEY);
      const headers: Record<string, string> = { 'Accept': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['x-session-token'] = token;
      }

      await fetch('/api/auth/logout', {
        method: 'POST',
        headers,
        credentials: 'include',
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem(MAUSAM_AUTH_USER_KEY);
      localStorage.removeItem(MAUSAM_AUTH_TOKEN_KEY);
      setUser(null);
      setInitError(null);
    }
  };

  const switchRoleDemo = async (newRole: UserRole) => {
    try {
      const token = localStorage.getItem(MAUSAM_AUTH_TOKEN_KEY);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['x-session-token'] = token;
      }

      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem(MAUSAM_AUTH_USER_KEY, JSON.stringify(data.user));
        }
      }
    } catch {
      // Fallback local role update if network is unavailable
      if (user) {
        const updated = { ...user, role: newRole };
        setUser(updated);
        localStorage.setItem(MAUSAM_AUTH_USER_KEY, JSON.stringify(updated));
      }
    }
  };

  const retrySession = async () => {
    setLoading(true);
    await checkSession();
  };

  const can = (action: PermissionAction): boolean => {
    if (!user) return false;
    return hasPermission(user.role, action);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        loading,
        initError,
        login,
        logout,
        switchRoleDemo,
        retrySession,
        can,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
