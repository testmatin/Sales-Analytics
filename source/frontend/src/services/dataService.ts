import { api } from './api';
import type { CustomersData, DashboardData, Insight, Order, Product } from '../types';
import type { DateRange, NotificationItem, UserProfile } from '../context/UIContext';

export type PageResponse<T> = {
  items: T[];
  page: number;
  page_size: number;
  total: number;
  pages: number;
};

export type SearchApiResult = {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  type: 'product' | 'order' | 'insight';
};

export type ReportDefinition = {
  id: 'sales' | 'products' | 'customers' | 'orders';
  title: string;
  description: string;
  formats: Array<'csv' | 'json'>;
};

export async function getDashboardData(dateRange: DateRange = '30d'): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>('/dashboard', { params: { date_range: dateRange } });
  return data;
}

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<PageResponse<Product>>('/products', { params: { page: 1, page_size: 100 } });
  return data.items;
}

export async function getOrders(): Promise<Order[]> {
  const { data } = await api.get<PageResponse<Order>>('/orders', { params: { page: 1, page_size: 100 } });
  return data.items;
}

export async function getCustomers(): Promise<CustomersData> {
  const { data } = await api.get<CustomersData>('/customers/analytics');
  return data;
}

export async function getInsights(): Promise<Insight[]> {
  const { data } = await api.get<Insight[]>('/insights');
  return data;
}

export async function searchBackend(query: string): Promise<SearchApiResult[]> {
  const { data } = await api.get<SearchApiResult[]>('/search', { params: { q: query, limit: 12 } });
  return data;
}

export async function getUIData(): Promise<{ profile: UserProfile; notifications: NotificationItem[] }> {
  const { data } = await api.get<{ profile: UserProfile; notifications: NotificationItem[] }>('/ui');
  return data;
}

export async function updateProfileApi(profile: UserProfile): Promise<UserProfile> {
  const { data } = await api.put<UserProfile>('/ui/profile', profile);
  return data;
}

export async function markNotificationReadApi(id: number): Promise<NotificationItem[]> {
  const { data } = await api.patch<NotificationItem[]>(`/ui/notifications/${id}/read`);
  return data;
}

export async function markAllNotificationsReadApi(): Promise<NotificationItem[]> {
  const { data } = await api.patch<NotificationItem[]>('/ui/notifications/read-all');
  return data;
}

export async function getReports(): Promise<ReportDefinition[]> {
  const { data } = await api.get<ReportDefinition[]>('/reports');
  return data;
}
