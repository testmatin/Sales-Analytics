import { BarChart3, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@nexa.example.com');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!auth.loading && auth.isAuthenticated) return <Navigate to="/" replace/>;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(''); setSubmitting(true);
    try {
      if (mode === 'login') await auth.login(email, password);
      else await auth.register({ name, email, password });
      const target = (location.state as { from?: string } | null)?.from || '/';
      navigate(target, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ورود ناموفق بود');
    } finally { setSubmitting(false); }
  };

  return <main className="auth-page">
    <section className="auth-card">
      <div className="auth-brand"><span><BarChart3 size={24}/></span><div><b>Nexa Analytics</b><small>سامانه تحلیل داده‌های فروش</small></div></div>
      <div className="auth-tabs"><button className={mode==='login'?'active':''} onClick={()=>setMode('login')} type="button">ورود</button><button className={mode==='register'?'active':''} onClick={()=>setMode('register')} type="button">ثبت‌نام</button></div>
      <div className="auth-heading"><h1>{mode==='login'?'ورود به داشبورد':'ساخت حساب کاربری'}</h1><p>{mode==='login'?'برای دسترسی به گزارش‌ها وارد حساب خود شوید.':'حساب‌های جدید با نقش مشاهده‌گر ساخته می‌شوند.'}</p></div>
      <form onSubmit={submit} className="auth-form">
        {mode==='register' && <label><span>نام و نام خانوادگی</span><div><UserRound size={18}/><input value={name} onChange={e=>setName(e.target.value)} minLength={2} required placeholder="نام شما"/></div></label>}
        <label><span>ایمیل</span><div><Mail size={18}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="name@example.com" dir="ltr"/></div></label>
        <label><span>رمز عبور</span><div><LockKeyhole size={18}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required placeholder="حداقل ۸ کاراکتر" dir="ltr"/></div></label>
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-submit" disabled={submitting}>{submitting?'در حال پردازش...':mode==='login'?'ورود به سامانه':'ساخت حساب'}</button>
      </form>
      <div className="dev-credentials"><b>حساب توسعه</b><span>admin@nexa.example.com</span><span>Admin123!</span></div>
    </section>
  </main>;
}
