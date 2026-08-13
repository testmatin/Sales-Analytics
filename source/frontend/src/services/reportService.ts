import { api } from './api';

export async function downloadReport(reportType: string, format: 'csv' | 'json') {
  const response = await api.get(`/reports/${reportType}/download`, {
    params: { format },
    responseType: 'blob',
  });
  const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${reportType}-report.${format}`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
