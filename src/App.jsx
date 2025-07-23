import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Hindi from './pages/Hindi.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setCurrentPage('hindi');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    setCurrentPage('hindi');
  };

  const handleSignup = (user) => {
    setUser(user);
    setCurrentPage('hindi');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCurrentPage('login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Enhanced Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-md mx-auto">
          {/* Main Loading Animation */}
          <div className="relative mx-auto w-32 h-32">
            {/* Outer ring */}
            <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-blue-100 dark:border-gray-700"></div>
            
            {/* Spinning ring */}
            <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
            
            {/* Inner ring */}
            <div className="absolute inset-2 w-28 h-28 rounded-full border-2 border-purple-100 dark:border-gray-600"></div>
            
            {/* Center circle with icon */}
            <div className="absolute inset-6 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Brand and Loading Text */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                SpeechGood
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                Enhancing Your Communication Skills
              </p>
            </div>
            
            {/* Loading Dots */}
            <div className="flex justify-center items-center space-x-2">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Loading</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication screens if not logged in
  if (!user) {
    return (
      <div className="App">
        {currentPage === 'login' && (
          <Login 
            onLogin={handleLogin}
            switchToSignup={() => setCurrentPage('signup')}
          />
        )}
        {currentPage === 'signup' && (
          <Signup 
            onSignup={handleSignup}
            switchToLogin={() => setCurrentPage('login')}
          />
        )}
      </div>
    );
  }

  // Show main application if logged in
  return (
    <div className="App">
      <Hindi user={user} onLogout={handleLogout} />
    </div>
  );
}

export default App;
