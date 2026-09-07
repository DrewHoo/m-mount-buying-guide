import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// hydrateRoot, not createRoot: scripts/prerender.mjs bakes the rendered app
// into dist/index.html and createRoot would throw that markup away.
hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
