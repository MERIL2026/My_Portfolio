import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import App from './App.tsx';
import { Admin } from './pages/Admin.tsx';
import './index.css';

const path = window.location.pathname;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      {path.startsWith('/admin') ? <Admin /> : <App />}
      <Analytics />
      <SpeedInsights />
    </HelmetProvider>
  </StrictMode>,
);
