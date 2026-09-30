import React, { useContext, useState, useEffect } from 'react';
import { auth, driveAuth } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [driveToken, setDriveToken] = useState(() => localStorage.getItem('driveToken') || null);
  const [driveUserEmail, setDriveUserEmail] = useState(() => localStorage.getItem('driveUserEmail') || null);
  const [driveTokenExpiry, setDriveTokenExpiry] = useState(() => localStorage.getItem('driveTokenExpiry') || null);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  
  function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  async function getGoogleDriveToken(forceSelectAccount = false) {
    if (!forceSelectAccount && driveToken && driveTokenExpiry && Date.now() < parseInt(driveTokenExpiry, 10)) {
      return driveToken;
    }
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    // Only prompt account chooser if explicitly requested
    if (forceSelectAccount) {
      provider.setCustomParameters({
        prompt: 'select_account'
      });
    }
    // Use secondary driveAuth so primary app currentUser (X@gmail.com) is NEVER altered or logged out
    const result = await signInWithPopup(driveAuth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      const token = credential.accessToken;
      const email = result.user?.email;
      const expiry = (Date.now() + 55 * 60 * 1000).toString();

      setDriveToken(token);
      localStorage.setItem('driveToken', token);
      
      setDriveTokenExpiry(expiry);
      localStorage.setItem('driveTokenExpiry', expiry);

      if (email) {
        setDriveUserEmail(email);
        localStorage.setItem('driveUserEmail', email);
      }
      return token;
    }
    throw new Error("Could not obtain Google Drive access token.");
  }

  async function switchGoogleDriveAccount() {
    setDriveToken(null);
    setDriveUserEmail(null);
    setDriveTokenExpiry(null);
    localStorage.removeItem('driveToken');
    localStorage.removeItem('driveUserEmail');
    localStorage.removeItem('driveTokenExpiry');
    return await getGoogleDriveToken(true);
  }

  function logout() {
    setDriveToken(null);
    setDriveUserEmail(null);
    setDriveTokenExpiry(null);
    localStorage.removeItem('driveToken');
    localStorage.removeItem('driveUserEmail');
    localStorage.removeItem('driveTokenExpiry');
    return signOut(auth);
  }

  function updateUserProfile(name) {
    if (auth.currentUser) {
      return updateProfile(auth.currentUser, {
        displayName: name,
      });
    }
    // Return a resolved promise if there's no user to avoid errors
    return Promise.resolve();
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    driveToken,
    driveUserEmail,
    signup,
    login,
    loginWithGoogle,
    getGoogleDriveToken,
    switchGoogleDriveAccount,
    logout,
    updateUserProfile,
    resetPassword
  };

  // Render children only after the initial auth check is complete
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
