import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext' // ✅ Import this
import ErrorBoundary from './components/ui/ErrorBoundary'
import './index.css'
import App from './App.jsx'

// Force unregister any existing service workers during development
// This prevents mobile browsers from caching the app when developing locally
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister();
      console.log('Unregistered stale service worker during development.');
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider> {/* ✅ Wrap App inside AuthProvider */}
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)