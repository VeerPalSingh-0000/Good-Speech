import React, { useState, useCallback } from 'react';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../lib/firebase';
import { 
  FaGoogle, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaTimes, 
  FaArrowLeft,
  FaUser
} from 'react-icons/fa';

const getFriendlyError = (code) => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/weak-password':
      return 'Password is too weak. Minimum 6 characters required.';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please log in.';
    case 'auth/network-request-failed':
      return 'Connection lost. Please check your internet.';
    default:
      return 'Oops! Something went wrong. Please try again.';
  }
};

const AuthScreen = ({ onBack }) => {
  // step 1: Email + Password entry
  // step 2: Name entry (if account doesn't exist)
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  }, [error]);

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Always attempt to sign in first
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      // Success! User is logged in.
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        // In modern Firebase, invalid-credential means either wrong password OR user doesn't exist.
        // We will move to Step 2 to ask for their name to create an account.
        // If they just typed the wrong password for an existing account, createUser will fail later and we can handle it.
        setStep(2);
      } else {
        setError(getFriendlyError(err.code));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const displayName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;

      await updateProfile(user, { displayName });

      await setDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email,
        createdAt: new Date(),
        uid: user.uid,
        displayName
      });
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        // This means the account DID exist, they just typed the wrong password on Step 1!
        setStep(1);
        setError("This email is already registered. You entered an incorrect password, or you registered with Google.");
      } else {
        setError(getFriendlyError(err.code));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const Loader = () => (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 relative overflow-hidden">
      
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-violet-200 rounded-full mix-blend-multiply filter blur-[120px]" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="p-8 sm:p-10 bg-white/80 backdrop-blur-2xl rounded-[2rem] border border-slate-200/50 shadow-2xl relative">
          
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Close"
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              <FaTimes size={16} />
            </button>
          )}

          {step > 1 && (
            <button
              type="button"
              onClick={() => { setStep(1); setError(''); }}
              className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <FaArrowLeft size={16} />
            </button>
          )}

          <div className="text-center space-y-2 mb-8 pt-4">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {step === 1 ? 'Welcome' : 'Create an account'}
            </h2>
            <p className="text-slate-500 text-sm">
              {step === 1 
                ? 'Log in or create an account to continue' 
                : 'It looks like you are new here! Please enter your name to create an account.'
              }
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <button 
                  type="button"
                  onClick={handleGoogleSignIn} 
                  disabled={loading} 
                  className="w-full flex justify-center items-center gap-3 bg-white text-slate-700 py-3.5 rounded-xl font-medium border border-slate-200 shadow-sm hover:bg-slate-50 disabled:opacity-70 transition-all hover:shadow-md"
                >
                  <FaGoogle className="text-[#DB4437]" />
                  <span>Continue with Google</span>
                </button>

                <div className="flex items-center gap-4">
                  <div className="flex-grow h-px bg-slate-200" />
                  <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Or</span>
                  <div className="flex-grow h-px bg-slate-200" />
                </div>

                <form onSubmit={handleContinue} className="space-y-4">
                  <div className="relative">
                    <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input 
                      name="email" type="email" value={formData.email} onChange={handleChange} required 
                      placeholder="Email address" 
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-3.5 pl-11 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 shadow-sm" 
                    />
                  </div>
                  
                  <div className="relative">
                    <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input 
                      name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required 
                      placeholder="Password" 
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-3.5 pl-11 pr-12 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 shadow-sm" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full py-4 flex items-center justify-center font-semibold text-white rounded-xl bg-slate-900 hover:bg-slate-800 shadow-md shadow-slate-200 disabled:opacity-70 transition-all"
                  >
                    {loading ? <Loader /> : "Continue"}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleCreateAccount} className="space-y-4">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input 
                        name="firstName" value={formData.firstName} onChange={handleChange} required autoFocus
                        placeholder="First Name" 
                        className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-3.5 pl-11 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 shadow-sm" 
                      />
                    </div>
                    <div className="relative flex-1">
                      <FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input 
                        name="lastName" value={formData.lastName} onChange={handleChange} required 
                        placeholder="Last Name" 
                        className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-3.5 pl-11 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 shadow-sm" 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full py-4 mt-6 flex items-center justify-center font-semibold text-white rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 disabled:opacity-70 transition-all"
                  >
                    {loading ? <Loader /> : "Create Account"}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;
