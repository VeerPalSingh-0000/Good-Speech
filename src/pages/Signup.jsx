import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { auth, db } from '../../firebase'; // Adjust path as needed

// The onSignup prop is no longer needed
const Signup = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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

      // 1. Update the profile in Firebase Auth
      await updateProfile(user, { displayName });

      // 2. Save additional details to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email,
        createdAt: new Date(),
        uid: user.uid,
        displayName: displayName
      });

      // 3. THE FIX: Force a reload of the user object.
      // This will trigger the onAuthStateChanged listener in App.jsx
      // with the new displayName, making it the single source of truth.
      await auth.currentUser.reload();
      
      // The onAuthStateChanged listener will now handle navigation automatically.
      
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'An error occurred during signup';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in.';
      }
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
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
          <h2 className="text-3xl font-bold text-white">Create Your Account</h2>
          <p className="mt-2 text-sm text-slate-400">Join SpeechGood to start your journey.</p>
        </div>

        {errors.submit && (
          <motion.p
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
            className="bg-rose-500/20 text-rose-300 text-center p-3 rounded-lg text-sm"
          >
            {errors.submit}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full">
              <FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
              <input name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="First Name" className={`w-full bg-slate-700/50 border ${errors.firstName ? 'border-rose-500' : 'border-slate-600'} text-white rounded-lg p-3 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`} />
            </div>
            <div className="relative w-full">
              <input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Last Name" className={`w-full bg-slate-700/50 border ${errors.lastName ? 'border-rose-500' : 'border-slate-600'} text-white rounded-lg p-3 pl-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`} />
            </div>
          </div>
          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
            <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Email" className={`w-full bg-slate-700/50 border ${errors.email ? 'border-rose-500' : 'border-slate-600'} text-white rounded-lg p-3 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`} />
          </div>
          <div className="relative">
            <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
            <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required placeholder="Password" className={`w-full bg-slate-700/50 border ${errors.password ? 'border-rose-500' : 'border-slate-600'} text-white rounded-lg p-3 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-white">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
          </div>
           <div className="relative">
            <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
            <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm Password" className={`w-full bg-slate-700/50 border ${errors.confirmPassword ? 'border-rose-500' : 'border-slate-600'} text-white rounded-lg p-3 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-white">{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</button>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-500 disabled:bg-slate-500 transition-colors flex justify-center items-center">
            {loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-center text-slate-400">
          Already have an account?{' '}
          <button onClick={switchToLogin} className="font-semibold text-indigo-400 hover:text-indigo-300">
            Sign in here
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
