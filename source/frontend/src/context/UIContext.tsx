import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getUIData, markAllNotificationsReadApi, markNotificationReadApi, updateProfileApi } from '../services/dataService';
import { useAuth } from './AuthContext';

export type ThemeMode = 'dark' | 'light';
export type DateRange = '7d' | '30d' | '90d';
export type NotificationItem = {
  id: number;
  type: 'success' | 'warning' | 'info' | 'trend';
  title: string;
  message: string;
  time: string;
  read: boolean;
  route: string;
};
export type UserProfile = {
  name: string;
  role: string;
  email: string;
  phone: string;
  initials: string;
};

type UIContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  mobileSidebarOpen: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleSidebar: () => void;
  searchOpen: boolean;
  setSearchOpen: (value: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (value: boolean) => void;
  profileOpen: boolean;
  setProfileOpen: (value: boolean) => void;
  dateRange: DateRange;
  setDateRange: (value: DateRange) => void;
  rootFontSize: number;
  setRootFontSize: (value: number) => void;
  compactMode: boolean;
  setCompactMode: (value: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => Promise<void>;
  notifications: NotificationItem[];
  unreadCount: number;
  markNotificationRead: (id: number) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  resetUISettings: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

const emptyProfile: UserProfile = {
  name: 'در حال بارگذاری…',
  role: '',
  email: '',
  phone: '',
  initials: '--',
};

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

export function UIProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [theme, setTheme] = useState<ThemeMode>(() => readLocal('nexa-theme', 'dark'));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => readLocal('nexa-sidebar-collapsed', false));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>(() => readLocal('nexa-date-range', '30d'));
  const [rootFontSize, setRootFontSize] = useState(() => readLocal('nexa-font-size', 17));
  const [compactMode, setCompactMode] = useState(() => readLocal('nexa-compact', false));
  const [reduceMotion, setReduceMotion] = useState(() => readLocal('nexa-reduce-motion', false));
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setProfile(emptyProfile);
      setNotifications([]);
      return;
    }
    getUIData()
      .then(data => {
        setProfile(data.profile);
        setNotifications(data.notifications);
      })
      .catch(() => {
        setProfile({ ...emptyProfile, name: 'Backend در دسترس نیست', initials: '!' });
      });
  }, [auth.isAuthenticated, auth.user?.id]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty('--font-root-size', `${rootFontSize}px`);
    document.documentElement.dataset.compact = compactMode ? 'true' : 'false';
    document.documentElement.dataset.reduceMotion = reduceMotion ? 'true' : 'false';
    localStorage.setItem('nexa-theme', JSON.stringify(theme));
    localStorage.setItem('nexa-sidebar-collapsed', JSON.stringify(sidebarCollapsed));
    localStorage.setItem('nexa-date-range', JSON.stringify(dateRange));
    localStorage.setItem('nexa-font-size', JSON.stringify(rootFontSize));
    localStorage.setItem('nexa-compact', JSON.stringify(compactMode));
    localStorage.setItem('nexa-reduce-motion', JSON.stringify(reduceMotion));
  }, [theme, sidebarCollapsed, dateRange, rootFontSize, compactMode, reduceMotion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleSidebar = () => {
    if (window.matchMedia('(max-width: 700px)').matches) {
      setMobileSidebarOpen(v => !v);
      return;
    }
    setSidebarCollapsed(v => !v);
  };

  const value = useMemo<UIContextValue>(() => ({
    theme,
    setTheme,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    openMobileSidebar: () => setMobileSidebarOpen(true),
    closeMobileSidebar: () => setMobileSidebarOpen(false),
    toggleSidebar,
    searchOpen,
    setSearchOpen,
    notificationsOpen,
    setNotificationsOpen,
    profileOpen,
    setProfileOpen,
    dateRange,
    setDateRange,
    rootFontSize,
    setRootFontSize,
    compactMode,
    setCompactMode,
    reduceMotion,
    setReduceMotion,
    profile,
    updateProfile: async nextProfile => {
      setProfile(nextProfile);
      try {
        const saved = await updateProfileApi(nextProfile);
        setProfile(saved);
      } catch (error) {
        const latest = await getUIData().catch(() => null);
        if (latest) setProfile(latest.profile);
        throw error;
      }
    },
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markNotificationRead: async id => {
      setNotifications(items => items.map(n => n.id === id ? { ...n, read: true } : n));
      try {
        setNotifications(await markNotificationReadApi(id));
      } catch {
        const latest = await getUIData().catch(() => null);
        if (latest) setNotifications(latest.notifications);
      }
    },
    markAllNotificationsRead: async () => {
      setNotifications(items => items.map(n => ({ ...n, read: true })));
      try {
        setNotifications(await markAllNotificationsReadApi());
      } catch {
        const latest = await getUIData().catch(() => null);
        if (latest) setNotifications(latest.notifications);
      }
    },
    resetUISettings: () => {
      setTheme('dark');
      setSidebarCollapsed(false);
      setDateRange('30d');
      setRootFontSize(17);
      setCompactMode(false);
      setReduceMotion(false);
    },
  }), [theme, sidebarCollapsed, mobileSidebarOpen, searchOpen, notificationsOpen, profileOpen, dateRange, rootFontSize, compactMode, reduceMotion, profile, notifications]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const value = useContext(UIContext);
  if (!value) throw new Error('useUI must be used inside UIProvider');
  return value;
}
