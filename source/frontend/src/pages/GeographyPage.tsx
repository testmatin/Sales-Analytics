import { MapPin, ShoppingCart, TrendingUp } from 'lucide-react';
import { useCallback } from 'react';
import { LoadingBlock } from '../components/shared/LoadingBlock';
import { useApiData } from '../hooks/useApiData';
import { getDashboardData } from '../services/dataService';
import { formatMoney, formatNumber } from '../utils/format';

export default function GeographyPage() {
  const loader = useCallback(() => getDashboardData(), []);
  const { data, loading } = useApiData(loader);
  if (loading || !data) return <section className="page"><LoadingBlock rows={6}/></section>;
  const maxRevenue = Math.max(...data.regions.map(r => r.revenue));
  return <section className="page">
    <div className="page-head"><div><small>Geography Analytics</small><h2>تحلیل جغرافیایی فروش</h2><p className="page-description">مقایسه سهم درآمد و سفارش مناطق برتر بر اساس داده نمایشی.</p></div></div>
    <div className="region-hero panel">
      <div><span className="large-icon"><MapPin size={24}/></span><small>منطقه برتر</small><h3>{data.regions[0].name}</h3><b>{formatMoney(data.regions[0].revenue)}</b></div>
      <div className="region-visual-bars">{data.regions.map((r, index) => <div key={r.name} className="region-column-wrap"><div className="region-column" style={{height:`${Math.max(28,(r.revenue/maxRevenue)*100)}%`}}><span>{r.share}٪</span></div><small>{r.name}</small></div>)}</div>
    </div>
    <div className="region-cards-grid">{data.regions.map((r,index) => <article className="panel geography-card" key={r.name}><div className="geo-card-top"><span className="rank-pill">#{index+1}</span><MapPin size={18}/></div><h3>{r.name}</h3><strong>{formatMoney(r.revenue)}</strong><div className="geo-stats"><span><ShoppingCart size={15}/>{formatNumber(r.orders)} سفارش</span><span><TrendingUp size={15}/>{r.share}٪ سهم</span></div><div className="track"><i style={{width:`${r.share}%`}}/></div></article>)}</div>
  </section>;
}
