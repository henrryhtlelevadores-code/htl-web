import { StrictMode } from 'react'
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
