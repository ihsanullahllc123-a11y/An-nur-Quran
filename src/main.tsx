import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered');
      
      // Handle Push Notifications
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }

      // Handle Background Sync
      if ('sync' in registration) {
        // @ts-ignore - sync is a experimental feature
        registration.sync.register('sync-app-data').catch(err => {
          console.log('Sync registration failed', err);
        });
      }
    }).catch(err => {
      console.log('SW registration failed: ', err);
    });
  });
}
