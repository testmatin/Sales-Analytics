import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import AppErrorPage from '../pages/AppErrorPage';

const AuthPage = lazy(() => import('../pages/AuthPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const SalesPage = lazy(() => import('../pages/SalesPage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const CustomersPage = lazy(() => import('../pages/CustomersPage'));
const OrdersPage = lazy(() => import('../pages/OrdersPage'));
const GeographyPage = lazy(() => import('../pages/GeographyPage'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));
const InsightsPage = lazy(() => import('../pages/InsightsPage'));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

function RouteSuspense({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="route-loader" aria-live="polite"><span/><b>در حال آماده‌سازی صفحه...</b></div>}>{children}</Suspense>;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const location = useLocation();
  if (auth.loading) return <div className="route-loader full"><span/><b>در حال بررسی نشست کاربری...</b></div>;
  if (!auth.isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }}/>;
  return children;
}

const page = (node: ReactNode) => <RouteSuspense>{node}</RouteSuspense>;

export const router = createBrowserRouter([
  { path: '/login', element: page(<AuthPage/>), errorElement: <AppErrorPage/> },
  {
    path: '/',
    element: <RequireAuth><DashboardLayout/></RequireAuth>,
    errorElement: <AppErrorPage/>,
    children: [
      { index: true, element: page(<DashboardPage/>) },
      { path: 'analytics/sales', element: page(<SalesPage/>) },
      { path: 'products', element: page(<ProductsPage/>) },
      { path: 'customers', element: page(<CustomersPage/>) },
      { path: 'orders', element: page(<OrdersPage/>) },
      { path: 'geography', element: page(<GeographyPage/>) },
      { path: 'reports', element: page(<ReportsPage/>) },
      { path: 'insights', element: page(<InsightsPage/>) },
      { path: 'notifications', element: page(<NotificationsPage/>) },
      { path: 'profile', element: page(<ProfilePage/>) },
      { path: 'settings', element: page(<SettingsPage/>) },
      { path: '*', element: page(<NotFoundPage/>) },
    ],
  },
]);
