import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../services/api';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../services/tokenStore';

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  phone: string;
  initials: string;
  role: 'admin' | 'manager' | 'analyst' | 'viewer';
  roleLabel: string;
  isActive: boolean;
};

type TokenPayload = { accessToken: string; refreshToken: string; tokenType: string; user: AuthUser };

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = async () => {
    const { data } = await api.get<AuthUser>('/auth/me');
    setUser(data);
  };

  useEffect(() => {
    const handleForcedLogout = () => setUser(null);
    window.addEventListener('auth:logout', handleForcedLogout);

    const boot = async () => {
      if (!getAccessToken() && !getRefreshToken()) {
        setLoading(false);
        return;
      }
      try {
        await refreshMe();
      } catch {
        clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    boot();
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login: async (email, password) => {
      clearTokens();
      const { data } = await api.post<TokenPayload>('/auth/login', { email, password });
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    },
    register: async payload => {
      clearTokens();
      const { data } = await api.post<TokenPayload>('/auth/register', payload);
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    },
    logout: async () => {
      const refreshToken = getRefreshToken();
      try {
        if (refreshToken) await api.post('/auth/logout', { refreshToken });
      } finally {
        clearTokens();
        setUser(null);
      }
    },
    refreshMe,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
