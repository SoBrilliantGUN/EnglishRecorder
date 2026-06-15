import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 将 React 核心拆为独立 vendor chunk，提升跨部署缓存命中率
    rolldownOptions: {
      output: {
        codeSplitting: true,
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/scheduler')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/dayjs')) {
            return 'vendor-dayjs';
          }
        },
      },
    },
    // 降低 chunk 大小告警阈值，让手动拆分更显眼
    chunkSizeWarningLimit: 300,
  },
})
