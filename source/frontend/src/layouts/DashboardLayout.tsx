import { Outlet } from 'react-router-dom';
import { GlobalSearch } from '../components/navigation/GlobalSearch';
import { useUI } from '../context/UIContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function DashboardLayout() {
  const { sidebarCollapsed } = useUI();
  return <div className={`app-shell ${sidebarCollapsed ? 'is-collapsed' : ''}`}>
    <Sidebar/>
    <main className="main-area"><Navbar/><Outlet/></main>
    <GlobalSearch/>
  </div>;
}
