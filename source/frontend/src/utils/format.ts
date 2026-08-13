export const formatMoney = (value: number) =>
  `${new Intl.NumberFormat('fa-IR', { notation: 'compact', maximumFractionDigits: 1 }).format(value)} تومان`;

export const formatNumber = (value: number) => new Intl.NumberFormat('fa-IR').format(value);

export const formatPercent = (value: number) => `${new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(value)}٪`;
