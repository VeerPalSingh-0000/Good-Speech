// src/components/views/HomeView.jsx - Minimal Aesthetic Redesign

import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { FaFire, FaCalendarCheck, FaArrowRight, FaCheckCircle, FaClock, FaFeatherAlt } from 'react-icons/fa';

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
          <h1 className="text-3xl font-display font-extrabold text-slate-800 dark:text-white tracking-tight">
            {greeting.text}, <span className="text-blue-600 dark:text-blue-400">{firstName}</span>.
          </h1>
        </div>
        
        {/* Compact Streak Badge */}
        <div className="flex flex-col items-center justify-center px-4 py-2 bg-white dark:bg-slate-800 text-amber-500 rounded-2xl border-4 border-slate-200 dark:border-slate-700 shadow-sm">
          <FaFire className="text-xl mb-0.5 drop-shadow-md" />
          <span className="text-sm font-display font-black leading-none text-slate-700 dark:text-slate-200">{stats.streak}</span>
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
            className="group relative cursor-pointer p-8 rounded-[2rem] bg-gradient-to-b from-sky-400 to-sky-500 text-white shadow-xl hover:shadow-2xl btn-gamified border-b-8 border-sky-600 overflow-hidden"
          >
            {/* Elegant glassmorphism background elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-white text-xs font-bold mb-3 font-display">
                    <FaCalendarCheck /> Phase 1
                  </div>
                  <h3 className="text-2xl font-display font-black tracking-tight mb-1">Speech Program</h3>
                  <p className="text-blue-100 text-sm font-medium">Follow the structured 30-day journey</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all shadow-lg border border-white/10">
                  <FaArrowRight className="text-lg" />
                </div>
              </div>
              
              <div className="bg-black/10 rounded-2xl p-4 border-2 border-black/10">
                <div className="flex justify-between items-end mb-2 font-display">
                  <div className="text-sm font-bold">Day {prog.currentDay}</div>
                  <div className="text-xs text-blue-100 font-bold">{pct}% Complete</div>
                </div>
                <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden border-2 border-black/10">
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



      {/* Practice Roadmap & Expectations Card */}
      <motion.div
        variants={itemVariants}
        onClick={() => setCurrentView('education')}
        className="cursor-pointer p-6 rounded-[2rem] bg-slate-900/90 border border-slate-800 text-white shadow-xl hover:border-emerald-500/50 transition-all group relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Recovery Timeline
            </span>
            <span className="text-[10px] font-bold text-slate-400">Think in Months, Not Days</span>
          </div>
          <FaArrowRight className="text-slate-400 group-hover:translate-x-1 transition-transform text-xs" />
        </div>

        <h3 className="text-lg font-display font-extrabold text-white mb-3">
          100-Day Commitment Rule 🎯
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center font-display">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-xs font-black text-sky-400 block">100 Days</span>
            <span className="text-[10px] text-slate-300 font-medium">Build Habit</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-xs font-black text-indigo-400 block">6 Months</span>
            <span className="text-[10px] text-slate-300 font-medium">Strong Skills</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-xs font-black text-emerald-400 block">1 Year+</span>
            <span className="text-[10px] text-slate-300 font-medium">Real-Life Mastery</span>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default memo(HomeView);