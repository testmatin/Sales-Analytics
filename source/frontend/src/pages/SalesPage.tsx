import { CircleDollarSign, CirclePercent, ShoppingCart, TrendingUp } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { SalesTrendChart } from '../components/charts/Charts';
import { KpiCard } from '../components/dashboard/KpiCard';
import { LoadingBlock } from '../components/shared/LoadingBlock';
import { useUI } from '../context/UIContext';
import { useApiData } from '../hooks/useApiData';
import { getDashboardData } from '../services/dataService';
import { formatMoney, formatNumber } from '../utils/format';

export default function SalesPage() {
  const { dateRange } = useUI();
  const loader = useCallback(() => getDashboardData(dateRange), [dateRange]);
  const { data, loading } = useApiData(loader);
  const trend = useMemo(() => data?.salesTrend ?? [], [data]);

  if (loading || !data) return <section className="page"><LoadingBlock rows={7}/></section>;
  const summary = data.summary;
  const best = trend.reduce((a,b) => a.revenue > b.revenue ? a : b, trend[0]);
  const worst = trend.reduce((a,b) => a.revenue < b.revenue ? a : b, trend[0]);

  return <section className="page">
    <div className="page-head"><div><small>Sales Analytics</small><h2>تحلیل عملکرد فروش</h2><p className="page-description">روند درآمد، سود، سفارش و بهترین/ضعیف‌ترین روزهای دوره انتخابی.</p></div></div>
    <div className="kpi-grid">
      <KpiCard label="فروش کل" value={formatMoney(summary.totalRevenue)} growth={summary.revenueGrowth} icon={<CircleDollarSign size={18}/>} accent="violet"/>
      <KpiCard label="سفارش‌ها" value={formatNumber(summary.totalOrders)} growth={summary.ordersGrowth} icon={<ShoppingCart size={18}/>} accent="blue"/>
      <KpiCard label="میانگین سفارش" value={formatMoney(summary.averageOrderValue)} growth={summary.aovGrowth} icon={<TrendingUp size={18}/>} accent="cyan"/>
      <KpiCard label="نرخ تبدیل" value={`${summary.conversionRate}٪`} growth={summary.conversionGrowth} icon={<CirclePercent size={18}/>} accent="pink"/>
    </div>
    <article className="panel sales-main-panel"><div className="panel-head"><div><small>Revenue & Profit</small><h3>روند فروش و سود</h3></div><span className="tag">دوره انتخابی</span></div><div className="chart-lg chart-xl"><SalesTrendChart data={trend}/></div></article>
    <div className="sales-summary-grid">
      <article className="panel metric-summary-card"><small>بهترین روز فروش</small><b>{best.label}</b><strong>{best.revenue} میلیون تومان</strong></article>
      <article className="panel metric-summary-card"><small>کمترین فروش</small><b>{worst.label}</b><strong>{worst.revenue} میلیون تومان</strong></article>
      <article className="panel metric-summary-card"><small>سود خالص</small><b>{formatMoney(summary.netProfit)}</b><strong className="positive">+{summary.profitGrowth}٪ نسبت به دوره قبل</strong></article>
    </div>
  </section>;
}
