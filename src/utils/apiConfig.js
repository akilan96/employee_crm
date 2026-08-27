// Centralized Backend API URL configuration
// In Render.com deployment: set VITE_BACKEND_URL in Vercel / .env (e.g. https://shaktidb-whatsapp.onrender.com)
// In Local development: defaults to '' (proxies to localhost:3001)

export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

export const API_ENDPOINTS = {
  status: `${BACKEND_URL}/api/whatsapp-status`,
  sendPass: `${BACKEND_URL}/api/send-whatsapp-pass`
};
