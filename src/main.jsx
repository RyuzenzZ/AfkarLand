import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SiteSettingsProvider } from './hooks/useSiteSettings';
import App from './App';
import './index.css';

// LOGIKA: Entry point aplikasi. Membungkus App dengan Router dan Context secara global
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SiteSettingsProvider>
        <App />
      </SiteSettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
