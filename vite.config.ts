import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // 👈 receber mode
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tsconfigPaths(), tailwindcss()],
    server: {
      open: true,
      proxy: {
        '/solar-api': {
          target: 'https://api.le-systeme-solaire.net',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/solar-api/, '/rest'),
          headers: {
            Authorization: `Bearer ${env.VITE_SOLAR_API_KEY}`,
          },
        },
      },
    },
  }
})
