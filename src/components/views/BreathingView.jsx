import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWind, FaArrowLeft, FaPlay, FaStop } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TECHNIQUES = {
  "4-7-8": {
    name: "4-7-8 Relax",
    phases: [
      { name: "Inhale", duration: 4000, instruction: "Inhale through nose", scale: 1.25 },
      { name: "Hold", duration: 7000, instruction: "Hold gently", scale: 1.25 },
      { name: "Exhale", duration: 8000, instruction: "Exhale slowly", scale: 1 },
    ],
  },
  box: {
    name: "Box Breathing",
    phases: [
      { name: "Inhale", duration: 4000, instruction: "Breathe in", scale: 1.25 },
      { name: "Hold", duration: 4000, instruction: "Hold", scale: 1.25 },
      { name: "Exhale", duration: 4000, instruction: "Breathe out", scale: 1 },
      { name: "Hold", duration: 4000, instruction: "Pause", scale: 1 },
    ],
  },
  diaphragmatic: {
    name: "Belly Breathing",
    phases: [
      { name: "Inhale", duration: 4000, instruction: "Expand belly", scale: 1.25 },
      { name: "Exhale", duration: 6000, instruction: "Relax belly", scale: 1 },
    ],
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function BreathingView({ embedded = false }) {
  const [selectedTech, setSelectedTech] = useState("4-7-8");
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  const timerRef = useRef(null);
  const phaseTimeoutRef = useRef(null);

  const technique = TECHNIQUES[selectedTech];
  const currentPhase = technique.phases[phaseIndex];

  const start = () => {
    setIsActive(true);
    setPhaseIndex(0);
  };

  const stop = () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    clearTimeout(phaseTimeoutRef.current);
    setTimeLeft(0);
    setPhaseIndex(0);
  };

  useEffect(() => {
    if (!isActive) return;

    const phase = technique.phases[phaseIndex];
    const durationSec = phase.duration / 1000;

    setTimeLeft(durationSec);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    phaseTimeoutRef.current = setTimeout(() => {
      clearInterval(timerRef.current);
      setPhaseIndex((prev) => (prev + 1) % technique.phases.length);
    }, phase.duration);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(phaseTimeoutRef.current);
    };
  }, [isActive, phaseIndex, technique]);

  const scale = currentPhase?.scale || 1;

  const progress = useMemo(() => {
    if (!isActive) return 0;
    const phase = technique.phases[phaseIndex];
    const durationSec = phase.duration / 1000;
    return Math.max(0, Math.min(1, 1 - (timeLeft / durationSec)));
  }, [isActive, phaseIndex, technique, timeLeft]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={embedded ? "space-y-6 pb-4" : "space-y-10"}
    >
      {!embedded && (
        <motion.div variants={itemVariants} className="w-full flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors btn-gamified"
          >
            <FaArrowLeft />
          </button>
        </motion.div>
      )}

      {!embedded && (
        <motion.div variants={itemVariants} className="text-center space-y-3 -mt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-sm font-medium">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            Relaxation
          </div>
          <h2 className="text-4xl font-display font-extrabold text-slate-800 dark:text-white">
            Breathing Exercises
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-display">
            Control your breath to calm your mind and improve fluency.
          </p>
        </motion.div>
      )}

      {/* Technique Selector */}
      <motion.div variants={itemVariants} className="flex overflow-x-auto hide-scrollbar gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full max-w-lg mx-auto shadow-inner">
        {Object.entries(TECHNIQUES).map(([key, tech]) => (
          <button
            key={key}
            onClick={() => {
              if (isActive) stop();
              setSelectedTech(key);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedTech === key
                ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
          >
            {tech.name}
          </button>
        ))}
      </motion.div>

      {/* Main Breathing Area */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-xl max-w-md mx-auto p-8 md:p-12">
        <div className="h-2 absolute top-0 left-0 right-0 bg-gradient-to-r from-teal-400 to-emerald-500" />
        
        {/* Breathing Circle */}
        <div className="relative flex items-center justify-center h-[200px] w-[200px] sm:h-[240px] sm:w-[240px] mx-auto my-10 sm:my-12">
          <div
            className={`absolute rounded-full border-[6px] ${isActive ? 'border-teal-400/80 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-700'}`}
            style={{ 
              width: "100%", 
              height: "100%",
              transform: `scale(${isActive ? scale : 1})`,
              opacity: isActive ? 1 : 0.6,
              transition: isActive 
                ? `transform ${currentPhase?.duration}ms linear, opacity 400ms ease` 
                : `transform 1s ease, opacity 1s ease`
            }}
          />

          {/* Content inside circle */}
          <div className="text-center z-10 mx-auto w-full px-4">
            {isActive ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhase.name}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm font-bold text-teal-600 dark:text-teal-400 mb-2 tracking-widest uppercase">
                    {currentPhase.name}
                  </p>

                  <p className="text-6xl font-light font-mono text-slate-800 dark:text-white">
                    {Math.ceil(timeLeft)}
                  </p>

                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-4 truncate px-2">
                    {currentPhase.instruction}
                  </p>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-slate-400 dark:text-slate-500 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                  <FaWind className="text-2xl text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-sm font-bold tracking-widest uppercase">
                  Ready to start
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center mt-8">
          <button
            onClick={isActive ? stop : start}
            className={`px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all w-full sm:w-auto btn-gamified ${isActive
                ? "bg-rose-500 hover:bg-rose-400 text-white"
                : "bg-teal-500 hover:bg-teal-400 text-white"
              }`}
          >
            {isActive ? (
              <>
                <FaStop /> Stop
              </>
            ) : (
              <>
                <FaPlay /> Start
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
