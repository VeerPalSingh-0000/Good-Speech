import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaCog, FaTrophy, FaFire, FaChartLine, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProfileView = ({ user, records, onLogout }) => {
  const { resetPassword, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || 'Speech Learner');
  const [isEditing, setIsEditing] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Derive stats
  const allRecords = [
    ...(records?.sounds || []),
    ...(records?.varnmala || []),
    ...(records?.stories || [])
  ];
  
  const totalSessions = allRecords.length;
  const totalMinutes = Math.round(allRecords.reduce((sum, r) => sum + (r.time || 0), 0) / 600); // 10 deciseconds = 1s, /600 = min

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile(displayName);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return toast.error("No email associated with this account.");
    try {
      await resetPassword(user.email);
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (err) {
      toast.error(err.message || "Failed to send reset email.");
    }
  };

  const handlePushToggle = async () => {
    if (!("Notification" in window)) {
        return toast.error("Your browser does not support notifications.");
    }

    if (pushEnabled) {
        toast("To disable notifications, please change your browser site settings.", { icon: "⚙️" });
        return;
    }
    
    try {
      const permission = await window.Notification.requestPermission();
      if (permission === 'granted') {
          setPushEnabled(true);
          new window.Notification("SpeechGood", { body: "Push notifications successfully enabled! We'll gently remind you to practice." });
          toast.success("Push notifications activated!");
      } else {
          toast.error("Permission denied. You can enable it in your browser settings.");
      }
    } catch (e) {
      toast.error("Unable to request permission.");
    }
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="p-4 text-4xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent flex justify-center items-center gap-3">
          <FaUserCircle className="text-purple-500" />
          My Profile
        </h2>
        <p className="text-slate-500 mt-2">Manage your account, settings, and track overall progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-purple-500 to-indigo-600 opacity-20 dark:opacity-40"></div>
            
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg relative z-10 text-4xl text-white font-bold mb-4 border-4 border-white dark:border-slate-800">
              {displayName.charAt(0).toUpperCase()}
            </div>

            {isEditing ? (
              <div className="w-full space-y-3 relative z-10">
                <input 
                  type="text" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 text-center"
                />
                <button 
                  onClick={handleSaveProfile}
                  className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors"
                >
                  Save Profile
                </button>
              </div>
            ) : (
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{displayName}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{user?.email || 'user@example.com'}</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-sm transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </motion.div>

          {/* Account Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
               <FaCog className="text-slate-400" /> Account Settings
            </h4>
            <div className="space-y-3">
              <button onClick={handlePasswordReset} className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex justify-between items-center">
                <span>Change Password</span>
                <FaShieldAlt className="text-slate-400" />
              </button>
              <button disabled className="w-full text-left px-4 py-3 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition opacity-50 cursor-not-allowed">
                Delete Account
              </button>
              <button 
                onClick={onLogout}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 font-bold transition"
              >
                <FaSignOutAlt /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Preferences */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
               <FaChartLine className="text-indigo-500" /> Lifetime Overview
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/50">
                <FaTrophy className="text-4xl text-indigo-400 mb-4" />
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Total Sessions</p>
                <p className="text-4xl font-bold text-slate-800 dark:text-white mt-1">{totalSessions}</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/50">
                <FaFire className="text-4xl text-orange-400 mb-4" />
                <p className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Minutes Practiced</p>
                <p className="text-4xl font-bold text-slate-800 dark:text-white mt-1">{totalMinutes}m</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
               <FaCog className="text-slate-500" /> Practice Preferences
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Daily Practice Goal (Minutes)</label>
                <input type="range" min="5" max="60" step="5" defaultValue="15" className="w-full accent-purple-500" />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>5 min</span>
                  <span>15 min</span>
                  <span>60 min</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">Push Notifications</h4>
                  <p className="text-xs text-slate-500">Get daily reminders to practice</p>
                </div>
                <button 
                  onClick={handlePushToggle}
                  className={`w-12 h-6 rounded-full relative transition-colors ${pushEnabled ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${pushEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileView;
