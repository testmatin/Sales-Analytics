import { BarChart3, Box, BrainCircuit, FileBarChart, LayoutDashboard, MapPin, Search, Settings, ShoppingCart, UserRound, Users, X, type LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../../context/UIContext';
import { searchBackend, type SearchApiResult } from '../../services/dataService';

const pages = [
  { label: 'داشبورد مدیریتی', route: '/', icon: LayoutDashboard, keywords: 'داشبورد overview خانه' },
  { label: 'تحلیل فروش', route: '/analytics/sales', icon: BarChart3, keywords: 'فروش درآمد سود روند analytics' },
  { label: 'محصولات', route: '/products', icon: Box, keywords: 'محصول کالا موجودی' },
  { label: 'مشتریان', route: '/customers', icon: Users, keywords: 'مشتری segmentation بخش بندی' },
  { label: 'سفارش‌ها', route: '/orders', icon: ShoppingCart, keywords: 'سفارش order خرید' },
  { label: 'جغرافیا', route: '/geography', icon: MapPin, keywords: 'استان شهر منطقه location geography' },
  { label: 'گزارش‌ها', route: '/reports', icon: FileBarChart, keywords: 'report گزارش pdf csv' },
  { label: 'بینش‌های مدیریتی', route: '/insights', icon: BrainCircuit, keywords: 'هوش مصنوعی insight پیشنهاد هشدار' },
  { label: 'پروفایل', route: '/profile', icon: UserRound, keywords: 'کاربر حساب پروفایل' },
  { label: 'تنظیمات', route: '/settings', icon: Settings, keywords: 'تم فونت تنظیمات ظاهر' },
] as const;

type SearchResult = { id: string; title: string; subtitle: string; route: string; type?: SearchApiResult['type']; icon?: LucideIcon };

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

const resultIcon = {
  product: Box,
  order: ShoppingCart,
  insight: BrainCircuit,
} as const;

export function GlobalSearch() {
  const { searchOpen, setSearchOpen } = useUI();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [serverResults, setServerResults] = useState<SearchApiResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setServerResults([]);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [searchOpen]);

  useEffect(() => {
    const q = normalize(query);
    if (!q) {
      setServerResults([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    const timer = window.setTimeout(() => {
      searchBackend(q)
        .then(items => { if (active) setServerResults(items); })
        .catch(() => { if (active) setServerResults([]); })
        .finally(() => { if (active) setLoading(false); });
    }, 180);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  const results = useMemo<SearchResult[]>(() => {
    const q = normalize(query);
    if (!q) return pages.slice(0, 6).map(p => ({ id: `page-${p.route}`, title: p.label, subtitle: 'صفحه', route: p.route, icon: p.icon }));

    const pageResults = pages
      .filter(p => normalize(`${p.label} ${p.keywords}`).includes(q))
      .map(p => ({ id: `page-${p.route}`, title: p.label, subtitle: 'صفحه', route: p.route, icon: p.icon }));

    const dataResults = serverResults.map(item => ({ ...item, icon: resultIcon[item.type] }));
    return [...pageResults, ...dataResults].slice(0, 12);
  }, [query, serverResults]);

  if (!searchOpen) return null;

  const go = (route: string) => {
    navigate(route);
    setSearchOpen(false);
  };

  return <div className="modal-backdrop search-backdrop" role="presentation" onMouseDown={() => setSearchOpen(false)}>
    <section className="global-search-dialog" role="dialog" aria-modal="true" aria-label="جستجوی سراسری" onMouseDown={e => e.stopPropagation()}>
      <div className="global-search-input">
        <Search size={20}/>
        <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="محصول، سفارش، گزارش یا صفحه را جستجو کن..." onKeyDown={e => {
          if (e.key === 'Enter' && results[0]) go(results[0].route);
        }}/>
        <kbd>Ctrl K</kbd>
        <button type="button" className="plain-icon" onClick={() => setSearchOpen(false)} aria-label="بستن جستجو"><X size={19}/></button>
      </div>
      <div className="search-results">
        {loading && query && <div className="search-loading">در حال جستجو در Backend…</div>}
        {results.length ? results.map((item, index) => {
          const Icon = item.icon ?? Search;
          return <button key={`${item.id}-${index}`} type="button" className="search-result" onClick={() => go(item.route)}>
            <span className="search-result-icon"><Icon size={18}/></span>
            <span><b>{item.title}</b><small>{item.subtitle}</small></span>
            <span className="search-arrow">↵</span>
          </button>;
        }) : !loading && <div className="empty-search"><Search size={28}/><b>نتیجه‌ای پیدا نشد</b><span>عبارت دیگری امتحان کن.</span></div>}
      </div>
      <footer className="search-footer"><span>Enter برای باز کردن</span><span>Esc برای بستن</span></footer>
    </section>
  </div>;
}
