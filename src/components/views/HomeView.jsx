// src/components/views/HomeView.jsx - Optimized version

import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import StatCard from '../StatCard';
import { formatTime } from '../../utilities/helpers';
import { FaPlayCircle, FaHistory, FaBullseye, FaStar, FaRocket } from 'react-icons/fa';

// Get time-based greeting - computed once
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", emoji: "🌅", hindi: "सुप्रभात" };
  if (hour < 17) return { text: "Good Afternoon", emoji: "☀️", hindi: "नमस्ते" };
  if (hour < 21) return { text: "Good Evening", emoji: "🌆", hindi: "शुभ संध्या" };
  return { text: "Good Night", emoji: "🌙", hindi: "शुभ रात्रि" };
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
};

// Memoized CTA Card component
const CTACard = memo(({ onClick, gradient, icon: Icon, title, subtitle, hint }) => (
  <motion.div 
    onClick={onClick}
    className={`group relative p-8 rounded-3xl text-center cursor-pointer overflow-hidden ${gradient ? 'text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
  >
    {gradient && <div className={`absolute inset-0 ${gradient}`} />}
    <div className={`absolute -inset-2 ${gradient || 'bg-slate-200 dark:bg-slate-700'} rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
    
    <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
      <div className={`p-4 ${gradient ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'} rounded-2xl group-hover:scale-105 transition-transform duration-200`}>
        <Icon className={`text-4xl ${gradient ? '' : 'text-slate-600 dark:text-slate-300'}`} />
      </div>
      <h3 className={`text-2xl font-bold ${gradient ? '' : 'text-slate-800 dark:text-white'}`}>{title}</h3>
      <p className={`text-base ${gradient ? 'opacity-90' : 'text-slate-500 dark:text-slate-400'}`}>{subtitle}</p>
      <span className={`text-sm font-medium ${gradient ? 'opacity-80' : 'text-slate-400'}`}>{hint} →</span>
    </div>
  </motion.div>
));

CTACard.displayName = 'CTACard';

const HomeView = ({ user, records, setCurrentView }) => {
  const greeting = useMemo(() => getGreeting(), []);
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  
  const stats = useMemo(() => {
    if (!records) return { totalSessions: 0, totalTime: "00:00.00", bestSound: "00.00", streak: 0 };
    
    const allRecords = [...(records.sounds || []), ...(records.varnmala || []), ...(records.stories || [])];
    if (allRecords.length === 0) {
      return { totalSessions: 0, totalTime: "00:00.00", bestSound: "00.00", streak: 0 };
    }

    const totalSessions = allRecords.length;
    const totalTime = allRecords.reduce((sum, r) => sum + (r.time || 0), 0);
    const bestSound = records.sounds?.length > 0 ? Math.max(...records.sounds.map(r => r.time || 0)) : 0;
    
    const practiceDates = [...new Set(allRecords.map(r => 
        new Date(r.timestamp?.seconds ? r.timestamp.seconds * 1000 : r.timestamp).toDateString()
    ))];
    
    let streak = 0;
    if (practiceDates.length > 0) {
        const sortedDates = practiceDates.map(d => new Date(d)).sort((a, b) => b - a);
        const today = new Date();
        today.setHours(0,0,0,0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (sortedDates[0].getTime() === today.getTime() || sortedDates[0].getTime() === yesterday.getTime()) {
            streak = 1;
            for (let i = 1; i < sortedDates.length; i++) {
                const dayBefore = new Date(sortedDates[i-1]);
                dayBefore.setDate(dayBefore.getDate() - 1);
                if (dayBefore.toDateString() === sortedDates[i].toDateString()) {
                    streak++;
                } else break;
            }
        }
    }

    return { totalSessions, totalTime: formatTime(totalTime), bestSound: formatTime(bestSound), streak };
  }, [records]);

  const { dailyGoal, sessionsToday, goalProgress, isGoalComplete } = useMemo(() => {
    const goal = 11;
    const todayString = new Date().toDateString();
    const sessions = [...(records?.sounds || []), ...(records?.varnmala || []), ...(records?.stories || [])]
      .filter(r => new Date(r.timestamp?.seconds ? r.timestamp.seconds * 1000 : r.timestamp).toDateString() === todayString).length;
    const progress = Math.min((sessions / goal) * 100, 100);
    return { dailyGoal: goal, sessionsToday: sessions, goalProgress: progress, isGoalComplete: progress >= 100 };
  }, [records]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
              <span className="text-3xl">{greeting.emoji}</span>
              <span className="text-sm font-medium opacity-90">{greeting.hindi}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {greeting.text}, <span className="text-yellow-200">{firstName}!</span>
            </h1>
            <p className="text-base opacity-90">आज अपनी स्पीच थेरेपी यात्रा जारी रखें! 🚀</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white text-center border border-white/30">
            <div className="text-4xl font-bold">{stats.streak}</div>
            <div className="text-xs opacity-90">दिन स्ट्रीक 🔥</div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}><StatCard title="कुल सत्र" value={stats.totalSessions} icon="fas fa-calendar-check" color="from-blue-500 to-cyan-500" /></motion.div>
        <motion.div variants={itemVariants}><StatCard title="कुल समय" value={stats.totalTime} icon="fas fa-clock" color="from-green-500 to-emerald-500" /></motion.div>
        <motion.div variants={itemVariants}><StatCard title="सर्वश्रेष्ठ स्वर" value={stats.bestSound} icon="fas fa-trophy" color="from-purple-500 to-pink-500" /></motion.div>
        <motion.div variants={itemVariants}><StatCard title="डेली स्ट्रीक" value={`${stats.streak} दिन`} icon="fas fa-fire" color="from-orange-500 to-red-500" /></motion.div>
      </motion.div>

      {/* Goal Section */}
      <motion.div variants={itemVariants} className={`p-6 rounded-3xl shadow-lg border ${isGoalComplete ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-700' : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg ${isGoalComplete ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-emerald-400 to-teal-500'}`}>
              {isGoalComplete ? <FaStar /> : <FaBullseye />}
            </div>
            <div>
              <h3 className="text-xl font-bold">{isGoalComplete ? 'Goal Complete! 🎊' : 'Goal of the Day'}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isGoalComplete ? 'Amazing work! 💪' : `Complete ${dailyGoal} sessions`}
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">{sessionsToday} / {dailyGoal}</span>
              <span className={`font-bold ${isGoalComplete ? 'text-yellow-500' : 'text-emerald-500'}`}>{goalProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${isGoalComplete ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${goalProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <CTACard 
            onClick={() => setCurrentView('exercises')}
            gradient="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"
            icon={FaRocket}
            title="अभ्यास शुरू करें"
            subtitle="स्पीच थेरेपी यात्रा शुरू करें"
            hint="Start Now"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <CTACard 
            onClick={() => setCurrentView('history')}
            icon={FaHistory}
            title="अपनी प्रगति देखें"
            subtitle="रिकॉर्ड्स और सुधार देखें"
            hint="View History"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default memo(HomeView);
