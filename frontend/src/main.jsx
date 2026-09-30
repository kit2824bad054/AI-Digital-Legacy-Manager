/**
 * ============================================================
 * AI DIGITAL LEGACY MANAGER - FRONTEND ENTRY POINT (main.jsx)
 * ============================================================
 * Mounts the React 18 application tree to the DOM element (#root)
 * Loads the global Tailwind CSS stylesheet and design tokens.
 * ============================================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
