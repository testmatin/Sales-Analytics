import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export default function AppErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText || 'خطای مسیر'}`
    : error instanceof Error
      ? error.message
      : 'یک خطای غیرمنتظره رخ داده است.';

  return <main className="fatal-error-page">
    <section className="fatal-error-card">
      <span className="fatal-error-icon"><AlertTriangle size={26}/></span>
      <small>خطای رابط کاربری</small>
      <h1>این بخش درست بارگذاری نشد.</h1>
      <p>{message}</p>
      <div className="fatal-error-actions">
        <button type="button" onClick={() => window.location.reload()}><RefreshCcw size={16}/> بارگذاری مجدد</button>
        <Link to="/"><Home size={16}/> بازگشت به داشبورد</Link>
      </div>
    </section>
  </main>;
}
