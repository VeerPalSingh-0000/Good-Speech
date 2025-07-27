import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { motion } from 'framer-motion';
import { auth } from '../../firebase';
import { FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back!</h2>
          <p className="mt-2 text-sm text-slate-400">Sign in to continue your progress.</p>
        </div>

        {error && (
          <motion.p
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
            className="bg-rose-500/20 text-rose-300 text-center p-3 rounded-lg text-sm"
          >
            {error}
          </motion.p>
        )}

        <div className="space-y-4">
            <button onClick={handleGoogleSignIn} disabled={loading || googleLoading} className="w-full flex justify-center items-center gap-3 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors shadow-md disabled:opacity-50">
                {googleLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                    <FaGoogle />
                )}
                Continue with Google
            </button>
        </div>

        <div className="flex items-center justify-center">
            <div className="flex-grow h-px bg-slate-600"></div>
            <span className="mx-4 text-slate-400 text-sm">OR</span>
            <div className="flex-grow h-px bg-slate-600"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
            <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg p-3 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
          </div>
          <div className="relative">
            <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
            <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required placeholder="Password" className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg p-3 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-white">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" disabled={loading || googleLoading} className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-500 disabled:bg-slate-500 transition-colors flex justify-center items-center">
            {loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-center text-slate-400">
          Don't have an account?{' '}
          <button onClick={switchToSignup} className="font-semibold text-indigo-400 hover:text-indigo-300">
            Sign up here
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;