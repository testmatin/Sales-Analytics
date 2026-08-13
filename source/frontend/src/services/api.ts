import axios from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './tokenStore';

// const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const baseURL = import.meta.env.VITE_API_URL || 'https://sales-analytics-backend-lgeh.onrender.com/api/v1';

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const refreshClient = axios.create({ baseURL, timeout: 10000, headers: { 'Content-Type': 'application/json' } });
let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');
  if (!refreshPromise) {
    refreshPromise = refreshClient.post('/auth/refresh', { refreshToken })
      .then(response => {
        const { accessToken, refreshToken: nextRefreshToken } = response.data;
        setTokens(accessToken, nextRefreshToken);
        return accessToken as string;
      })
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    const status = error?.response?.status;
    const isAuthRoute = typeof original?.url === 'string' && /\/auth\/(login|register|refresh|logout)$/.test(original.url);

    if (status === 401 && original && !original._retry && !isAuthRoute && getRefreshToken()) {
      original._retry = true;
      try {
        const nextAccessToken = await refreshAccessToken();
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${nextAccessToken}`;
        return api(original);
      } catch {
        clearTokens();
        window.dispatchEvent(new Event('auth:logout'));
      }
    }

    const message = error?.response?.data?.error?.message || error?.message || 'خطا در ارتباط با سرور';
    return Promise.reject(new Error(message));
  },
);
