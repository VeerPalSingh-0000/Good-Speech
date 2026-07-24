// src/components/views/ExercisesView.jsx - Performance optimized version

import React, { useMemo, memo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { formatTime } from '../../utilities/helpers';
import { FaPlay, FaPause, FaSave, FaTrophy, FaFire, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
  'क': { gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500', glow: 'shadow-blue-500/30' },
  'ख': { gradient: 'from-indigo-500 to-violet-600', bg: 'bg-indigo-500', glow: 'shadow-indigo-500/30' },
  'ग': { gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-500', glow: 'shadow-amber-500/30' },
  'घ': { gradient: 'from-red-500 to-rose-600', bg: 'bg-red-500', glow: 'shadow-red-500/30' },
  'त': { gradient: 'from-teal-500 to-emerald-600', bg: 'bg-teal-500', glow: 'shadow-teal-500/30' },
  'थ': { gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-500', glow: 'shadow-violet-500/30' },
  'द': { gradient: 'from-pink-500 to-rose-600', bg: 'bg-pink-500', glow: 'shadow-pink-500/30' },
  'ध': { gradient: 'from-orange-500 to-amber-600', bg: 'bg-orange-500', glow: 'shadow-orange-500/30' },
};

const defaultColors = { gradient: 'from-purple-500 to-pink-600', bg: 'bg-purple-500', glow: 'shadow-purple-500/30' };

const SoundPracticeCard = memo(({ sound, timer, records, onStart, onStop }) => {
  const colors = soundColors[sound] || defaultColors;
  
  // Refs for direct DOM manipulation to bypass React re-renders for the timer
  const timeDisplayRef = useRef(null);
  const progressCircleRef = useRef(null);
  const requestRef = useRef();
  const startTimeRef = useRef(null);

  const stats = useMemo(() => {
    const userSoundRecords = (records?.sounds || []).filter(record => record.sound === sound);
    const bestTime = userSoundRecords.length > 0 ? Math.max(...userSoundRecords.map(r => r.time || 0)) : 0;
    return { sessions: userSoundRecords.length, bestTime: formatTime(bestTime) };
  }, [records, sound]);

  const isActive = timer?.isRunning || false;
  const baseTime = timer?.time || 0;

  // Performance optimized visual timer loop
  useEffect(() => {
    if (isActive) {
      startTimeRef.current = performance.now() - (baseTime * 100); 

      const animateTimer = (currentTime) => {
        const elapsedMs = currentTime - startTimeRef.current;
        const currentTimerValue = Math.floor(elapsedMs / 100);
        
        if (timeDisplayRef.current) {
          timeDisplayRef.current.textContent = formatTime(currentTimerValue);
        }

        if (progressCircleRef.current) {
          const progress = Math.min(currentTimerValue / 600, 1);
          progressCircleRef.current.style.strokeDasharray = `${progress * 339} 339`;
        }

        requestRef.current = requestAnimationFrame(animateTimer);
      };

      requestRef.current = requestAnimationFrame(animateTimer);
    } else {
      if (timeDisplayRef.current) timeDisplayRef.current.textContent = formatTime(baseTime);
      if (progressCircleRef.current) {
        const progress = Math.min(baseTime / 600, 1);
        progressCircleRef.current.style.strokeDasharray = `${progress * 339} 339`;
      }
      cancelAnimationFrame(requestRef.current);
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [isActive, baseTime]);

  const handleStart = () => onStart(sound);
  const handleStop = (shouldRecord) => onStop(sound, shouldRecord);

  return (
    <motion.div
      variants={itemVariants}
      className="group relative"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className={`absolute -inset-1 bg-gradient-to-r ${colors.gradient} rounded-3xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none`} />

      <div className={`relative overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xl backdrop-blur-xl ${isActive ? colors.glow + ' shadow-2xl ring-2 ring-purple-500/30' : ''} transition-all duration-300`}>
        <div className={`h-1.5 bg-gradient-to-r ${colors.gradient}`} />

        <div className="p-5 space-y-4">
          {/* Main Sound Title */}
          <div className="relative flex items-center justify-center pt-1">
            <div className={`absolute w-20 h-20 rounded-full bg-gradient-to-br ${colors.gradient} opacity-15 blur-xl`} />
            <motion.div
              className={`relative text-5xl font-display font-black bg-gradient-to-br ${colors.gradient} bg-clip-text text-transparent drop-shadow-sm`}
              animate={isActive ? { scale: [1, 1.06, 1] } : {}}
              transition={{ duration: 0.6, repeat: isActive ? Infinity : 0 }}
            >
              {sound}
            </motion.div>
          </div>

          {/* Stats Bar */}
          <div className="flex justify-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
              <FaFire className="text-amber-500 text-xs" />
              <span>{stats.sessions} sessions</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
              <FaTrophy className="text-amber-400 text-xs" />
              <span>{stats.bestTime}</span>
            </div>
          </div>

          {/* Compact Timer Arc */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                strokeWidth="7"
                className="text-slate-200 dark:text-slate-800"
                stroke="currentColor"
              />
              <circle
                ref={progressCircleRef}
                cx="60" cy="60" r="54"
                fill="none"
                strokeWidth="7"
                strokeLinecap="round"
                className={`${colors.bg}`}
                stroke="currentColor"
                style={{ transition: isActive ? 'none' : 'stroke-dasharray 0.3s ease' }} 
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span 
                ref={timeDisplayRef}
                aria-live="polite" 
                className={`text-xl font-black font-mono tracking-wider ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}
              >
                {formatTime(baseTime)}
              </span>
              {isActive && (
                <span className="text-[9px] font-extrabold text-emerald-500 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Recording
                </span>
              )}
            </div>
          </div>

          {/* Compact Controls */}
          <div className="flex justify-center gap-2.5 pt-1">
            <motion.button
              aria-label={`Start practice for ${sound}`}
              onClick={handleStart}
              disabled={isActive}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md transition-all ${isActive
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:shadow-emerald-500/30 hover:scale-105 active:scale-95'
                }`}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay size={11} className="ml-0.5" />
            </motion.button>

            <motion.button
              aria-label={`Pause practice for ${sound}`}
              onClick={() => handleStop(false)}
              disabled={!isActive}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md transition-all ${!isActive
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-br from-amber-500 to-orange-600 hover:shadow-amber-500/30 hover:scale-105 active:scale-95'
                }`}
              whileTap={{ scale: 0.95 }}
            >
              <FaPause size={11} />
            </motion.button>

            <motion.button
              aria-label={`Save practice record for ${sound}`}
              onClick={() => handleStop(true)}
              disabled={baseTime === 0 && !isActive}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md transition-all ${baseTime === 0 && !isActive
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50'
                : `bg-gradient-to-br ${colors.gradient} hover:scale-105 active:scale-95`
                }`}
              whileTap={{ scale: 0.95 }}
            >
              <FaSave size={11} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.sound === nextProps.sound &&
    prevProps.timer?.isRunning === nextProps.timer?.isRunning &&
    (prevProps.timer?.isRunning || prevProps.timer?.time === nextProps.timer?.time) &&
    prevProps.records === nextProps.records
  );
});

SoundPracticeCard.displayName = 'SoundPracticeCard';

const ExercisesView = ({ user, records = {}, soundTimers = {}, startSoundTimer, stopSoundTimer, embedded = false }) => {
  const [activeTab, setActiveTab] = useState('vowels');
  const navigate = useNavigate();

  const VOWELS = ['आ', 'ई', 'ऊ'];
  const CONSONANTS = ['क', 'ख', 'ग', 'घ', 'त', 'थ', 'द', 'ध'];

  const currentSounds = activeTab === 'vowels' ? VOWELS : CONSONANTS;

  return (
    <MotionConfig reducedMotion={import.meta.env.PROD ? "user" : "never"}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={embedded ? "space-y-6 pb-4" : "space-y-8 max-w-4xl mx-auto px-3 sm:px-6 pb-12"}
      >
        {!embedded && (
          <div className="w-full flex justify-start">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <FaArrowLeft />
            </button>
          </div>
        )}
        
        {!embedded && (
          <motion.div variants={itemVariants} className="text-center space-y-2 -mt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 dark:bg-purple-950/80 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-extrabold uppercase tracking-wider">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              Sound Precision & Sustained Phonation
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
              Swar & Sound Exercises
            </h2>
          </motion.div>
        )}

        {/* Segmented Control Pill */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xs mx-auto shadow-inner text-xs font-extrabold">
          <button
            onClick={() => setActiveTab('vowels')}
            className={`flex-1 py-2 rounded-xl transition-all ${activeTab === 'vowels'
              ? 'bg-purple-600 text-white shadow-sm font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            Vowels (Swar)
          </button>
          <button
            onClick={() => setActiveTab('consonants')}
            className={`flex-1 py-2 rounded-xl transition-all ${activeTab === 'consonants'
              ? 'bg-purple-600 text-white shadow-sm font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            Consonants
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {currentSounds.map(sound => (
            <SoundPracticeCard
              key={sound}
              sound={sound}
              timer={soundTimers?.[sound] || { time: 0, isRunning: false }}
              records={records}
              onStart={startSoundTimer}
              onStop={stopSoundTimer}
            />
          ))}
        </div>

        {/* Tip Banner */}
        <motion.div
          variants={itemVariants}
          className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white shadow-md backdrop-blur-xl max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 flex items-center justify-center text-base shrink-0 font-bold">
              💡
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white">Pro Tip:</strong> Hold each vowel sound steadily for 5+ seconds with relaxed airflow to build vocal cord stability and speech control.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
};

export default memo(ExercisesView);