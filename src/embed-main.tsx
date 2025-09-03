import React from 'react'
import ReactDOM from 'react-dom/client'
import { EmbedApp } from './embed/embed.tsx'
import './index.css'
import './embed/embed.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EmbedApp />
  </React.StrictMode>,
)
