import { StrictMode, startTransition } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/montserrat'
import './index.css'
import App from './App.jsx'
import { initTracking } from './lib/analytics'

initTracking()

// The site no longer stores anything on the device. Earlier versions saved the theme choice;
// this removes it for returning visitors.
try {
  localStorage.removeItem('theme')
} catch {
  // Storage blocked: there is nothing to clear.
}

// The built page loads the stylesheet without blocking the welcome panel (see criticalHead in
// vite.config.js), so it can still be on its way when this runs. The app is drawn once it is in:
// everything that measures the layout on mount keeps finding the page already styled.
const sheet = document.querySelector('link[data-app-css]')
const stylesReady = !sheet || sheet.sheet
  ? Promise.resolve()
  : new Promise((resolve) => {
      sheet.addEventListener('load', resolve, { once: true })
      sheet.addEventListener('error', resolve, { once: true })
      setTimeout(resolve, 5000)
    })

stylesReady.then(() => {
  if (sheet) sheet.media = 'all'
  // Drawn as a transition, so React builds the page in short slices and the welcome panel
  // already on screen keeps answering while it does.
  const root = createRoot(document.getElementById('root'))
  startTransition(() => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
})
