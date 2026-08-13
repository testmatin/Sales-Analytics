import { Bell, CheckCheck, CircleAlert, Info, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';

const icons = { success: CheckCheck, warning: CircleAlert, info: Info, trend: TrendingUp } as const;
export default function NotificationsPage() {
  const ui = useUI();
  const navigate = useNavigate();
  return <section className="page"><div className="page-head"><div><small>Notifications</small><h2>مرکز اعلان‌ها</h2><p className="page-description">هشدارها، گزارش‌ها و رخدادهای مهم داشبورد.</p></div><button type="button" className="secondary-action" onClick={ui.markAllNotificationsRead}><CheckCheck size={17}/> خواندن همه</button></div>
    <article className="panel notifications-page-list">{ui.notifications.map(n => {const Icon=icons[n.type];return <button key={n.id} type="button" className={`notification-page-row ${n.read?'':'unread'}`} onClick={()=>{ui.markNotificationRead(n.id);navigate(n.route)}}><span className={`notification-page-icon ${n.type}`}><Icon size={19}/></span><span><b>{n.title}</b><small>{n.message}</small></span><em>{n.time}</em></button>})}{!ui.notifications.length && <div className="empty-state"><Bell size={28}/><b>اعلانی وجود ندارد</b></div>}</article>
  </section>;
}
