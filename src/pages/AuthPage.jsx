// src/pages/AuthPage.jsx

import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  // These functions will be passed to the Login and Signup components
  const switchToSignup = () => setIsLoginView(false);
  const switchToLogin = () => setIsLoginView(true);

  if (isLoginView) {
    return <Login switchToSignup={switchToSignup} />;
  } else {
    return <Signup switchToLogin={switchToLogin} />;
  }
};

export default AuthPage;
