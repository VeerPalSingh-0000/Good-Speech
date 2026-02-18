// src/pages/Login.jsx - Optimized version

import React, { useState, memo } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { motion } from 'framer-motion';
import { auth } from '../../firebase';
import { FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaComment } from 'react-icons/fa';

const Login = ({ switchToSignup }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
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
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Static gradient orbs - no animation */}
      <div className="absolute w-80 h-80 bg-gradient-to-br from-purple-600/40 to-indigo-600/40 rounded-full blur-3xl -top-20 -left-20" />
      <div className="absolute w-64 h-64 bg-gradient-to-br from-pink-500/30 to-rose-500/30 rounded-full blur-3xl top-1/4 -right-20" />
      <div className="absolute w-56 h-56 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl -bottom-20 left-1/4" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-cyan-500/30 rounded-3xl blur-lg" />
        
        <div className="relative p-8 space-y-6 bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10">
          {/* Logo and title */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaComment className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
              <p className="text-sm text-slate-400">Sign in to continue your speech journey</p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-rose-500/20 border border-rose-500/30 text-rose-300 text-center p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button 
            onClick={handleGoogleSignIn} 
            disabled={loading || googleLoading} 
            className="w-full flex justify-center items-center gap-3 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors border border-white/10 disabled:opacity-50"
          >
            {googleLoading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : <FaGoogle />}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-grow h-px bg-slate-600" />
            <span className="text-slate-400 text-sm">OR</span>
            <div className="flex-grow h-px bg-slate-600" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
              <input 
                name="email" type="email" value={formData.email} onChange={handleChange} required 
                placeholder="Email address" 
                className="w-full bg-slate-700/50 border border-slate-600/50 text-white rounded-xl p-3 pl-12 focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-slate-500" 
              />
            </div>
            
            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
              <input 
                name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required 
                placeholder="Password" 
                className="w-full bg-slate-700/50 border border-slate-600/50 text-white rounded-xl p-3 pl-12 pr-12 focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-slate-500" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-white">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            <button 
              type="submit" disabled={loading || googleLoading} 
              className="w-full py-3 font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-center text-slate-400">
            Don't have an account?{' '}
            <button onClick={switchToSignup} className="font-semibold text-purple-400 hover:text-purple-300">
              Sign up here
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default memo(Login);