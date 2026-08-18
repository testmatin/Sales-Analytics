export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
};

export type Order = {
  id: string;
  customer: string;
  amount: number;
  status: 'تکمیل شده' | 'در حال پردازش' | 'لغو شده';
  date: string;
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  orders: number;
  spent: number;
};

export const kpis = [
  { label: 'فروش کل', value: '۲۴۸.۶ م', delta: '+۱۲.۴٪', icon: '↗' },
  { label: 'سفارش‌ها', value: '۱,۲۸۴', delta: '+۸.۲٪', icon: '▣' },
  { label: 'مشتری‌ها', value: '۸۶۴', delta: '+۵.۷٪', icon: '◎' },
  { label: 'میانگین سفارش', value: '۱.۹۳ م', delta: '+۳.۱٪', icon: '◈' },
];

export const salesTrend = [42, 56, 48, 72, 68, 86, 78, 102, 96, 118, 110, 132];

export const products: Product[] = [
  { id: 1, name: 'لپ‌تاپ Pro 14', category: 'دیجیتال', price: 68400000, stock: 18, sales: 142 },
  { id: 2, name: 'هدفون بی‌سیم X2', category: 'دیجیتال', price: 3980000, stock: 43, sales: 384 },
  { id: 3, name: 'صندلی ارگونومیک', category: 'اداری', price: 12800000, stock: 9, sales: 96 },
  { id: 4, name: 'مانیتور 27 اینچ', category: 'دیجیتال', price: 17300000, stock: 22, sales: 174 },
  { id: 5, name: 'کیبورد مکانیکی', category: 'لوازم جانبی', price: 2750000, stock: 61, sales: 268 },
];

export const orders: Order[] = [
  { id: '#SA-1048', customer: 'علی رضایی', amount: 68400000, status: 'تکمیل شده', date: 'امروز، ۱۴:۲۰' },
  { id: '#SA-1047', customer: 'سارا محمدی', amount: 17300000, status: 'در حال پردازش', date: 'امروز، ۱۲:۴۵' },
  { id: '#SA-1046', customer: 'مهدی اکبری', amount: 6730000, status: 'تکمیل شده', date: 'امروز، ۱۰:۱۰' },
  { id: '#SA-1045', customer: 'نگار احمدی', amount: 12800000, status: 'لغو شده', date: 'دیروز، ۱۹:۳۰' },
  { id: '#SA-1044', customer: 'امیر کریمی', amount: 3980000, status: 'تکمیل شده', date: 'دیروز، ۱۶:۰۵' },
];

export const customers: Customer[] = [
  { id: 1, name: 'علی رضایی', email: 'ali@example.com', orders: 18, spent: 127500000 },
  { id: 2, name: 'سارا محمدی', email: 'sara@example.com', orders: 12, spent: 89400000 },
  { id: 3, name: 'مهدی اکبری', email: 'mahdi@example.com', orders: 9, spent: 63800000 },
  { id: 4, name: 'نگار احمدی', email: 'negar@example.com', orders: 7, spent: 49200000 },
];

export const categoryShare = [
  { label: 'دیجیتال', value: 48 },
  { label: 'اداری', value: 27 },
  { label: 'لوازم جانبی', value: 17 },
  { label: 'سایر', value: 8 },
];
