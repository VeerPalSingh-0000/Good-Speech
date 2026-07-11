// src/pages/AuthPage.jsx

import React, { useState } from 'react';
import Landing from './Landing';
import AuthScreen from './AuthScreen';

const AuthPage = () => {
  const [view, setView] = useState('landing'); // 'landing', 'login', 'signup'

  // Callbacks
  const switchToSignup = () => setView('signup');
  const switchToLogin = () => setView('login');
  const switchToLanding = () => setView('landing');

  if (view === 'landing') {
    return <Landing onLogin={switchToLogin} onGetStarted={switchToSignup} />;
  } else {
    return (
      <AuthScreen 
        initialMode={view === 'login' ? 'login' : 'signup'} 
        onBack={switchToLanding} 
      />
    );
  }
};

export default AuthPage;
