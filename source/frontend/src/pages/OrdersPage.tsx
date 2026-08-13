import { Download, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { LoadingBlock } from '../components/shared/LoadingBlock';
import { useApiData } from '../hooks/useApiData';
import { getOrders } from '../services/dataService';
import { downloadCsv } from '../utils/download';
import { formatMoney } from '../utils/format';

export default function OrdersPage(){
  const loader=useCallback(()=>getOrders(),[]);
  const{data,loading}=useApiData(loader);
  const[filter,setFilter]=useState('all');
  const[query,setQuery]=useState('');
  const rows=useMemo(()=>data?.filter(o=>(filter==='all'||o.status===filter)&&`${o.id} ${o.customer} ${o.product} ${o.city}`.toLowerCase().includes(query.toLowerCase()))??[],[data,filter,query]);
  return <section className="page"><div className="page-head"><div><small>Orders</small><h2>سفارش‌ها</h2></div><div className="page-head-actions"><label className="page-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="شناسه، مشتری یا محصول..."/></label><select className="select" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">همه وضعیت‌ها</option><option value="completed">تکمیل‌شده</option><option value="processing">در حال پردازش</option><option value="pending">در انتظار</option><option value="refunded">مرجوع</option></select><button type="button" className="secondary-action" onClick={()=>downloadCsv('orders.csv',rows)}><Download size={16}/> CSV</button></div></div>{loading?<LoadingBlock rows={6}/>:<article className="panel table-panel"><div className="data-table orders-full"><div className="data-row data-head"><span>شناسه</span><span>مشتری</span><span>محصول</span><span>مبلغ</span><span>پرداخت</span><span>شهر</span><span>وضعیت</span></div>{rows.map(o=><div className="data-row" key={o.id}><span>{o.id}</span><span><b>{o.customer}</b><small>{o.date}</small></span><span>{o.product}</span><span>{formatMoney(o.amount)}</span><span>{o.payment}</span><span>{o.city}</span><span><i className={`status ${o.status}`}>{({completed:'تکمیل‌شده',processing:'پردازش',pending:'انتظار',refunded:'مرجوع'} as Record<string,string>)[o.status]}</i></span></div>)}</div>{!rows.length&&<div className="empty-inline">سفارشی با این فیلتر پیدا نشد.</div>}</article>}</section>;
}
