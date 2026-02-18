// src/pages/Signup.jsx - Optimized version

import React, { useState, memo } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import { auth, db } from '../../firebase';

const Signup = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    if (!formData.email.trim()) newErrors.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const displayName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      await updateProfile(user, { displayName });
      await setDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName.trim(), lastName: formData.lastName.trim(),
        email: formData.email, createdAt: new Date(), uid: user.uid, displayName
      });
      await auth.currentUser.reload();
    } catch (error) {
      let errorMessage = 'An error occurred during signup';
      if (error.code === 'auth/email-already-in-use') errorMessage = 'Email already registered.';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (error) => `w-full bg-slate-700/50 border ${error ? 'border-rose-500/50' : 'border-slate-600/50'} text-white rounded-xl p-3 pl-12 focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-slate-500`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Static gradient orbs */}
      <div className="absolute w-80 h-80 bg-gradient-to-br from-emerald-600/40 to-teal-600/40 rounded-full blur-3xl -top-20 -right-20" />
      <div className="absolute w-64 h-64 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 rounded-full blur-3xl top-1/3 -left-20" />
      <div className="absolute w-56 h-56 bg-gradient-to-br from-pink-500/30 to-rose-500/30 rounded-full blur-3xl -bottom-20 right-1/4" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative w-full max-w-md z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-lg" />
        
        <div className="relative p-8 space-y-5 bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10">
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FaUserPlus className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <p className="text-sm text-slate-400">Join SpeechGood to start your journey</p>
            </div>
          </div>

          {errors.submit && (
            <div className="bg-rose-500/20 border border-rose-500/30 text-rose-300 text-center p-3 rounded-xl text-sm">{errors.submit}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                <input name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="First Name" className={inputClass(errors.firstName)} />
              </div>
              <div className="flex-1">
                <input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Last Name" className={`w-full bg-slate-700/50 border ${errors.lastName ? 'border-rose-500/50' : 'border-slate-600/50'} text-white rounded-xl p-3 focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-slate-500`} />
              </div>
            </div>

            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
              <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Email address" className={inputClass(errors.email)} />
            </div>
            
            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
              <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required placeholder="Password (min 6 chars)" className={`${inputClass(errors.password)} pr-12`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-white">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
              <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm Password" className={`${inputClass(errors.confirmPassword)} pr-12`} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-white">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-90 disabled:opacity-50 transition-opacity">
              {loading ? (
                <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-center text-slate-400">
            Already have an account?{' '}
            <button onClick={switchToLogin} className="font-semibold text-emerald-400 hover:text-emerald-300">Sign in here</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default memo(Signup);
