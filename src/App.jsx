// src/App.jsx

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoadingScreen from './components/ui/LoadingScreen.jsx';
import './App.css';

const Hindi = lazy(() => import('./Hindi.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));

function App() {
  // 1. Get 'logout' from the AuthContext
  const { currentUser, loading, logout } = useAuth();
  const [minLoadingDone, setMinLoadingDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingDone(true);
    }, 1200); // Ensures the loading screen shows for at least 1.2s
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const isAppLoading = loading || !minLoadingDone;

  if (isAppLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      <Suspense fallback={<LoadingScreen />}>
        {currentUser ? (
          // 2. Pass handleLogout to the Hindi component
          <Hindi user={currentUser} onLogout={handleLogout} />
        ) : (
          <AuthPage />
        )}
      </Suspense>
    </div>
  );
}

export default App;