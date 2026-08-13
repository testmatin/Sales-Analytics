import { Check, Mail, Phone, Save, ShieldCheck, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUI, type UserProfile } from '../context/UIContext';

export default function ProfilePage() {
  const ui = useUI();
  const [form, setForm] = useState<UserProfile>(ui.profile);
  const [saved, setSaved] = useState(false);
  useEffect(() => setForm(ui.profile), [ui.profile]);
  const update = (key: keyof UserProfile, value: string) => setForm(prev => ({...prev,[key]:value}));
  const save = async () => { try { await ui.updateProfile(form); setSaved(true); window.setTimeout(() => setSaved(false), 1800); } catch (error) { alert(error instanceof Error ? error.message : 'ذخیره پروفایل ناموفق بود'); } };
  return <section className="page profile-page">
    <div className="page-head"><div><small>Account</small><h2>پروفایل کاربری</h2><p className="page-description">اطلاعات حساب را ویرایش کن؛ تغییرات در فایل داده Backend ذخیره می‌شوند.</p></div></div>
    <div className="profile-page-grid">
      <article className="panel profile-card-large"><div className="profile-avatar-large">{form.initials}</div><h3>{form.name}</h3><p>{form.role}</p><div className="account-badge"><ShieldCheck size={16}/> حساب مدیر • Demo</div><div className="profile-contact"><span><Mail size={16}/>{form.email}</span><span><Phone size={16}/>{form.phone}</span></div></article>
      <article className="panel profile-form-card"><div className="settings-section-head"><UserRound size={20}/><div><h3>اطلاعات حساب</h3><small>ویرایش اطلاعات نمایشی پروفایل</small></div></div>
        <div className="form-grid">
          <label><span>نام و نام خانوادگی</span><input value={form.name} onChange={e=>update('name',e.target.value)}/></label>
          <label><span>سمت سازمانی</span><input value={form.role} onChange={e=>update('role',e.target.value)}/></label>
          <label><span>ایمیل</span><input type="email" value={form.email} onChange={e=>update('email',e.target.value)}/></label>
          <label><span>تلفن</span><input value={form.phone} onChange={e=>update('phone',e.target.value)}/></label>
          <label><span>حروف آواتار</span><input maxLength={3} value={form.initials} onChange={e=>update('initials',e.target.value.toUpperCase())}/></label>
        </div>
        <button type="button" className="primary-action" onClick={save}>{saved ? <Check size={18}/> : <Save size={18}/>} {saved ? 'ذخیره شد' : 'ذخیره تغییرات'}</button>
      </article>
    </div>
  </section>;
}
