import { MonitorCog, Moon, RotateCcw, Rows3, Sun, Type, Zap } from 'lucide-react';
import { useUI } from '../context/UIContext';

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (value:boolean)=>void; label:string; description:string }) {
  return <label className="setting-row"><span><b>{label}</b><small>{description}</small></span><input className="switch-input" type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}/></label>;
}

export default function SettingsPage() {
  const ui = useUI();
  return <section className="page settings-page">
    <div className="page-head"><div><small>Settings</small><h2>تنظیمات رابط کاربری</h2><p className="page-description">تنظیمات در مرورگر ذخیره می‌شوند و پس از Refresh باقی می‌مانند.</p></div><button className="secondary-action" type="button" onClick={ui.resetUISettings}><RotateCcw size={17}/> بازنشانی</button></div>

    <div className="settings-grid">
      <article className="panel settings-section"><div className="settings-section-head"><MonitorCog size={20}/><div><h3>ظاهر</h3><small>تم و نحوه نمایش رابط</small></div></div>
        <div className="theme-options">
          <button type="button" className={ui.theme === 'dark' ? 'active' : ''} onClick={() => ui.setTheme('dark')}><Moon size={20}/><span><b>حالت تاریک</b><small>مناسب محیط کم‌نور</small></span></button>
          <button type="button" className={ui.theme === 'light' ? 'active' : ''} onClick={() => ui.setTheme('light')}><Sun size={20}/><span><b>حالت روشن</b><small>پس‌زمینه روشن و خوانا</small></span></button>
        </div>
        <Toggle checked={ui.compactMode} onChange={ui.setCompactMode} label="حالت فشرده" description="فاصله ردیف‌ها و کارت‌ها کمی کمتر می‌شود."/>
        <Toggle checked={ui.reduceMotion} onChange={ui.setReduceMotion} label="کاهش انیمیشن" description="حرکت‌ها و Transitionهای غیرضروری کمتر می‌شوند."/>
      </article>

      <article className="panel settings-section"><div className="settings-section-head"><Type size={20}/><div><h3>تایپوگرافی</h3><small>کنترل مرکزی اندازه فونت کل داشبورد</small></div></div>
        <label className="font-scale-control"><span><b>اندازه پایه فونت</b><strong>{ui.rootFontSize}px</strong></span><input type="range" min="15" max="21" step="1" value={ui.rootFontSize} onChange={e => ui.setRootFontSize(Number(e.target.value))}/><div><small>کوچک</small><small>بزرگ</small></div></label>
        <div className="type-preview"><small>پیش‌نمایش</small><h3>گزارش فروش امروز</h3><p>تمام متن‌های رابط و نوشته‌های نمودارها از مقیاس مرکزی تایپوگرافی پیروی می‌کنند.</p><strong>۱۲٬۸۴۰٬۰۰۰٬۰۰۰ تومان</strong></div>
      </article>

      <article className="panel settings-section"><div className="settings-section-head"><Rows3 size={20}/><div><h3>سایدبار</h3><small>نحوه نمایش منوی اصلی</small></div></div>
        <Toggle checked={ui.sidebarCollapsed} onChange={ui.setSidebarCollapsed} label="حالت آیکونی در دسکتاپ" description="منو به عرض کوچک تبدیل می‌شود و فقط آیکون‌ها می‌مانند."/>
        <div className="settings-info"><Zap size={18}/><p>در موبایل، همبرگر منو یک Drawer کامل باز می‌کند و در لپ‌تاپ همان دکمه سایدبار را باز و بسته می‌کند.</p></div>
      </article>
    </div>
  </section>;
}
