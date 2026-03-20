// src/pages/AuthPage.jsx

import React, { useState } from 'react';
import Landing from './Landing';
import Login from './Login';
import Signup from './Signup';

const AuthPage = () => {
  const [view, setView] = useState('landing'); // 'landing', 'login', 'signup'

  // Callbacks
  const switchToSignup = () => setView('signup');
  const switchToLogin = () => setView('login');
  const switchToLanding = () => setView('landing');

  if (view === 'landing') {
    return <Landing onLogin={switchToLogin} onGetStarted={switchToSignup} />;
  } else if (view === 'login') {
    return <Login switchToSignup={switchToSignup} onBack={switchToLanding} />;
  } else {
    return <Signup switchToLogin={switchToLogin} onBack={switchToLanding} />;
  }
};

export default AuthPage;
