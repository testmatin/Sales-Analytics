import { Bell, CalendarDays, CheckCheck, ChevronDown, LogOut, Menu, Moon, Search, Settings, Sun, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUI, type DateRange } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';

const titles: Record<string,string> = {
  '/': 'داشبورد مدیریتی',
  '/analytics/sales': 'تحلیل فروش',
  '/products': 'تحلیل محصولات',
  '/customers': 'تحلیل مشتریان',
  '/orders': 'مدیریت سفارش‌ها',
  '/geography': 'تحلیل جغرافیایی',
  '/reports': 'گزارش‌ها',
  '/insights': 'بینش‌های مدیریتی',
  '/profile': 'پروفایل کاربری',
  '/settings': 'تنظیمات',
  '/notifications': 'مرکز اعلان‌ها',
};

const dateLabels: Record<DateRange, string> = { '7d': '۷ روز اخیر', '30d': '۳۰ روز اخیر', '90d': '۹۰ روز اخیر' };

export function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const ui = useUI();
  const auth = useAuth();
  const [dateOpen, setDateOpen] = useState(false);

  const closePopovers = () => {
    ui.setNotificationsOpen(false);
    ui.setProfileOpen(false);
    setDateOpen(false);
  };

  return <header className="navbar">
    {(dateOpen || ui.notificationsOpen || ui.profileOpen) && <button type="button" className="popover-scrim" aria-label="بستن منو" onClick={closePopovers}/>}
    <div className="navbar-title-wrap">
      <button type="button" className="hamburger-button" onClick={() => { closePopovers(); ui.toggleSidebar(); }} aria-label="باز و بسته کردن منو"><Menu size={21}/></button>
      <span className="navbar-title-divider" aria-hidden="true"/>
      <div className="navbar-title-copy"><small>سامانه تحلیل داده‌های فروش</small><h1>{titles[pathname] ?? 'داشبورد'}</h1></div>
    </div>

    <div className="nav-actions">
      <button type="button" className="search nav-search" onClick={() => { closePopovers(); ui.setSearchOpen(true); }} aria-label="جستجوی سراسری">
        <Search size={17}/><span>جستجو در داده‌ها...</span><kbd>Ctrl K</kbd>
      </button>

      <div className="popover-anchor">
        <button type="button" className="date-chip" onClick={() => { ui.setNotificationsOpen(false); ui.setProfileOpen(false); setDateOpen(v => !v); }}><CalendarDays size={16}/><span>{dateLabels[ui.dateRange]}</span><ChevronDown size={14}/></button>
        {dateOpen && <div className="dropdown-panel date-dropdown">
          {(['7d','30d','90d'] as DateRange[]).map(value => <button key={value} type="button" className={ui.dateRange === value ? 'active' : ''} onClick={() => { ui.setDateRange(value); setDateOpen(false); }}><span>{dateLabels[value]}</span>{ui.dateRange === value && <b>✓</b>}</button>)}
        </div>}
      </div>

      <button type="button" className="icon-button theme-button" title={ui.theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'} onClick={() => ui.setTheme(ui.theme === 'dark' ? 'light' : 'dark')} aria-label="تغییر تم">{ui.theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}</button>

      <div className="popover-anchor">
        <button type="button" className="icon-button" aria-label="اعلان‌ها" onClick={() => { ui.setProfileOpen(false); setDateOpen(false); ui.setNotificationsOpen(!ui.notificationsOpen); }}>
          <Bell size={18}/>{ui.unreadCount > 0 && <span className="notification-count">{ui.unreadCount}</span>}
        </button>
        {ui.notificationsOpen && <div className="dropdown-panel notification-panel">
          <div className="dropdown-head"><div><b>اعلان‌ها</b><small>{ui.unreadCount} اعلان خوانده‌نشده</small></div><button type="button" onClick={ui.markAllNotificationsRead}><CheckCheck size={16}/> خواندن همه</button></div>
          <div className="notification-list">
            {ui.notifications.map(n => <button key={n.id} type="button" className={`notification-item ${n.read ? '' : 'unread'}`} onClick={() => { ui.markNotificationRead(n.id); ui.setNotificationsOpen(false); navigate(n.route); }}>
              <i className={`notification-dot ${n.type}`}/><span><b>{n.title}</b><small>{n.message}</small><em>{n.time}</em></span>
            </button>)}
          </div>
          <button type="button" className="dropdown-footer-button" onClick={() => { ui.setNotificationsOpen(false); navigate('/notifications'); }}>مشاهده همه اعلان‌ها</button>
        </div>}
      </div>

      <div className="popover-anchor">
        <button type="button" className="profile" onClick={() => { ui.setNotificationsOpen(false); setDateOpen(false); ui.setProfileOpen(!ui.profileOpen); }}>
          <span>{ui.profile.initials}</span><div className="profile-user-copy"><b>{ui.profile.name}</b></div><ChevronDown size={14}/>
        </button>
        {ui.profileOpen && <div className="dropdown-panel profile-dropdown">
          <div className="profile-summary"><span>{ui.profile.initials}</span><div><b>{ui.profile.name}</b><small>{ui.profile.email}</small></div></div>
          <button type="button" onClick={() => { ui.setProfileOpen(false); navigate('/profile'); }}><UserRound size={17}/> پروفایل من</button>
          <button type="button" onClick={() => { ui.setProfileOpen(false); navigate('/settings'); }}><Settings size={17}/> تنظیمات</button>
          <div className="dropdown-separator"/>
          <button type="button" className="danger-menu-item" onClick={async () => { ui.setProfileOpen(false); await auth.logout(); navigate('/login', { replace: true }); }}><LogOut size={17}/> خروج از حساب</button>
        </div>}
      </div>
    </div>
  </header>;
}
