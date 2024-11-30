import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Console log override only in development mode
if (process.env.NODE_ENV === 'development') {
  (function () {
    const originalLog = console.log;
    console.log = function (...args) {
      originalLog.apply(console, args); // Keep default behavior
      fetch('/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs: args }),
      }).catch((err) => originalLog('Failed to send logs:', err));
    };
  })();
}

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceworker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
