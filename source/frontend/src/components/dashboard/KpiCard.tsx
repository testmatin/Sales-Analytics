import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export function KpiCard({ label, value, growth, icon, accent = 'violet' }: {
  label: string;
  value: string;
  growth: number;
  icon: ReactNode;
  accent?: 'violet' | 'blue' | 'cyan' | 'pink';
}) {
  const positive = growth >= 0;
  return (
    <article className={`kpi-card ${accent}`}>
      <div className="kpi-top">
        <span className="kpi-icon">{icon}</span>
        <span className={positive ? 'growth up' : 'growth down'}>
          {positive ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {Math.abs(growth)}٪
        </span>
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
      <div className="sparkline-bars" aria-hidden="true">
        {[36,52,44,62,57,73,68,84].map((h,i)=><i key={i} style={{height:`${h}%`}} />)}
      </div>
    </article>
  );
}
