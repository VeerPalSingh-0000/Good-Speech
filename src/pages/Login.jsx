import React, { useState, memo, useCallback } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../lib/firebase';
import { FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTimes, FaGamepad, FaStar, FaMagic } from 'react-icons/fa';

// Helper to turn cryptic Firebase codes into friendly messages
const getFriendlyError = (code) => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Incorrect email or password. Give it another shot!';
    case 'auth/too-many-requests':
      return 'Too many attempts. Take a breather and try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    default:
      return 'Oops! Something went wrong. Please try again.';
  }
};

const Login = ({ switchToSignup, onBack }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError("Google sign-in failed. Try again?");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const Loader = () => (
    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-violet-700 font-sans selection:bg-amber-400 selection:text-violet-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[10%] text-6xl text-amber-400"
        ><FaStar /></motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[10%] text-7xl text-fuchsia-400"
        ><FaMagic /></motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="p-8 sm:p-10 bg-white rounded-[3rem] border-8 border-violet-900 shadow-[12px_12px_0px_rgba(0,0,0,0.3)]">
          
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Close"
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-violet-900 border-4 border-violet-900 hover:bg-amber-400 transition-all hover:scale-110 active:scale-90"
            >
              <FaTimes size={16} />
            </button>
          )}

          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
              className="mx-auto w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center border-4 border-violet-900 shadow-[4px_4px_0px_#4c1d95]"
            >
              <FaGamepad className="text-3xl text-violet-900" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-black text-violet-900 tracking-tight">Welcome back!</h2>
              <p className="text-lg font-bold text-violet-500">Log in to your adventure</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-rose-50 border-4 border-rose-400 text-rose-600 text-center p-3 rounded-2xl font-black text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Sign In */}
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98, y: 2 }}
            onClick={handleGoogleSignIn} 
            disabled={loading || googleLoading} 
            className="w-full flex justify-center items-center gap-3 bg-white text-violet-900 py-4 rounded-2xl font-black text-lg transition-all border-4 border-violet-900 shadow-[6px_6px_0px_#4c1d95] hover:bg-slate-50 disabled:opacity-50"
          >
            {googleLoading ? <Loader /> : <FaGoogle className="text-rose-500" />}
            <span>Google</span>
          </motion.button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-grow h-1 bg-violet-100 rounded-full" />
            <span className="text-violet-400 text-xs font-black uppercase">Or email</span>
            <div className="flex-grow h-1 bg-violet-100 rounded-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-violet-300 pointer-events-none" />
              <input 
                name="email" type="email" value={formData.email} onChange={handleChange} required 
                placeholder="Email address" 
                aria-label="Email Address"
                className="w-full bg-slate-50 border-4 border-violet-100 text-violet-900 rounded-2xl p-4 pl-12 focus:outline-none focus:border-fuchsia-400 transition-colors placeholder:text-violet-200 font-bold" 
              />
            </div>
            
            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-violet-300 pointer-events-none" />
              <input 
                name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required 
                placeholder="Password" 
                aria-label="Password"
                className="w-full bg-slate-50 border-4 border-violet-100 text-violet-900 rounded-2xl p-4 pl-12 pr-12 focus:outline-none focus:border-fuchsia-400 transition-colors placeholder:text-violet-200 font-bold" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute top-1/2 right-4 -translate-y-1/2 text-violet-300 hover:text-fuchsia-500 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98, y: 4 }}
              type="submit" 
              disabled={loading || googleLoading} 
              className="w-full py-5 mt-4 flex items-center justify-center font-black text-2xl text-white rounded-2xl bg-fuchsia-500 border-4 border-violet-900 shadow-[8px_8px_0px_#4c1d95] hover:bg-fuchsia-600 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader /> : "Let's Go!"}
            </motion.button>
          </form>

          <p className="text-lg font-bold text-center text-violet-400 mt-8">
            New here?{' '}
            <button onClick={switchToSignup} className="font-black text-fuchsia-500 hover:text-fuchsia-600 transition-colors underline decoration-2 underline-offset-4">
              Join the Fun!
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default memo(Login);