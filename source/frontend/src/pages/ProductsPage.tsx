import { Download, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { LoadingBlock } from '../components/shared/LoadingBlock';
import { useApiData } from '../hooks/useApiData';
import { getProducts } from '../services/dataService';
import { downloadCsv } from '../utils/download';
import { formatMoney, formatNumber } from '../utils/format';

export default function ProductsPage() {
  const loader = useCallback(() => getProducts(), []);
  const { data, loading } = useApiData(loader);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const categories = useMemo(()=>['all',...Array.from(new Set(data?.map(x=>x.category)??[]))],[data]);
  const rows = useMemo(() => data?.filter(x => `${x.name} ${x.category} ${x.id}`.toLowerCase().includes(query.toLowerCase()) && (category==='all'||x.category===category)) ?? [], [data, query, category]);
  return <section className="page"><div className="page-head"><div><small>Product Analytics</small><h2>عملکرد محصولات</h2></div><div className="page-head-actions"><label className="page-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="جستجوی محصول..."/></label><select className="select" value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c} value={c}>{c==='all'?'همه دسته‌ها':c}</option>)}</select><button type="button" className="secondary-action" onClick={()=>downloadCsv('products.csv',rows)}><Download size={16}/> CSV</button></div></div>{loading ? <LoadingBlock rows={6}/> : <article className="panel table-panel"><div className="data-table product-table"><div className="data-row data-head"><span>محصول</span><span>دسته‌بندی</span><span>فروش</span><span>درآمد</span><span>رشد</span><span>موجودی</span></div>{rows.map(p=><div className="data-row" key={p.id}><span><b>{p.name}</b><small>{p.id}</small></span><span>{p.category}</span><span>{formatNumber(p.unitsSold)}</span><span>{formatMoney(p.revenue)}</span><span className={p.growth>=0?'positive':'negative'}>{p.growth>0?'+':''}{p.growth}٪</span><span><i className={p.status==='low_stock'?'badge warn':'badge'}>{formatNumber(p.stock)}</i></span></div>)}</div>{!rows.length&&<div className="empty-inline">محصولی با این فیلتر پیدا نشد.</div>}</article>}</section>;
}
