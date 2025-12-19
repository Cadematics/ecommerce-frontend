import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://9000-firebase-ecommece-backend-1765944611031.cluster-audjkuawmbgfgvyf4nylufyt7c.cloudworkstations.dev/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/_workstation': {
        target: 'http://localhost:80',
        changeOrigin: true,
        secure: false,
        ws: true,
        onProxyReq: (proxyReq, req, res) => {
          proxyReq.setHeader('Host', req.headers.host);
          proxyReq.setHeader('X-Forwarded-Host', req.headers.host);
        },
      },
    },
  },
})
