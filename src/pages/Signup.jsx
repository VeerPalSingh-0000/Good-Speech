import React, { useState, memo, useCallback } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTimes, FaRocket, FaStar, FaMagic } from 'react-icons/fa';
import { auth, db } from '../lib/firebase';

// Friendly error helper
const getFriendlyError = (code) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'That email is already on the team! Try logging in?';
    case 'auth/invalid-email':
      return 'That email looks a bit funky. Double check it!';
    case 'auth/weak-password':
      return 'Password is too weak. Let’s make it tougher!';
    case 'auth/network-request-failed':
      return 'Connection lost. Check your internet!';
    default:
      return 'Oops! Something went wrong. Try again?';
  }
};

const Signup = ({ switchToLogin, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (errors.submit) setErrors(prev => ({ ...prev, submit: '' }));
  }, [errors]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    if (formData.password.length < 6) newErrors.password = 'Min 6 chars';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords must match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const displayName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;

      // Update Auth Profile
      await updateProfile(user, { displayName });

      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email,
        createdAt: new Date(),
        uid: user.uid,
        displayName
      });

    } catch (error) {
      setErrors({ submit: getFriendlyError(error.code) });
    } finally {
      setLoading(false);
    }
  };

  const Loader = () => (
    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  const inputClass = (error) => `w-full bg-slate-50 border-4 ${error ? 'border-rose-400 focus:border-rose-500' : 'border-violet-100 focus:border-fuchsia-400'
    } text-violet-900 rounded-2xl p-4 focus:outline-none transition-all placeholder:text-violet-200 font-bold min-w-0`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-violet-700 font-sans selection:bg-amber-400 selection:text-violet-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[10%] text-6xl text-amber-400"
        ><FaStar /></motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] left-[10%] text-7xl text-cyan-400"
        ><FaMagic /></motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10 my-8"
      >
        <div className="p-8 sm:p-10 bg-white rounded-[3rem] border-8 border-violet-900 shadow-[12px_12px_0px_rgba(0,0,0,0.3)]">

          {onBack && (
            <button
              onClick={onBack}
              aria-label="Go back"
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-violet-900 border-4 border-violet-900 hover:bg-amber-400 transition-all hover:scale-110 active:scale-90"
            >
              <FaTimes size={16} />
            </button>
          )}

          <div className="text-center space-y-4 mb-8">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              className="mx-auto w-16 h-16 bg-fuchsia-500 rounded-2xl flex items-center justify-center border-4 border-violet-900 shadow-[4px_4px_0px_#4c1d95]"
            >
              <FaRocket className="text-3xl text-white" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-black text-violet-900 tracking-tight">Create Account</h2>
              <p className="text-lg font-bold text-violet-500">Join the SpeechGood team!</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-rose-50 border-4 border-rose-400 text-rose-600 text-center p-3 rounded-2xl font-black text-sm"
              >
                {errors.submit}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <FaUser className={`absolute top-5 left-4 transition-colors pointer-events-none ${errors.firstName ? 'text-rose-400' : 'text-violet-300'}`} />
                <input name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="First" className={`${inputClass(errors.firstName)} pl-11`} />
              </div>
              <div className="relative flex-1">
                <FaUser className={`absolute top-5 left-4 transition-colors pointer-events-none ${errors.lastName ? 'text-rose-400' : 'text-violet-300'}`} />
                <input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Last" className={`${inputClass(errors.lastName)} pl-11`} />
              </div>
            </div>

            <div className="relative">
              <FaEnvelope className={`absolute top-5 left-4 transition-colors pointer-events-none ${errors.email ? 'text-rose-400' : 'text-violet-300'}`} />
              <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Email address" className={`${inputClass(errors.email)} pl-11`} />
              {errors.email && <p className="text-rose-500 text-xs font-black mt-1 ml-2">{errors.email}</p>}
            </div>

            <div className="relative">
              <FaLock className={`absolute top-5 left-4 transition-colors pointer-events-none ${errors.password ? 'text-rose-400' : 'text-violet-300'}`} />
              <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required placeholder="Password (6+ chars)" className={`${inputClass(errors.password)} pl-11 pr-12`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-5 right-4 text-violet-300 hover:text-fuchsia-500 focus:outline-none">
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
              {errors.password && <p className="text-rose-500 text-xs font-black mt-1 ml-2">{errors.password}</p>}
            </div>

            <div className="relative">
              <FaLock className={`absolute top-5 left-4 transition-colors pointer-events-none ${errors.confirmPassword ? 'text-rose-400' : 'text-violet-300'}`} />
              <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} required placeholder="Verify Password" className={`${inputClass(errors.confirmPassword)} pl-11 pr-12`} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-5 right-4 text-violet-300 hover:text-fuchsia-500 focus:outline-none">
                {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
              {errors.confirmPassword && <p className="text-rose-500 text-xs font-black mt-1 ml-2">{errors.confirmPassword}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98, y: 4 }}
              type="submit"
              disabled={loading}
              className="w-full py-5 mt-4 flex items-center justify-center font-black text-2xl text-violet-900 rounded-2xl bg-amber-400 border-4 border-violet-900 shadow-[8px_8px_0px_#4c1d95] hover:bg-yellow-400 transition-all disabled:opacity-50"
            >
              {loading ? <Loader /> : 'Create!'}
            </motion.button>
          </form>

          <p className="text-lg font-bold text-center text-violet-400 mt-8">
            Got an account?{' '}
            <button onClick={switchToLogin} className="font-black text-fuchsia-500 hover:text-fuchsia-600 transition-colors underline decoration-2 underline-offset-4">
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default memo(Signup);