import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function localApi(): Plugin {
  return {
    name: 'local-api',
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''))
      server.middlewares.use('/api/github', async (_req, res) => {
        try {
          const { GET } = await server.ssrLoadModule('/api/github.ts')
          const out: Response = await GET()
          res.statusCode = out.status
          out.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(await out.text())
        } catch {
          res.statusCode = 500
          res.end()
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localApi()],
})
