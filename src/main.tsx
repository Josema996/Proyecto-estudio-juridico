import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Oculta el splash una vez que React montó
requestAnimationFrame(() => {
  setTimeout(() => {
    (window as Window & { __hideSplash?: () => void }).__hideSplash?.()
  }, 800)
})
