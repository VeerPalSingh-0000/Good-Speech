import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaStop, FaWind, FaLeaf, FaSpa } from 'react-icons/fa';

// Pre-defined breathing techniques
const TECHNIQUES = {
  '4-7-8': {
    name: '4-7-8 Relax',
    description: 'Calms the nervous system, helpful for stammering anxiety.',
    phases: [
      { name: 'Inhale', duration: 4000, instruction: 'Breathe in quietly through your nose', scale: 1.4, color: 'rgb(56 189 248)' }, // sky-400
      { name: 'Hold', duration: 7000, instruction: 'Hold your breath', scale: 1.4, color: 'rgb(14 165 233)' },     // sky-500
      { name: 'Exhale', duration: 8000, instruction: 'Exhale completely through your mouth', scale: 1, color: 'rgb(2 132 199)' } // sky-600
    ]
  },
  'box': {
    name: 'Box Breathing',
    description: 'Equalizes breathing, restores natural rhythm and focus.',
    phases: [
      { name: 'Inhale', duration: 4000, instruction: 'Breathe in slowly', scale: 1.4, color: 'rgb(52 211 153)' },   // emerald-400
      { name: 'Hold', duration: 4000, instruction: 'Hold the air in', scale: 1.4, color: 'rgb(16 185 129)' },     // emerald-500
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
    <div className="space-y-8 pb-10 max-w-5xl mx-auto px-4">
      {/* Header Section */}
      <div className="text-center mt-6">
        <h2 className="p-4 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-teal-400 via-sky-500 to-indigo-500 bg-clip-text text-transparent flex justify-center items-center gap-3 drop-shadow-sm">
          <FaWind className="text-sky-500" />
          Guided Breathing
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-2xl mx-auto text-sm sm:text-base px-2">
          Essential for stammering therapy. Controlled breathing calms the nervous system and relaxes the vocal cords, ensuring smoother speech.
        </p>
      </div>

      {/* Technique Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mt-8">
        {Object.entries(TECHNIQUES).map(([key, tech]) => (
          <button
            key={key}
            onClick={() => handleTechniqueChange(key)}
            className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center gap-3 group relative overflow-hidden ${
              selectedTech === key 
                ? 'bg-gradient-to-br from-sky-50 to-white dark:from-sky-900/30 dark:to-slate-800 border-sky-400 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transform -translate-y-1'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-sky-300 hover:shadow-md'
            }`}
          >
            {/* Subtle background icon */}
            <FaSpa className={`absolute -bottom-4 -right-4 text-6xl opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12 ${selectedTech === key ? 'text-sky-500 opacity-[0.08]' : 'text-slate-500'}`} />
            
            <h3 className={`font-bold text-lg sm:text-xl z-10 ${selectedTech === key ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {tech.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center z-10 leading-relaxed">
              {tech.description}
            </p>
          </button>
        ))}
      </div>

      {/* The Breathing Circle Visualization */}
      <div className="relative py-20 px-4 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden min-h-[550px]">
        
        {/* Soft Background Mesh/Gradient elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-[2.5rem]">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-sky-200/20 dark:bg-sky-900/20 blur-[100px]" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-teal-200/20 dark:bg-teal-900/20 blur-[100px]" />
        </div>

        <div className="absolute top-8 left-8 text-sky-200/40 dark:text-sky-800/40 text-4xl sm:text-6xl rotate-12"><FaLeaf /></div>
        <div className="absolute bottom-12 right-12 text-teal-200/40 dark:text-teal-800/40 text-6xl sm:text-8xl -rotate-45"><FaWind /></div>

        {/* The Core Breathing Element */}
        <div className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          
          {/* Glowing Aura (Behind the bubble) */}
          <motion.div
            className="absolute inset-0 rounded-full blur-2xl opacity-60"
            animate={{ 
              scale: isActive ? currentPhase.scale * 1.1 : 1,
              backgroundColor: isActive ? currentPhase.color : 'rgb(226 232 240)' 
            }}
            transition={{ 
              duration: isActive ? (currentPhase.duration / 1000) : 1,
              ease: "easeInOut" 
            }}
          />

          {/* Main Breathing Bubble */}
          <motion.div
            className="absolute inset-0 rounded-full shadow-[inset_0_-10px_20px_rgba(0,0,0,0.1),_0_10px_20px_rgba(0,0,0,0.05)]"
            animate={{ 
              scale: isActive ? currentPhase.scale : 1,
              backgroundColor: isActive ? currentPhase.color : 'rgb(241 245 249)', // slate-100 fallback
            }}
            transition={{ 
              duration: isActive ? (currentPhase.duration / 1000) : 1,
              ease: "easeInOut" // Natural breathing curve
            }}
          >
             {/* Bubble Gloss Highlight */}
             <div className="absolute top-[10%] left-[15%] w-[30%] h-[30%] rounded-full bg-white opacity-30 blur-[8px]" />
          </motion.div>

          {/* Inner Static Circle for Text (Glassmorphism) */}
          <div className="absolute z-20 w-[65%] h-[65%] sm:w-[55%] sm:h-[55%] bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/60 dark:border-slate-600/50 flex flex-col items-center justify-center p-4">
            {isActive ? (
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentPhase.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center w-full flex flex-col items-center"
                >
                  <h3 
                    className="text-xl sm:text-2xl font-extrabold uppercase tracking-widest mb-1 drop-shadow-sm" 
                    style={{ color: currentPhase.color }}
                  >
                    {currentPhase.name}
                  </h3>
                  <div className="text-5xl sm:text-6xl font-mono text-slate-800 dark:text-white font-bold my-1 tracking-tighter">
                    {Math.ceil(timeLeft)}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center px-2 flex flex-col items-center">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-700 dark:text-slate-200 mb-1">Ready?</h3>
                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium leading-tight">Click Start</p>
              </div>
            )}
          </div>
        </div>

        {/* Phase Instruction & Controls Container */}
        <div className="absolute bottom-8 w-full px-6 flex flex-col items-center z-20">
          
          {/* Phase Instruction Text */}
          <div className="h-12 mb-4 flex items-center justify-center text-center">
            <AnimatePresence mode="wait">
               <motion.p
                 key={isActive ? currentPhase.instruction : 'idle'}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="text-lg sm:text-xl font-semibold text-slate-600 dark:text-slate-300 max-w-sm"
               >
                 {isActive ? currentPhase.instruction : `Prepare for ${technique.name}`}
               </motion.p>
            </AnimatePresence>
          </div>

          {/* Action Button */}
          {!isActive ? (
            <button
              onClick={startBreathing}
              className="px-10 py-4 sm:py-5 rounded-full bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-bold text-lg sm:text-xl shadow-[0_10px_25px_rgba(14,165,233,0.4)] hover:shadow-[0_15px_35px_rgba(14,165,233,0.5)] transition-all flex items-center gap-3 transform hover:-translate-y-1 active:translate-y-0"
            >
              <FaPlay className="text-xl" /> Begin Session
            </button>
          ) : (
            <button
              onClick={stopBreathing}
              className="px-10 py-4 sm:py-5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 font-bold text-lg sm:text-xl shadow-lg transition-all flex items-center gap-3 transform hover:-translate-y-1 active:translate-y-0"
            >
              <FaStop className="text-xl text-rose-500" /> Stop
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default BreathingView;