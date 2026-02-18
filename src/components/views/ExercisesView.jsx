// src/components/views/ExercisesView.jsx - Enhanced aesthetic version

import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '../../utilities/helpers';
import { FaPlay, FaPause, FaSave, FaTrophy, FaFire } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } }
};

// Color schemes for each vowel sound
const soundColors = {
  'अ': { gradient: 'from-rose-500 to-pink-600', bg: 'bg-rose-500', glow: 'shadow-rose-500/30' },
  'आ': { gradient: 'from-orange-500 to-amber-600', bg: 'bg-orange-500', glow: 'shadow-orange-500/30' },
  'इ': { gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500', glow: 'shadow-emerald-500/30' },
  'ई': { gradient: 'from-cyan-500 to-blue-600', bg: 'bg-cyan-500', glow: 'shadow-cyan-500/30' },
  'उ': { gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-500', glow: 'shadow-violet-500/30' },
  'ऊ': { gradient: 'from-fuchsia-500 to-pink-600', bg: 'bg-fuchsia-500', glow: 'shadow-fuchsia-500/30' },
  'ए': { gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500', glow: 'shadow-blue-500/30' },
  'ऐ': { gradient: 'from-indigo-500 to-violet-600', bg: 'bg-indigo-500', glow: 'shadow-indigo-500/30' },
  'ओ': { gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-500', glow: 'shadow-amber-500/30' },
  'औ': { gradient: 'from-red-500 to-rose-600', bg: 'bg-red-500', glow: 'shadow-red-500/30' },
};  

const defaultColors = { gradient: 'from-purple-500 to-pink-600', bg: 'bg-purple-500', glow: 'shadow-purple-500/30' };

// Memoized Sound Practice Card
const SoundPracticeCard = memo(({ sound, timer, records, onStart, onStop }) => {
  const colors = soundColors[sound] || defaultColors;
  
  const stats = useMemo(() => {
    const userSoundRecords = (records.sounds || []).filter(record => record.sound === sound);
    const bestTime = userSoundRecords.length > 0 ? Math.max(...userSoundRecords.map(r => r.time || 0)) : 0;
    return { sessions: userSoundRecords.length, bestTime: formatTime(bestTime) };
  }, [records, sound]);

  const progress = Math.min(timer.time / 600, 1); // Cap at 60 seconds
  const isActive = timer.isRunning;

  return (
    <motion.div 
      variants={itemVariants}
      className="group relative"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Card glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${colors.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
      
      {/* Main card */}
      <div className={`relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-xl ${isActive ? colors.glow + ' shadow-2xl' : ''} transition-all duration-300`}>
        
        {/* Top gradient accent bar */}
        <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />
        
        {/* Card content */}
        <div className="p-6 space-y-5">
          
          {/* Sound character with decorative background */}
          <div className="relative flex items-center justify-center">
            {/* Background decoration */}
            <div className={`absolute w-28 h-28 rounded-full bg-gradient-to-br ${colors.gradient} opacity-10 blur-xl`} />
            
            {/* Sound character */}
            <motion.div
              className={`relative p-5 text-7xl font-bold bg-gradient-to-br ${colors.gradient} bg-clip-text text-transparent`}
              animate={isActive ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
            >
              {sound}
            </motion.div>
          </div>

          {/* Stats badges */}
          <div className="flex justify-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700/50 text-xs font-medium">
              <FaFire className="text-orange-500" />
              <span>{stats.sessions} सत्र</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700/50 text-xs font-medium">
              <FaTrophy className="text-yellow-500" />
              <span>{stats.bestTime}</span>
            </div>
          </div>

          {/* Circular Timer */}
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              {/* Background track */}
              <circle 
                cx="60" cy="60" r="54" 
                fill="none" 
                strokeWidth="6" 
                className="text-slate-200 dark:text-slate-700" 
                stroke="currentColor"
              />
              {/* Progress arc */}
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                className={`${colors.bg}`}
                stroke="currentColor"
                strokeDasharray={`${progress * 339} 339`}
                style={{ transition: 'stroke-dasharray 0.1s ease' }}
              />
            </svg>
            
            {/* Timer display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 ">
              <span className={`text-2xl font-bold font-mono tracking-wider ${isActive ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                {formatTime(timer.time)}
              </span>
              {isActive && (
                <span className="text-[10px] text-green-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Recording
                </span>
              )}
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex justify-center gap-3">
            {/* Play button */}
            <motion.button
              onClick={() => onStart(sound)}
              disabled={isActive}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-medium shadow-lg transition-all ${
                isActive 
                  ? 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-br from-emerald-500 to-green-600 hover:shadow-emerald-500/40 hover:scale-105'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay className="ml-0.5" />
            </motion.button>
            
            {/* Pause button */}
            <motion.button
              onClick={() => onStop(sound, false)}
              disabled={!isActive}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-medium shadow-lg transition-all ${
                !isActive 
                  ? 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-br from-amber-500 to-orange-600 hover:shadow-amber-500/40 hover:scale-105'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <FaPause />
            </motion.button>
            
            {/* Save button */}
            <motion.button
              onClick={() => onStop(sound, true)}
              disabled={timer.time === 0}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-medium shadow-lg transition-all ${
                timer.time === 0 
                  ? 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed opacity-50' 
                  : `bg-gradient-to-br ${colors.gradient} hover:scale-105`
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <FaSave />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

SoundPracticeCard.displayName = 'SoundPracticeCard';

const ExercisesView = ({ user, records, soundTimers, startSoundTimer, stopSoundTimer }) => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Header section */}
      <motion.div variants={itemVariants} className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium">
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          स्वर अभ्यास
        </div>
        <h2 className="text-4xl font-bold text-slate-800 dark:text-white">
          Vowel Sound Practice
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Master Hindi vowel sounds with precision timing. Build muscle memory and improve speech fluency.
        </p>
      </motion.div>

      {/* Cards grid */}
      <motion.div 
        variants={containerVariants}
        className="flex flex-wrap justify-center gap-4 lg:gap-5"
      >
        {Object.keys(soundTimers).map(sound => (
          <div key={sound} className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)] max-w-[320px]">
            <SoundPracticeCard 
              sound={sound}
              timer={soundTimers[sound]}
              records={records}
              onStart={startSoundTimer}
              onStop={stopSoundTimer}
            />
          </div>
        ))}
      </motion.div>

      {/* Tip section */}
      <motion.div 
        variants={itemVariants} 
        className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/50"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg flex-shrink-0">
            💡
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white mb-1">Pro Tip</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Focus on one sound at a time. Try to hold each vowel sound for at least 5 seconds while maintaining a steady, clear tone. Practice daily for best results!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default memo(ExercisesView);
