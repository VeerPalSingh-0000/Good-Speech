// src/features/hindi/components/views/VarnmalaView.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime } from '../../utilities/helpers';
import AnimatedButton from '../ui/AnimatedButton'; // Assuming you have this component
import { FaPlay, FaPause, FaFlag, FaSave } from 'react-icons/fa';

const VarnmalaDisplay = () => {
  const varnmala = "अ आ इ ई उ ऊ ऋ ए ऐ ओ औ अं अः क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह क्ष त्र ज्ञ".split(" ");
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-2xl font-bold text-center mb-4">हिंदी वर्णमाला</h3>
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-13 gap-2 text-center">
        {varnmala.map((char, index) => (
          <div key={index} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-xl font-bold">
            {char}
          </div>
        ))}
      </div>
    </div>
  );
};

const VarnmalaView = ({ varnmalaTimer, showVarnmala, startVarnmalaTimer, pauseVarnmalaTimer, addVarnmalaLap, stopVarnmalaTimer }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="p-4 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">वर्णमाला अभ्यास</h2>
        <p className="text-slate-500 mt-2">Track your speed and consistency while reciting the Hindi alphabet.</p>
      </div>

      <div className="flex flex-col items-center gap-8">
        {/* Visual Timer */}
        <div className="relative w-64 h-64">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" strokeWidth="12" className="text-slate-200 dark:text-slate-700" />
            <motion.circle
              cx="60" cy="60" r="54" fill="none"
              stroke="url(#varnmalaGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              pathLength="1"
              strokeDasharray="1"
              animate={{ strokeDashoffset: 1 - (varnmalaTimer.time % 600) / 600 }}
              transition={{ duration: 1, ease: "linear" }}
            />
            <defs>
              <linearGradient id="varnmalaGradient">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-5xl font-mono font-bold">
            {formatTime(varnmalaTimer.time)}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4">
          <AnimatedButton onClick={startVarnmalaTimer} disabled={varnmalaTimer.isRunning} className="bg-green-500 text-white" icon={<FaPlay />}>
            {varnmalaTimer.isPaused ? "Resume" : "Start"}
          </AnimatedButton>
          <AnimatedButton onClick={pauseVarnmalaTimer} disabled={!varnmalaTimer.isRunning} className="bg-yellow-500 text-white" icon={<FaPause />}>Pause</AnimatedButton>
          <AnimatedButton onClick={addVarnmalaLap} disabled={!varnmalaTimer.isRunning} className="bg-blue-500 text-white" icon={<FaFlag />}>Lap</AnimatedButton>
          <AnimatedButton onClick={() => stopVarnmalaTimer(true)} disabled={varnmalaTimer.time === 0} className="bg-purple-600 text-white" icon={<FaSave />}>Record</AnimatedButton>
        </div>
      </div>
      
      {/* Laps and Varnmala Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
            <AnimatePresence>
                {showVarnmala && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                        <VarnmalaDisplay />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        <div className="w-full">
            <AnimatePresence>
            {varnmalaTimer.laps.length > 0 && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-2xl font-bold text-center mb-4">लैप समय</h3>
                    <ul className="space-y-2 max-h-96 overflow-y-auto">
                        <AnimatePresence>
                        {varnmalaTimer.laps.map((lap, index) => (
                            <motion.li
                                key={index}
                                layout
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-700 rounded-lg"
                            >
                                <span className="font-semibold">लैप {index + 1}</span>
                                <span className="font-mono font-bold text-purple-600">{lap.formattedTime}</span>
                            </motion.li>
                        ))}
                        </AnimatePresence>
                    </ul>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VarnmalaView;
