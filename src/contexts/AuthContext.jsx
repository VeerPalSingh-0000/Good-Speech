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
  const [driveToken, setDriveToken] = useState(null);
  const [driveUserEmail, setDriveUserEmail] = useState(null);

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
    if (driveToken && !forceSelectAccount) {
      return driveToken;
    }
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    // Prompt account chooser for Google Drive
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    // Use secondary driveAuth so primary app currentUser (X@gmail.com) is NEVER altered or logged out
    const result = await signInWithPopup(driveAuth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      setDriveToken(credential.accessToken);
      if (result.user?.email) {
        setDriveUserEmail(result.user.email);
      }
      return credential.accessToken;
    }
    throw new Error("Could not obtain Google Drive access token.");
  }

  async function switchGoogleDriveAccount() {
    setDriveToken(null);
    setDriveUserEmail(null);
    return await getGoogleDriveToken(true);
  }

  function logout() {
    setDriveToken(null);
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
