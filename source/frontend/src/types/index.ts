export type DashboardData = {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    netProfit: number;
    totalCustomers: number;
    averageOrderValue: number;
    conversionRate: number;
    revenueGrowth: number;
    ordersGrowth: number;
    profitGrowth: number;
    customersGrowth: number;
    aovGrowth: number;
    conversionGrowth: number;
  };
  salesTrend: Array<{ label: string; revenue: number; profit: number; orders: number }>;
  categorySales: Array<{ name: string; value: number }>;
  channelSales: Array<{ name: string; revenue: number }>;
  regions: Array<{ name: string; revenue: number; orders: number; share: number }>;
  activity: Array<{ type: string; title: string; time: string }>;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  growth: number;
  stock: number;
  status: 'active' | 'low_stock';
};

export type Order = {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'completed' | 'processing' | 'pending' | 'refunded';
  payment: string;
  city: string;
  date: string;
};

export type CustomersData = {
  summary: {
    total: number;
    new: number;
    returning: number;
    retentionRate: number;
    churnRate: number;
    lifetimeValue: number;
  };
  segments: Array<{ name: string; customers: number; averageSpend: number; revenueShare: number; growth: number }>;
};

export type Insight = {
  id: number;
  type: 'opportunity' | 'warning' | 'trend' | 'recommendation';
  title: string;
  description: string;
  score: number;
};
