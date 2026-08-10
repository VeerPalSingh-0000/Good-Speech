// src/components/views/HomeView.jsx - Modern Responsive Dashboard

import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  FaFire,
  FaCalendarCheck,
  FaArrowRight,
  FaFeatherAlt,
  FaBookReader,
  FaWind,
  FaMicrophone,
  FaPlay,
  FaGraduationCap,
} from 'react-icons/fa';
import { getPhaseForDay, PROGRAM_DATA } from '../../data/programData';

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

  const QUICK_PRACTICE_TOOLS = [
    {
      id: 'easy-onset',
      title: 'Easy Onset Studio',
      subtitle: 'Smooth speech & syllable stretch',
      icon: <FaFeatherAlt />,
      color: 'from-purple-600 to-indigo-600',
      badge: 'Popular'
    },
    {
      id: 'stories',
      title: 'Stories Reader',
      subtitle: 'Fluency & teleprompter guide',
      icon: <FaBookReader />,
      color: 'from-blue-600 to-cyan-600',
      badge: 'Interactive'
    },
    {
      id: 'breathing',
      title: 'Paced Breathing',
      subtitle: 'Breath support & calm pacing',
      icon: <FaWind />,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Therapy'
    },
    {
      id: 'tongue-twisters',
      title: 'Articulation Practice',
      subtitle: 'Tongue twisters & clarity',
      icon: <FaMicrophone />,
      color: 'from-amber-500 to-orange-600',
      badge: 'Clarity'
    }
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 max-w-4xl mx-auto px-3 sm:px-6 pb-16">
      
      {/* Top Welcome Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold flex items-center gap-1.5 mb-1">
            <span>{greeting.emoji}</span> Welcome back
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            {greeting.text}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-sky-400 dark:to-purple-400">{firstName}</span>
          </h1>
        </div>
        
        {/* Compact Streak Badge */}
        <div className="flex items-center gap-2.5 px-4 py-2 bg-white/90 dark:bg-slate-900/90 text-amber-500 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md backdrop-blur-xl shrink-0 self-start sm:self-auto">
          <FaFire className="text-lg drop-shadow-sm text-amber-500 animate-bounce" />
          <span className="text-xs font-display font-black text-slate-800 dark:text-slate-200">
            {stats.streak} Day Streak
          </span>
        </div>
      </motion.div>

      {/* 30-Day Speech Program Hero CTA */}
      {(() => {
        const prog = userSettings?.programProgress || { currentDay: 1, completedDays: {} };
        const currentPhase = getPhaseForDay(prog.currentDay) || PROGRAM_DATA.phases[0];
        const phaseCompletedCount = currentPhase.days ? currentPhase.days.filter(d => !!prog.completedDays[d.day]?.completedAt).length : 0;
        const pct = Math.round((phaseCompletedCount / currentPhase.totalDays) * 100);
        
        return (
          <motion.div variants={itemVariants}
            onClick={() => setCurrentView('program')}
            className="group relative cursor-pointer p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-950 dark:via-indigo-950 dark:to-slate-950 text-white shadow-2xl hover:shadow-purple-500/20 border border-purple-400/30 overflow-hidden transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {/* Ambient Background Glows */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-white/20 transition-all duration-500" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider font-display shadow-sm">
                    <FaCalendarCheck size={10} className="text-amber-300" /> Phase {currentPhase.id} • {currentPhase.title}
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white drop-shadow-sm">
                    Speech Mastery Program
                  </h3>
                  <p className="text-purple-100 dark:text-slate-300 text-xs sm:text-sm font-medium">
                    {currentPhase.description}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-white/25 transition-all shadow-lg border border-white/20 shrink-0 ml-3">
                  <FaArrowRight className="text-base group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              
              {/* Progress Box */}
              <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-4 border border-white/15 space-y-2">
                <div className="flex justify-between items-center font-display">
                  <span className="text-xs font-black tracking-wide text-white">Day {prog.currentDay} Progress</span>
                  <span className="text-xs font-black text-emerald-300">{pct}% Phase {currentPhase.id} Completed</span>
                </div>
                <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)]" 
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

      {/* Quick Practice Studio Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-black text-slate-900 dark:text-white tracking-tight">
            Quick Practice Modules
          </h2>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Select any tool to start</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_PRACTICE_TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setCurrentView(tool.id)}
              className="p-5 rounded-2xl text-left transition-all duration-300 border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800/90 text-slate-900 dark:text-white shadow-lg hover:shadow-xl flex items-center justify-between group active:scale-[0.98] backdrop-blur-xl"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 bg-gradient-to-tr ${tool.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {tool.icon}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-black text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {tool.title}
                    </h4>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                      {tool.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                    {tool.subtitle}
                  </p>
                </div>
              </div>

              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-all shrink-0 ml-2 shadow-sm">
                <FaPlay size={10} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recovery Timeline Card */}
      <motion.div
        variants={itemVariants}
        onClick={() => setCurrentView('education')}
        className="cursor-pointer p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden backdrop-blur-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20">
            Timeline Roadmap
          </span>
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            <span>Learn More</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs" />
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-display font-black text-slate-900 dark:text-white mb-4">
          100-Day Commitment Rule 🎯
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center font-display">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-sm font-black text-sky-600 dark:text-sky-400 block">100 Days</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5 block">Habit Formation</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 block">6 Months</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5 block">Fluency Skills</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 block">1 Year+</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5 block">Speech Mastery</span>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default memo(HomeView);