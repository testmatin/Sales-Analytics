import { BarChart3, Bell, Box, BrainCircuit, FileBarChart, LayoutDashboard, MapPin, Settings, ShoppingCart, UserRound, Users, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useUI } from '../context/UIContext';

const items = [
  ['/', 'داشبورد', LayoutDashboard],
  ['/analytics/sales', 'تحلیل فروش', BarChart3],
  ['/products', 'محصولات', Box],
  ['/customers', 'مشتریان', Users],
  ['/orders', 'سفارش‌ها', ShoppingCart],
  ['/geography', 'جغرافیا', MapPin],
  ['/reports', 'گزارش‌ها', FileBarChart],
  ['/insights', 'AI Insights', BrainCircuit],
] as const;

export function Sidebar() {
  const ui = useUI();
  return <>
    <button type="button" aria-label="بستن منوی موبایل" className={`sidebar-overlay ${ui.mobileSidebarOpen ? 'show' : ''}`} onClick={ui.closeMobileSidebar}/>
    <aside className={`sidebar ${ui.sidebarCollapsed ? 'collapsed' : ''} ${ui.mobileSidebarOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-brand-row">
        <NavLink to="/" className="brand" onClick={ui.closeMobileSidebar}><span className="brand-mark">N</span><b className="brand-label">Nexa BI</b></NavLink>
        <button type="button" className="mobile-close" onClick={ui.closeMobileSidebar} aria-label="بستن"><X size={20}/></button>
      </div>
      <nav>
        {items.map(([to,label,Icon]) => <NavLink key={to} to={to} end={to === '/'} title={ui.sidebarCollapsed ? label : undefined} onClick={ui.closeMobileSidebar}><span className="sidebar-icon"><Icon size={20}/></span><span className="sidebar-label">{label}</span></NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        {/* <div className="mock-source"><i/><div><small>Data source</small><b>Local JSON</b></div></div> */}
        <NavLink to="/notifications" title={ui.sidebarCollapsed ? 'اعلان‌ها' : undefined} onClick={ui.closeMobileSidebar}><span className="sidebar-icon"><Bell size={20}/></span><span className="sidebar-label">اعلان‌ها</span>{ui.unreadCount > 0 && !ui.sidebarCollapsed && <em className="sidebar-badge">{ui.unreadCount}</em>}</NavLink>
        <NavLink to="/profile" title={ui.sidebarCollapsed ? 'پروفایل' : undefined} onClick={ui.closeMobileSidebar}><span className="sidebar-icon"><UserRound size={20}/></span><span className="sidebar-label">پروفایل</span></NavLink>
        <NavLink to="/settings" title={ui.sidebarCollapsed ? 'تنظیمات' : undefined} onClick={ui.closeMobileSidebar}><span className="sidebar-icon"><Settings size={20}/></span><span className="sidebar-label">تنظیمات</span></NavLink>
      </div>
    </aside>
  </>;
}
