import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import './index.css'

// Prevent browser navigation when files are dragged into the window
window.addEventListener('dragover', (event) => event.preventDefault())
window.addEventListener('drop', (event) => event.preventDefault())

ReactDOM.createRoot(
  document.getElementById('root')!,
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
