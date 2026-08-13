import {
  ArcElement, BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale,
  LineElement, PointElement, Tooltip,
} from 'chart.js';
import { useEffect, useMemo } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useUI } from '../../context/UIContext';
import type { DashboardData } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Filler, Tooltip, Legend);

function useChartTheme() {
  const { theme, rootFontSize } = useUI();
  useEffect(() => {
    const family = getComputedStyle(document.documentElement).getPropertyValue('--font-family-ui').trim() || 'Vazirmatn, sans-serif';
    ChartJS.defaults.font.family = family;
    ChartJS.defaults.font.size = Math.round(rootFontSize * .82);
    ChartJS.defaults.font.weight = 500;
  }, [theme, rootFontSize]);

  return useMemo(() => ({
    text: theme === 'dark' ? '#929caf' : '#5f6b7d',
    grid: theme === 'dark' ? 'rgba(255,255,255,.055)' : 'rgba(34,45,65,.09)',
    border: theme === 'dark' ? '#101621' : '#ffffff',
  }), [theme]);
}

export function SalesTrendChart({ data }: { data: DashboardData['salesTrend'] }) {
  const c = useChartTheme();
  return <Line data={{
    labels: data.map(x => x.label),
    datasets: [
      { label: 'فروش', data: data.map(x => x.revenue), borderColor: '#8b7cf6', backgroundColor: 'rgba(108,92,231,.14)', fill: true, tension: .42, pointRadius: 0, borderWidth: 2.2 },
      { label: 'سود', data: data.map(x => x.profit), borderColor: '#00b8df', backgroundColor: 'transparent', tension: .4, pointRadius: 0, borderWidth: 1.6 },
    ],
  }} options={{ responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { labels: { color: c.text, boxWidth: 10 } }, tooltip: { rtl: true } }, scales: { x: { grid: { display: false }, ticks: { color: c.text } }, y: { grid: { color: c.grid }, ticks: { color: c.text } } } }} />;
}

export function CategoryChart({ data }: { data: DashboardData['categorySales'] }) {
  const c = useChartTheme();
  return <Doughnut data={{ labels: data.map(x => x.name), datasets: [{ data: data.map(x => x.value), backgroundColor: ['#6c5ce7','#4d9fff','#00d084','#d36aff','#8a94a7'], borderColor: c.border, borderWidth: 5 }] }} options={{ responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false }, tooltip: { rtl: true } } }} />;
}

export function ChannelChart({ data }: { data: DashboardData['channelSales'] }) {
  const c = useChartTheme();
  return <Bar data={{ labels: data.map(x => x.name), datasets: [{ label: 'درآمد', data: data.map(x => x.revenue), backgroundColor: ['#6c5ce7','#4d9fff','#00d084','#d36aff'], borderRadius: 8, borderSkipped: false }] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { rtl: true } }, scales: { x: { grid: { display: false }, ticks: { color: c.text } }, y: { grid: { color: c.grid }, ticks: { color: c.text } } } }} />;
}
