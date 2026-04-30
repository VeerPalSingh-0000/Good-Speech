// src/components/views/HomeView.jsx - Minimal Aesthetic Redesign

import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { FaFire, FaCalendarCheck, FaArrowRight, FaCheckCircle, FaClock } from 'react-icons/fa';

// Get time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", emoji: "☀️" };
  if (hour < 17) return { text: "Good Afternoon", emoji: "🌤️" };
  if (hour < 21) return { text: "Good Evening", emoji: "🌆" };
  return { text: "Good Night", emoji: "🌙" };
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

const HomeView = ({ user, records, setCurrentView, userSettings }) => {
  const greeting = useMemo(() => getGreeting(), []);
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  
  const stats = useMemo(() => {
    if (!records) return { streak: 0 };
    const allRecords = [...(records.sounds || []), ...(records.varnmala || []), ...(records.stories || [])];
    if (allRecords.length === 0) return { streak: 0 };

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
    return { streak };
  }, [records]);

  const todayStats = useMemo(() => {
    const todayString = new Date().toDateString();
    const todayRecords = [...(records?.sounds || []), ...(records?.varnmala || []), ...(records?.stories || [])]
      .filter(r => new Date(r.timestamp?.seconds ? r.timestamp.seconds * 1000 : r.timestamp).toDateString() === todayString);
    
    const timeDeciseconds = todayRecords.reduce((acc, r) => acc + (r.time || 0), 0);
    
    return { 
      timeMins: Math.floor(timeDeciseconds / 600)
    };
  }, [records]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 max-w-2xl mx-auto px-2">
      
      {/* Minimal Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-end mb-4 pt-4">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-1.5 mb-1">
            <span>{greeting.emoji}</span> Welcome back
          </p>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {greeting.text}, <span className="text-indigo-600 dark:text-indigo-400">{firstName}</span>.
          </h1>
        </div>
        
        {/* Compact Streak Badge */}
        <div className="flex flex-col items-center justify-center px-4 py-2.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-2xl border border-orange-100 dark:border-orange-500/20 shadow-sm">
          <FaFire className="text-xl mb-0.5" />
          <span className="text-sm font-black leading-none">{stats.streak}</span>
        </div>
      </motion.div>

      {/* 30-Day Program CTA - The Main Focus */}
      {(() => {
        const prog = userSettings?.programProgress || { currentDay: 1, completedDays: {} };
        const completed = Object.keys(prog.completedDays).length;
        const total = 30;
        const pct = Math.round((completed / total) * 100);
        
        return (
          <motion.div variants={itemVariants}
            onClick={() => setCurrentView('program')}
            className="group relative cursor-pointer p-8 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* Elegant glassmorphism background elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-3 shadow-inner">
                    <FaCalendarCheck /> Phase 1
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-1">Speech Program</h3>
                  <p className="text-indigo-200 text-sm font-medium">Follow the structured 30-day journey</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all shadow-lg border border-white/10">
                  <FaArrowRight className="text-lg" />
                </div>
              </div>
              
              <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="flex justify-between items-end mb-2">
                  <div className="text-sm font-bold">Day {prog.currentDay}</div>
                  <div className="text-xs text-indigo-200 font-medium">{pct}% Complete</div>
                </div>
                <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" 
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })()}

      {/* Sleek Horizontal Banner for Today's Time */}
      <motion.div variants={itemVariants} className="flex items-center justify-between p-5 rounded-[2rem] bg-white dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
         <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-400 to-rose-500 rounded-l-3xl" />
         
         {/* Subtle background glow */}
         <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-500" />
         
         <div className="flex items-center gap-4 relative z-10 pl-2">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center shadow-inner">
               <FaClock size={20} />
            </div>
            <div>
               <h3 className="text-sm font-bold text-slate-800 dark:text-white tracking-wide">Today's Focus</h3>
               <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Time spent practicing</p>
            </div>
         </div>
         
         <div className="flex items-baseline gap-1 relative z-10 pr-2">
            <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{todayStats.timeMins}</span>
            <span className="text-sm font-bold text-slate-400 dark:text-slate-500">min</span>
         </div>
      </motion.div>

    </motion.div>
  );
};

export default memo(HomeView);