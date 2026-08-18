import { CircleDollarSign, CirclePercent, ShoppingCart, Users } from 'lucide-react';
import { lazy, Suspense, useCallback, useMemo } from 'react';
import { KpiCard } from '../components/dashboard/KpiCard';
import { LoadingBlock } from '../components/shared/LoadingBlock';
import { useApiData } from '../hooks/useApiData';
import { getDashboardData, getOrders, getProducts } from '../services/dataService';
import { formatMoney, formatNumber } from '../utils/format';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';

const DataCity3D = lazy(() => import('../components/dashboard/DataCity3D').then(module => ({ default: module.DataCity3D })));
const SalesTrendChart = lazy(() => import('../components/charts/Charts').then(module => ({ default: module.SalesTrendChart })));
const CategoryChart = lazy(() => import('../components/charts/Charts').then(module => ({ default: module.CategoryChart })));
const ChannelChart = lazy(() => import('../components/charts/Charts').then(module => ({ default: module.ChannelChart })));

function VisualFallback({ label = 'در حال آماده‌سازی نمایش...' }: { label?: string }) {
  return <div className="visual-fallback"><span className="visual-fallback-dot"/><small>{label}</small></div>;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { dateRange } = useUI();
  const dashboardLoader = useCallback(() => getDashboardData(dateRange), [dateRange]);
  const productsLoader = useCallback(() => getProducts(), []);
  const ordersLoader = useCallback(() => getOrders(), []);
  const { data, loading } = useApiData(dashboardLoader);
  const { data: products } = useApiData(productsLoader);
  const { data: orders } = useApiData(ordersLoader);

  const trend = useMemo(() => data?.salesTrend ?? [], [data]);

  if (loading || !data) return <section className="page"><LoadingBlock rows={4}/></section>;
  const s = data.summary;

  return <section className="page">
    <div className="hero-panel">
      <div className="hero-copy">
        <div className="eyebrow"><i/> 3D SALES INTELLIGENCE</div>
        <h2>از عددها عبور کن؛<br/><span>فروش را در سه بُعد ببین.</span></h2>
        <p>داشبورد مدیریتی برای تحلیل فروش، سود، سفارش، مشتری و کانال‌های درآمدی؛ تمام اطلاعات این صفحه از API بک‌اند FastAPI دریافت می‌شود و منبع داده نمایشی در Backend نگهداری می‌شود.</p>
        <div className="hero-actions"><button type="button" onClick={() => navigate('/reports')}>ساخت گزارش جدید</button><button type="button" className="secondary" onClick={() => navigate('/analytics/sales')}>مشاهده جزئیات</button></div>
      </div>
      <div className="hero-visual">
        <Suspense fallback={<VisualFallback label="در حال بارگذاری نمای سه‌بعدی..."/>}><DataCity3D values={trend} /></Suspense>
        <div className="floating-metric metric-a"><small>رشد فروش</small><b>+{s.revenueGrowth}٪</b></div>
        <div className="floating-metric metric-b"><small>سفارش‌ها</small><b>{formatNumber(s.totalOrders)}</b></div>
        {/* <div className="scene-footer"><span>FASTAPI • REST API</span><b>Backend متصل است</b></div> */}
      </div>
    </div>

    <div className="kpi-grid">
      <KpiCard label="فروش کل" value={formatMoney(s.totalRevenue)} growth={s.revenueGrowth} icon={<CircleDollarSign size={18}/>} accent="violet"/>
      <KpiCard label="تعداد سفارش" value={formatNumber(s.totalOrders)} growth={s.ordersGrowth} icon={<ShoppingCart size={18}/>} accent="blue"/>
      <KpiCard label="کل مشتریان" value={formatNumber(s.totalCustomers)} growth={s.customersGrowth} icon={<Users size={18}/>} accent="cyan"/>
      <KpiCard label="نرخ تبدیل" value={`${s.conversionRate}٪`} growth={s.conversionGrowth} icon={<CirclePercent size={18}/>} accent="pink"/>
    </div>

    <div className="analytics-grid">
      <article className="panel wide"><div className="panel-head"><div><small>روند عملکرد</small><h3>فروش و سود در طول زمان</h3></div><span className="tag">میلیون تومان</span></div><div className="chart-lg"><Suspense fallback={<VisualFallback label="در حال آماده‌سازی نمودار..."/>}><SalesTrendChart data={trend}/></Suspense></div></article>
      <article className="panel"><div className="panel-head"><div><small>ترکیب درآمد</small><h3>فروش بر اساس دسته</h3></div></div><div className="chart-donut"><Suspense fallback={<VisualFallback label="در حال آماده‌سازی نمودار..."/>}><CategoryChart data={data.categorySales}/></Suspense><div className="donut-label"><small>بیشترین سهم</small><b>{data.categorySales[0].value}٪</b></div></div><div className="legend-list">{data.categorySales.slice(0,4).map((x,i)=><div key={x.name}><i className={`c${i}`}/><span>{x.name}</span><b>{x.value}٪</b></div>)}</div></article>
      <article className="panel"><div className="panel-head"><div><small>کانال فروش</small><h3>درآمد هر کانال</h3></div></div><div className="chart-sm"><Suspense fallback={<VisualFallback label="در حال آماده‌سازی نمودار..."/>}><ChannelChart data={data.channelSales}/></Suspense></div></article>
      <article className="panel"><div className="panel-head"><div><small>جغرافیا</small><h3>مناطق برتر</h3></div></div><div className="region-list">{data.regions.map(r=><div className="region" key={r.name}><div><span>{r.name}</span><b>{formatMoney(r.revenue)}</b></div><div className="track"><i style={{width:`${r.share}%`}}/></div><small>{formatNumber(r.orders)} سفارش</small></div>)}</div></article>
    </div>

    <div className="lower-grid">
      <article className="panel"><div className="panel-head"><div><small>محصولات</small><h3>پرفروش‌ترین محصولات</h3></div></div><div className="product-list">{products?.slice(0,5).map((p,i)=><div className="product-row" key={p.id}><span className="rank">0{i+1}</span><span className={`product-cube cube-${i}`}/><div><b>{p.name}</b><small>{p.category}</small></div><div className="end"><b>{formatMoney(p.revenue)}</b><small className={p.growth >= 0 ? 'positive':'negative'}>{p.growth > 0 ? '+' : ''}{p.growth}٪</small></div></div>)}</div></article>
      <article className="panel"><div className="panel-head"><div><small>سفارش‌ها</small><h3>آخرین سفارش‌ها</h3></div></div><div className="orders-table"><div className="order-row head"><span>شناسه</span><span>مشتری</span><span>مبلغ</span><span>وضعیت</span></div>{orders?.slice(0,5).map(o=><div className="order-row" key={o.id}><span>{o.id}</span><span><b>{o.customer}</b><small>{o.city}</small></span><span>{formatMoney(o.amount)}</span><span><i className={`status ${o.status}`}>{statusLabel(o.status)}</i></span></div>)}</div></article>
    </div>
  </section>;
}

function statusLabel(status: string) {
  return ({ completed:'تکمیل‌شده', processing:'در حال پردازش', pending:'در انتظار', refunded:'مرجوع' } as Record<string,string>)[status] ?? status;
}
