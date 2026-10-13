import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { NOT_FOUND, PAGES, SITE_URL } from './src/data/seo.js'

// What the built page needs so that the welcome panel in index.html paints with the first byte:
// - the site's stylesheet loads without blocking it (fetched at once, applied when it arrives;
//   src/main.jsx waits for it before drawing the app);
// - the 3D scene's chunk is not preloaded with the page. Its address is left in a meta tag, and
//   the hero fetches it in the background once the app is running.
const criticalHead = () => ({
  name: 'critical-head',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler(html, ctx) {
      const sheet = /<link rel="stylesheet"( crossorigin)? href="([^"]+)">/
      if (!sheet.test(html)) throw new Error('critical-head: no stylesheet link in the built index.html')
      html = html.replace(sheet, (_, cors = '', href) =>
        `<link rel="preload" as="style"${cors} href="${href}">\n  <link rel="stylesheet"${cors} href="${href}" media="print" data-app-css onload="this.media='all'">`)
      const scene = Object.values(ctx.bundle ?? {}).find((c) => c.type === 'chunk' && c.name === 'ElevatorScene')
      if (!scene) throw new Error('critical-head: no ElevatorScene chunk in the bundle')
      return {
        html,
        tags: [{ tag: 'meta', attrs: { name: 'scene-chunk', content: `/${scene.fileName}` }, injectTo: 'head' }],
      }
    },
  },
})

const attr = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// The built index.html with another page's title, description, address and share tags.
const withMeta = (html, { title, description, url, noindex }) => {
  const swap = (pattern, value) => {
    if (!pattern.test(html)) throw new Error(`page-files: index.html has no ${pattern}`)
    html = html.replace(pattern, (_, before, after) => before + value + after)
  }
  swap(/(<title>)[^<]*(<\/title>)/, attr(title))
  for (const tag of ['name="description"', 'property="og:title"', 'property="og:description"', 'name="twitter:title"', 'name="twitter:description"']) {
    const value = tag.includes('title') ? title : description
    swap(new RegExp(`(<meta ${tag}\\s+content=")[^"]*(")`), attr(value))
  }
  if (noindex) {
    // An address that does not exist has no canonical or share address of its own.
    html = html.replace(/\s*<link rel="canonical"[^>]*>/, '').replace(/\s*<meta property="og:url"[^>]*>/, '')
    html = html.replace('</title>', '</title>\n  <meta name="robots" content="noindex" />')
  } else {
    swap(/(<link rel="canonical" href=")[^"]*(")/, attr(url))
    swap(/(<meta property="og:url" content=")[^"]*(")/, attr(url))
  }
  return html
}

// One HTML file per page, each with its own head, so link previews (WhatsApp, Facebook,
// LinkedIn, X) and any crawler that does not run JavaScript read the right title, description
// and address. vercel.json serves `<path>.html` at `<path>`. The body is still the app.
// 404.html is what the host answers, with a real 404 status, for any address it does not have.
const pageFiles = () => {
  let outDir = 'dist'
  return {
    name: 'page-files',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      // Only the home page opens on the welcome panel: elsewhere it is served already hidden.
      const shell = readFileSync(resolve(outDir, 'index.html'), 'utf8').replace('<div id="intro" ', '<div id="intro" hidden ')
      for (const page of Object.values(PAGES)) {
        if (page.path === '/') continue
        writeFileSync(resolve(outDir, `${page.path.slice(1)}.html`), withMeta(shell, { ...page, url: SITE_URL + page.path }))
      }
      writeFileSync(resolve(outDir, '404.html'), withMeta(shell, { ...NOT_FOUND, noindex: true }))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    criticalHead(),
    pageFiles(),
  ],
})
