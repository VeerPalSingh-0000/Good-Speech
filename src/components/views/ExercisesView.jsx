import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '../../utilities/helpers';
import AnimatedButton from '../ui/AnimatedButton';
import { FaPlay, FaPause, FaSave } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

// A dedicated, beautiful card for each sound practice
const SoundPracticeCard = ({ sound, timer, records, user, onStart, onStop }) => {
const stats = useMemo(() => {
  const userSoundRecords = (records.sounds || []).filter(
    record => record.sound === sound
  );

 
  const bestTime = userSoundRecords.length > 0
    ? Math.max(...userSoundRecords.map(r => r.time || 0))
    : 0;
  
  return {
    sessions: userSoundRecords.length,
    bestTime: formatTime(bestTime),
  };
}, [records, sound]);



  return (
    <motion.div 
      variants={itemVariants}
      className="group relative p-6 rounded-3xl transition-all duration-300 hover:-translate-y-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-purple-500/20"
    >
      <div className="relative text-center space-y-4">
        {/* Sound Display */}
        <h3 className="text-7xl p-4 font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
          {sound}
        </h3>
        
        {/* Personal Stats */}
        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          सत्र: {stats.sessions} | सर्वश्रेष्ठ: {stats.bestTime}
        </div>

        {/* Circular Timer */}
        <div className="relative w-40 h-40 mx-auto">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" strokeWidth="12" className="text-slate-200 dark:text-slate-700" />
            <motion.circle
              cx="60" cy="60" r="54" fill="none"
              stroke="url(#exerciseGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              pathLength="1"
              strokeDasharray="1"
              style={{ strokeDashoffset: 1 - Math.min(timer.time / 600, 1) }} // Cap at 60 seconds for full circle
            />
            <defs>
              <linearGradient id="exerciseGradient">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-3xl font-mono font-bold">
            {formatTime(timer.time)}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2 pt-2">
          <AnimatedButton
            onClick={() => onStart(sound)}
            disabled={timer.isRunning}
            className="bg-green-500 text-white !px-4"
            icon={<FaPlay />}
          />
          <AnimatedButton
            onClick={() => onStop(sound, false)}
            disabled={!timer.isRunning}
            className="bg-yellow-500 text-white !px-4"
            icon={<FaPause />}
          />
          <AnimatedButton
            onClick={() => onStop(sound, true)}
            disabled={timer.time === 0}
            className="bg-blue-500 text-white !px-4"
            icon={<FaSave />}
          />
        </div>
      </div>
    </motion.div>
  );
};



const ExercisesView = ({ user, records, soundTimers, startSoundTimer, stopSoundTimer }) => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">स्वर अभ्यास</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg max-w-2xl mx-auto">Practice vowel sounds with precision timing to build muscle memory and improve speech fluency.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {Object.keys(soundTimers).map(sound => (
          <SoundPracticeCard 
            key={sound}
            sound={sound}
            timer={soundTimers[sound]}
            records={records}
            user={user}
            onStart={startSoundTimer}
            onStop={stopSoundTimer}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ExercisesView;
