import { defineConfig, loadEnv, type Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

function reniecApi(): Plugin {
  let apiUrl = ''
  let apiToken = ''

  const handleRequest = async (request: IncomingMessage, response: ServerResponse, next: () => void) => {
    const pathname = new URL(request.url ?? '/', 'http://localhost').pathname
    const match = pathname.match(/^\/api\/reniec\/(\d{8})$/)
    if (!match) {
      next()
      return
    }

    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.setHeader('Cache-Control', 'no-store')
    if (!apiToken) {
      response.statusCode = 503
      response.end(JSON.stringify({ message: 'Falta configurar RENIEC_API_TOKEN y reiniciar el servidor.' }))
      return
    }

    const dni = match[1]

    try {
      const providerResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dni }),
        signal: AbortSignal.timeout(10000),
      })
      const body = await providerResponse.text()
      response.statusCode = providerResponse.ok ? 200 : providerResponse.status
      response.end(body || JSON.stringify({ message: 'RENIEC no devolvió información.' }))
    } catch {
      response.statusCode = 502
      response.end(JSON.stringify({ message: 'No se pudo conectar con el servicio de RENIEC.' }))
    }
  }

  return {
    name: 'reniec-api',
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, '')
      apiUrl = env.RENIEC_API_URL || 'https://api.json.pe/api/dni'
      apiToken = env.RENIEC_API_TOKEN || ''
    },
    configureServer(server) {
      server.middlewares.use(handleRequest)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleRequest)
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    reniecApi(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
