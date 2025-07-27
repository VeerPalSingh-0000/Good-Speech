// src/App.jsx

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Hindi from './Hindi.jsx';
import AuthPage from './pages/AuthPage.jsx'; // We will use this to manage login/signup views
import './App.css';

// A beautiful, self-contained loading screen component
const LoadingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex flex-col items-center justify-center text-white gap-4 p-4">
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-purple-400/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-comment text-3xl text-purple-400"></i>
            </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            SpeechGood
        </h1>
        <p className="text-slate-400 animate-pulse">Initializing Your Session...</p>
    </div>
);


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This is the single source of truth for authentication.
  // It runs once when the app loads, and anytime the user's login state changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The onAuthStateChanged listener will handle setting the user to null
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show the loading screen while Firebase checks for a user
  if (loading) {
    return <LoadingScreen />;
  }

  // Once loaded, show the main app if a user exists, otherwise show the AuthPage
  return (
    <div className="App">
      {user ? <Hindi user={user} onLogout={handleLogout} /> : <AuthPage />}
    </div>
  );
}

export default App;
