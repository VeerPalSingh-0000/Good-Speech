// src/components/views/HomeView.jsx - Professional Solid Color Redesign

import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import StatCard from '../StatCard';
import { formatTime } from '../../utilities/helpers';
import { FaHistory, FaBullseye, FaStar, FaRocket, FaMedal, FaCrown, FaCheckCircle } from 'react-icons/fa';
import { useGamification } from '../../hooks/useGamification';

// Get time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", emoji: "☀️", hindi: "सुप्रभात" };
  if (hour < 17) return { text: "Good Afternoon", emoji: "🌤️", hindi: "नमस्ते" };
  if (hour < 21) return { text: "Good Evening", emoji: "🌆", hindi: "शुभ संध्या" };
  return { text: "Good Night", emoji: "🌙", hindi: "शुभ रात्रि" };
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

// Memoized CTA Card component - Professional Solid Style
const CTACard = memo(({ onClick, variant = 'primary', icon: Icon, title, subtitle }) => {
  const isPrimary = variant === 'primary';
  
  return (
    <motion.div 
      onClick={onClick}
      className={`group relative p-6 sm:p-8 rounded-3xl cursor-pointer overflow-hidden transition-all duration-300 ${
        isPrimary 
          ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:shadow-lg' 
          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md'
      }`}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${
            isPrimary ? 'bg-white/20 text-white' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
          }`}>
            <Icon className="text-2xl" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
          <p className={`text-sm font-medium ${isPrimary ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
            {subtitle}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2 ${
          isPrimary ? 'bg-white/10 text-white' : 'bg-slate-50 dark:bg-slate-700 text-slate-400'
        }`}>
          →
        </div>
      </div>
    </motion.div>
  );
});

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

  const gamification = useGamification(records, stats);

  const { dailyGoal, sessionsToday, goalProgress, isGoalComplete } = useMemo(() => {
    const goal = 11;
    const todayString = new Date().toDateString();
    const sessions = [...(records?.sounds || []), ...(records?.varnmala || []), ...(records?.stories || [])]
      .filter(r => new Date(r.timestamp?.seconds ? r.timestamp.seconds * 1000 : r.timestamp).toDateString() === todayString).length;
    const progress = Math.min((sessions / goal) * 100, 100);
    return { dailyGoal: goal, sessionsToday: sessions, goalProgress: progress, isGoalComplete: progress >= 100 };
  }, [records]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 md:space-y-8">
      
      {/* Welcome Section - Professional Solid Dark */}
      <motion.div variants={itemVariants} className="bg-slate-900 text-white rounded-[2rem] p-8 md:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 w-full md:w-auto text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm font-medium mb-4">
            <span>{greeting.emoji}</span>
            <span>{greeting.hindi}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
            {greeting.text}, <span className="text-indigo-400">{firstName}</span>.
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-md">
            Your speech therapy journey continues today. Stay consistent to see results.
          </p>
        </div>
        
        <div className="relative z-10 shrink-0 bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-center min-w-[140px]">
          <FaBullseye className="text-indigo-500 text-2xl mb-2" />
          <div className="text-4xl font-black text-white">{stats.streak}</div>
          <div className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-wider">Day Streak</div>
        </div>
      </motion.div>

      {/* Grid Layout for Stats & Gamification */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left Column: Stats Grid (Takes up 2/3 space on large screens) */}
        <motion.div variants={containerVariants} className="lg:col-span-2 grid grid-cols-2 gap-4 md:gap-6">
          {/* Note: Assuming StatCard component accepts solid color classes or relies on default styling */}
          <motion.div variants={itemVariants}><StatCard title="Total Sessions" value={stats.totalSessions} icon="fas fa-calendar-check" color="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400" /></motion.div>
          <motion.div variants={itemVariants}><StatCard title="Total Time" value={stats.totalTime} icon="fas fa-clock" color="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400" /></motion.div>
          <motion.div variants={itemVariants}><StatCard title="Best Sound" value={stats.bestSound} icon="fas fa-trophy" color="text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400" /></motion.div>
          <motion.div variants={itemVariants}><StatCard title="Daily Streak" value={`${stats.streak} Days`} icon="fas fa-fire" color="text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400" /></motion.div>
        </motion.div>

        {/* Right Column: Level Section (Takes up 1/3 space) */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-6 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FaCrown className="text-amber-500" /> Current Level
            </h2>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold">
              {gamification.xp} XP
            </span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
             <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-700" />
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={`${gamification.progress * 3.51} 351`} strokeLinecap="round" className="text-indigo-600 dark:text-indigo-500 transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-800 dark:text-white">{gamification.level}</span>
              </div>
            </div>
            
            <div className="w-full text-center">
              <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 px-2">
                <span>{gamification.currentXp} XP</span>
                <span>{gamification.xpToNext} XP to go</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Actions (CTAs) */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <motion.div variants={itemVariants}>
          <CTACard 
            onClick={() => setCurrentView('exercises')}
            variant="primary"
            icon={FaRocket}
            title="Start Practice"
            subtitle="Begin your daily speech therapy"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <CTACard 
            onClick={() => setCurrentView('history')}
            variant="secondary"
            icon={FaHistory}
            title="View Analytics"
            subtitle="Check your progress and records"
          />
        </motion.div>
      </motion.div>

      {/* Bottom Grid: Goal & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Goal Strategy Box */}
        <motion.div variants={itemVariants} className={`p-8 rounded-[2rem] border shadow-sm flex flex-col justify-center ${
          isGoalComplete 
            ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' 
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
        }`}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
              isGoalComplete ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
            }`}>
              {isGoalComplete ? <FaCheckCircle /> : <FaBullseye />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {isGoalComplete ? 'Daily Goal Complete' : 'Daily Target'}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {isGoalComplete ? 'Great job hitting your marks today.' : `Complete ${dailyGoal} sessions to maintain your streak.`}
              </p>
            </div>
          </div>
          
          <div className="w-full">
            <div className="flex items-center justify-between mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">
              <span>Progress</span>
              <span>{sessionsToday} / {dailyGoal}</span>
            </div>
            <div className="w-full h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${isGoalComplete ? 'bg-emerald-500' : 'bg-indigo-600 dark:bg-indigo-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${goalProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Badges Section */}
        <motion.div variants={itemVariants} className="p-8 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FaMedal className="text-indigo-500" /> Achievements
            </h3>
            <span className="text-sm font-medium text-slate-500">
              {gamification.badges.length} Unlocked
            </span>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {gamification.badges.map(badge => (
              <div key={badge.id} className="shrink-0 group relative w-24 h-24 bg-slate-50 dark:bg-slate-700/50 rounded-2xl flex flex-col items-center justify-center border border-slate-200 dark:border-slate-600 hover:border-indigo-500 transition-colors">
                <span className="text-3xl mb-2">{badge.icon}</span>
                <span className="text-[10px] font-bold text-center text-slate-700 dark:text-slate-300 leading-tight px-2">{badge.title}</span>
                
                {/* Tooltip */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-32 bg-slate-900 text-white text-[10px] font-medium p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center shadow-lg">
                  {badge.description}
                  {/* Tooltip Arrow */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                </div>
              </div>
            ))}
            
            {/* Show up to 3 unearned badges to keep the UI clean */}
            {gamification.unearnedBadges.slice(0, 3).map(badge => (
              <div key={badge.id} className="shrink-0 w-24 h-24 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700 opacity-60 grayscale">
                <span className="text-3xl mb-2">{badge.icon}</span>
                <span className="text-[10px] font-medium text-center text-slate-500 leading-tight px-2">{badge.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default memo(HomeView);