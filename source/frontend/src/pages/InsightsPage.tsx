import { BrainCircuit, Lightbulb, TrendingUp, TriangleAlert } from 'lucide-react';
import { useCallback } from 'react';
import { LoadingBlock } from '../components/shared/LoadingBlock';
import { useApiData } from '../hooks/useApiData';
import { getInsights } from '../services/dataService';
const icons={opportunity:Lightbulb,warning:TriangleAlert,trend:TrendingUp,recommendation:BrainCircuit};
export default function InsightsPage(){const loader=useCallback(()=>getInsights(),[]);const{data,loading}=useApiData(loader);return <section className="page"><div className="page-head"><div><small>Rule-based Fake Insights</small><h2>AI Insights</h2></div></div>{loading?<LoadingBlock rows={4}/>:<div className="insight-grid">{data?.map(item=>{const Icon=icons[item.type];return <article className={`insight-card ${item.type}`} key={item.id}><span className="insight-icon"><Icon size={20}/></span><small>{item.type.toUpperCase()}</small><h3>{item.title}</h3><p>{item.description}</p><div className="confidence"><span>Confidence score</span><b>{item.score}٪</b></div><div className="confidence-track"><i style={{width:`${item.score}%`}}/></div></article>})}</div>}</section>}
