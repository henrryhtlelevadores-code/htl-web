import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The elevator scene is a lazy chunk, so the browser would only discover it after the main bundle
// runs. This adds a modulepreload for it to the built index.html, so it downloads from the start.
const preloadScene = () => ({
  name: 'preload-elevator-scene',
  apply: 'build',
  transformIndexHtml(html, ctx) {
    const chunks = Object.values(ctx.bundle ?? {}).filter(
      (c) => c.type === 'chunk' && c.name === 'ElevatorScene',
    )
    return chunks.map((c) => ({
      tag: 'link',
      attrs: { rel: 'modulepreload', crossorigin: true, href: `/${c.fileName}` },
      injectTo: 'head',
    }))
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    preloadScene(),
  ],
})
