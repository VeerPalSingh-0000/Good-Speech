// src/App.jsx

import React from 'react';
import { useAuth } from './contexts/AuthContext';
import Hindi from './Hindi.jsx';
import AuthPage from './pages/AuthPage.jsx';
import LoadingScreen from './components/ui/LoadingScreen.jsx';
import './App.css';

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
      {currentUser ? (
        // 2. Pass handleLogout to the Hindi component
        <Hindi user={currentUser} onLogout={handleLogout} />
      ) : (
        <AuthPage />
      )}
    </div>
  );
}

export default App;