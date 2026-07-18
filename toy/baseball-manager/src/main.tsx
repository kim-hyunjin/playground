globalThis.__PLAYERS_CSV__ = __PLAYERS_CSV_TEXT__

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { applyTheme, initialTheme } from './components/ThemeToggle'

applyTheme(initialTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
