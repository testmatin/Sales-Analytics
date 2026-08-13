import { ArrowRight, SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function NotFoundPage(){const navigate=useNavigate();return <section className="page"><div className="not-found panel"><SearchX size={36}/><h2>صفحه پیدا نشد</h2><p>مسیر موردنظر وجود ندارد یا جابه‌جا شده است.</p><button type="button" className="primary-action" onClick={()=>navigate('/')}><ArrowRight size={17}/> بازگشت به داشبورد</button></div></section>}
