import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWind } from "react-icons/fa";

const TECHNIQUES = {
  "4-7-8": {
    name: "4-7-8 Relax",
    phases: [
      { name: "Inhale", duration: 4000, instruction: "Inhale through nose" },
      { name: "Hold", duration: 7000, instruction: "Hold gently" },
      { name: "Exhale", duration: 8000, instruction: "Exhale slowly" },
    ],
  },
  box: {
    name: "Box Breathing",
    phases: [
      { name: "Inhale", duration: 4000, instruction: "Breathe in" },
      { name: "Hold", duration: 4000, instruction: "Hold" },
      { name: "Exhale", duration: 4000, instruction: "Breathe out" },
      { name: "Hold", duration: 4000, instruction: "Pause" },
    ],
  },
  diaphragmatic: {
    name: "Belly Breathing",
    phases: [
      { name: "Inhale", duration: 4000, instruction: "Expand belly" },
      { name: "Exhale", duration: 6000, instruction: "Relax belly" },
    ],
  },
};

export default function BreathingView() {
  const [selectedTech, setSelectedTech] = useState("4-7-8");
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

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

  const scale =
    currentPhase?.name === "Inhale"
      ? 1.3
      : currentPhase?.name === "Exhale"
        ? 1
        : 1.3;

  return (
    <div className="flex-1 h-full w-full bg-black text-white flex flex-col items-center justify-center px-4 overflow-hidden pt-4 pb-24 sm:pb-4">
      {/* Technique Selector */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 lg:mb-12 text-[10px] sm:text-xs uppercase tracking-widest text-center">
        {Object.entries(TECHNIQUES).map(([key, tech]) => (
          <button
            key={key}
            onClick={() => {
              if (isActive) stop();
              setSelectedTech(key);
            }}
            className={`pb-1 border-b ${
              selectedTech === key
                ? "text-teal-400 border-teal-400"
                : "text-gray-500 border-transparent"
            }`}
          >
            {tech.name}
          </button>
        ))}
      </div>

      {/* Breathing Circle */}
      <div className="relative flex items-center justify-center h-[220px] w-[220px] sm:h-[280px] sm:w-[280px] my-4">
        <motion.div
          className="absolute rounded-full border border-teal-400/30"
          style={{ width: "100%", height: "100%" }}
          animate={{
            scale: isActive ? scale : 1,
            opacity: isActive ? 1 : 0.3,
          }}
          transition={{
            duration: currentPhase?.duration / 1000 || 1,
            ease: "easeInOut",
          }}
        />

        {/* Content */}
        <div className="text-center z-10 mx-auto max-w-[200px]">
          {isActive ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhase.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-xs sm:text-sm text-teal-300 mb-2 tracking-widest">
                  {currentPhase.name}
                </p>

                <p className="text-5xl sm:text-6xl font-light font-mono">
                  {Math.ceil(timeLeft)}
                </p>

                <p className="text-[10px] sm:text-xs text-gray-400 mt-3 truncate px-2">
                  {currentPhase.instruction}
                </p>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-gray-500">
              <FaWind className="text-3xl mx-auto mb-3 opacity-30" />
              <p className="text-[10px] sm:text-xs tracking-widest px-2">
                Tap Start to Begin
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={isActive ? stop : start}
        className="mt-10 lg:mt-12 w-full max-w-[240px] sm:max-w-xs py-3.5 rounded-xl border border-gray-800 text-xs sm:text-sm tracking-widest uppercase transition-all active:scale-95"
      >
        {isActive ? (
          <span className="text-gray-400">Stop</span>
        ) : (
          <span className="text-teal-400">Start {technique.name}</span>
        )}
      </button>
    </div>
  );
}
