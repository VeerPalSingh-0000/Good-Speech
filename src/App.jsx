// src/App.jsx

import React, { Suspense, lazy } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoadingScreen from './components/ui/LoadingScreen.jsx';
import './App.css';

const Hindi = lazy(() => import('./Hindi.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));

function App() {
  // 1. Get 'logout' from the AuthContext
  const { currentUser, loading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (loading) {
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