import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { apiPlugin } from './vite-plugins/api-plugin.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env into process.env so server-side handlers (api/*) can read
  // GOOGLE_GENERATIVE_AI_API_KEY during `npm run dev`. We only copy keys that
  // are NOT VITE_-prefixed — those are handled separately by Vite and would
  // otherwise leak into the client bundle.
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (!key.startsWith('VITE_') && process.env[key] === undefined) {
      process.env[key] = value
    }
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      apiPlugin({
        '/api/chat': '/api/chat.js',
      }),
    ],
  }
})
