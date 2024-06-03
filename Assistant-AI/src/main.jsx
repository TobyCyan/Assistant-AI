import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TokenProvider } from '../TokenContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <TokenProvider>
    <App />
  </TokenProvider>
  </React.StrictMode>,
)
