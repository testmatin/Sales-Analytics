import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'chart.js', 'react-chartjs-2', 'three'],
  },
  server: {
    port: 5173,
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/app/router.tsx',
        './src/layouts/DashboardLayout.tsx',
        './src/pages/DashboardPage.tsx',
      ],
    },
  },
});
