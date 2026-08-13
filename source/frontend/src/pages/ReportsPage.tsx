import { Download, FileBarChart, FileJson, FileSpreadsheet, FileText, Printer } from 'lucide-react';
import { useCallback } from 'react';
import { LoadingBlock } from '../components/shared/LoadingBlock';
import { useApiData } from '../hooks/useApiData';
import { getReports, type ReportDefinition } from '../services/dataService';
import { downloadReport } from '../services/reportService';

const iconMap = {
  sales: FileBarChart,
  products: FileSpreadsheet,
  customers: FileText,
  orders: FileSpreadsheet,
} as const;

export default function ReportsPage(){
  const loader = useCallback(() => getReports(), []);
  const { data: reports, loading, error } = useApiData(loader);

  const runDownload = async (report: ReportDefinition, format: 'csv' | 'json') => {
    try {
      await downloadReport(report.id, format);
    } catch (downloadError) {
      alert(downloadError instanceof Error ? downloadError.message : 'خطا در دانلود گزارش');
    }
  };

  const ordersReport = reports?.find(r => r.id === 'orders');

  return <section className="page">
    <div className="page-head"><div><small>Reports</small><h2>مرکز گزارش‌ها</h2><p className="page-description">گزارش‌ها و فایل خروجی از FastAPI تولید می‌شوند و داده‌ای داخل React نگهداری نمی‌شود.</p></div></div>
    {loading ? <LoadingBlock rows={4}/> : error ? <div className="empty-inline">{error}</div> : <div className="report-grid">{reports?.filter(r => r.id !== 'orders').map((report,i)=>{
      const Icon = iconMap[report.id];
      return <article className="report-card" key={report.id}><span><Icon size={24}/></span><small>REPORT 0{i+1}</small><h3>{report.title}</h3><p>{report.description}</p><div className="report-actions"><button type="button" onClick={()=>runDownload(report,'csv')}><Download size={15}/> CSV</button><button type="button" onClick={()=>runDownload(report,'json')}><FileJson size={15}/> JSON</button><button type="button" onClick={()=>window.print()}><Printer size={15}/> PDF / Print</button></div></article>;
    })}</div>}
    {ordersReport && <article className="panel report-data-note"><FileSpreadsheet size={20}/><div><b>گزارش سفارش‌ها از Backend</b><small>فایل CSV مستقیم توسط FastAPI ساخته و دانلود می‌شود.</small></div><button type="button" className="secondary-action" onClick={()=>runDownload(ordersReport,'csv')}><Download size={16}/> دانلود سفارش‌ها</button></article>}
  </section>;
}
