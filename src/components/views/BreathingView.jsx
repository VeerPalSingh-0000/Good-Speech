import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaStop, FaWind, FaRegClock, FaLeaf } from 'react-icons/fa';

// Pre-defined breathing techniques
const TECHNIQUES = {
  '4-7-8': {
    name: '4-7-8 Relax',
    description: 'Calms the nervous system, helpful for stammering anxiety.',
    phases: [
      { name: 'Inhale', duration: 4000, instruction: 'Breathe in quietly through your nose', scale: 1.5, color: 'rgb(56 189 248)' }, // sky-400
      { name: 'Hold', duration: 7000, instruction: 'Hold your breath', scale: 1.5, color: 'rgb(14 165 233)' },     // sky-500
      { name: 'Exhale', duration: 8000, instruction: 'Exhale completely through your mouth', scale: 1, color: 'rgb(2 132 199)' } // sky-600
    ]
  },
  'box': {
    name: 'Box Breathing',
    description: 'Equalizes breathing, restores natural rhythm and focus.',
    phases: [
      { name: 'Inhale', duration: 4000, instruction: 'Breathe in slowly', scale: 1.5, color: 'rgb(52 211 153)' },   // emerald-400
      { name: 'Hold', duration: 4000, instruction: 'Hold the air in', scale: 1.5, color: 'rgb(16 185 129)' },     // emerald-500
      { name: 'Exhale', duration: 4000, instruction: 'Breathe out slowly', scale: 1, color: 'rgb(5 150 105)' },    // emerald-600
      { name: 'Hold', duration: 4000, instruction: 'Hold your breath out', scale: 1, color: 'rgb(4 120 87)' }      // emerald-700
    ]
  },
  'diaphragmatic': {
    name: 'Belly Breathing',
    description: 'Deep diaphragmatic breathing to support vocal cords.',
    phases: [
      { name: 'Inhale', duration: 3000, instruction: 'Belly expands outwards', scale: 1.5, color: 'rgb(192 132 252)' }, // purple-400
      { name: 'Exhale', duration: 6000, instruction: 'Belly falls inward slowly', scale: 1, color: 'rgb(147 51 234)' } // purple-600
    ]
  }
};

const BreathingView = () => {
  const [selectedTech, setSelectedTech] = useState('4-7-8');
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const phaseRef = useRef(null);
  const timerRef = useRef(null);

  const technique = TECHNIQUES[selectedTech];
  const currentPhase = technique.phases[currentPhaseIndex];

  // Handle technique change
  const handleTechniqueChange = (techKey) => {
    if (isActive) stopBreathing();
    setSelectedTech(techKey);
  };

  const startBreathing = () => {
    setIsActive(true);
    setCurrentPhaseIndex(0);
    setTimeLeft(TECHNIQUES[selectedTech].phases[0].duration / 1000);
  };

  const stopBreathing = () => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    clearTimeout(phaseRef.current);
    clearInterval(timerRef.current);
    setTimeLeft(0);
  };

  // Run the sequence
  useEffect(() => {
    if (!isActive) return;

    const phase = technique.phases[currentPhaseIndex];
    setTimeLeft(phase.duration / 1000);

    // Countdown timer for display
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    // Phase transition timer
    phaseRef.current = setTimeout(() => {
      clearInterval(timerRef.current);
      setCurrentPhaseIndex((prev) => (prev + 1) % technique.phases.length);
    }, phase.duration);

    return () => {
      clearTimeout(phaseRef.current);
      clearInterval(timerRef.current);
    };
  }, [isActive, currentPhaseIndex, technique]);

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center">
        <h2 className="p-4 text-4xl font-bold bg-gradient-to-r from-teal-500 to-sky-600 bg-clip-text text-transparent flex justify-center items-center gap-3">
          <FaWind className="text-sky-500" />
          Guided Breathing
        </h2>
        <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
          Essential for stammering therapy. Controlled breathing calms the nervous system and relaxes the vocal cords, ensuring smoother speech.
        </p>
      </div>

      {/* Technique Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(TECHNIQUES).map(([key, tech]) => (
          <button
            key={key}
            onClick={() => handleTechniqueChange(key)}
            className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
              selectedTech === key 
                ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-400 dark:border-sky-500 shadow-lg'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-sky-300'
            }`}
          >
            <h3 className={`font-bold text-lg ${selectedTech === key ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {tech.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">{tech.description}</p>
          </button>
        ))}
      </div>

      {/* The Breathing Circle Visualization */}
      <div className="relative py-16 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[500px] shadow-inner">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-10 left-10 text-sky-200/50 text-6xl rotate-12"><FaLeaf /></div>
        <div className="absolute bottom-10 right-10 text-teal-200/50 text-8xl -rotate-45"><FaWind /></div>

        <div className="relative z-10 w-64 h-64 flex items-center justify-center">
          {/* Breathing Circle */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-80"
            style={{ backgroundColor: currentPhase.color }}
            animate={{ 
              scale: isActive ? currentPhase.scale : 1,
              backgroundColor: isActive ? currentPhase.color : 'rgb(203 213 225)' // slate-300 fallback
            }}
            transition={{ 
              duration: isActive ? (currentPhase.duration / 1000) : 0.5,
              ease: "linear"
            }}
          />

          {/* Inner Static Circle for Text */}
          <div className="absolute z-20 w-48 h-48 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-xl flex flex-col items-center justify-center p-4">
            {isActive ? (
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentPhase.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center"
                >
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-white uppercase tracking-widest mb-1" style={{ color: currentPhase.color }}>
                    {currentPhase.name}
                  </h3>
                  <div className="text-5xl font-mono text-slate-600 dark:text-slate-300 font-bold my-2">
                    {Math.ceil(timeLeft)}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center px-2">
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">Ready?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Click Start below when you are properly seated and relaxed.</p>
              </div>
            )}
          </div>
        </div>

        {/* Phase Instruction */}
        <div className="mt-16 h-8 text-center z-10">
          <AnimatePresence mode="wait">
             <motion.p
               key={isActive ? currentPhase.instruction : 'idle'}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="text-xl font-medium text-slate-600 dark:text-slate-300"
             >
               {isActive ? currentPhase.instruction : `${technique.name} sequence`}
             </motion.p>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-8 z-10">
          {!isActive ? (
            <button
              onClick={startBreathing}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 transform hover:scale-105"
            >
              <FaPlay /> Start Exercise
            </button>
          ) : (
            <button
              onClick={stopBreathing}
              className="px-8 py-4 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold text-lg shadow transition-all flex items-center gap-3"
            >
              <FaStop /> Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreathingView;
