import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { seo } from './seo/plugin'
import { assetVersions } from './seo/asset-versions'

function localApi(): Plugin {
  return {
    name: 'local-api',
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''))
      for (const name of ['github', 'content']) {
        server.middlewares.use(`/api/${name}`, async (_req, res) => {
          try {
            const { GET } = await server.ssrLoadModule(`/api/${name}.ts`)
            const out: Response = await GET()
            res.statusCode = out.status
            out.headers.forEach((value, key) => res.setHeader(key, value))
            res.end(await out.text())
          } catch {
            res.statusCode = 500
            res.end()
          }
        })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), assetVersions(), localApi(), seo()],
})
