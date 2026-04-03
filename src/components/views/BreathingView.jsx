import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaPlay, FaStop, FaWind } from "react-icons/fa";

const TECHNIQUES = {
  "4-7-8": {
    name: "4-7-8 Relax",
    phases: [
      {
        name: "Inhale",
        duration: 4000,
        instruction: "Breathe in quietly",
        scale: 1.35,
        color: "rgb(56 189 248)",
      },
      {
        name: "Hold",
        duration: 7000,
        instruction: "Hold gently",
        scale: 1.35,
        color: "rgb(14 165 233)",
      },
      {
        name: "Exhale",
        duration: 8000,
        instruction: "Exhale fully",
        scale: 1,
        color: "rgb(2 132 199)",
      },
    ],
  },
  box: {
    name: "Box Breathing",
    phases: [
      {
        name: "Inhale",
        duration: 4000,
        instruction: "Breathe in slowly",
        scale: 1.35,
        color: "rgb(52 211 153)",
      },
      {
        name: "Hold",
        duration: 4000,
        instruction: "Hold softly",
        scale: 1.35,
        color: "rgb(16 185 129)",
      },
      {
        name: "Exhale",
        duration: 4000,
        instruction: "Breathe out slowly",
        scale: 1,
        color: "rgb(5 150 105)",
      },
      {
        name: "Hold",
        duration: 4000,
        instruction: "Pause",
        scale: 1,
        color: "rgb(4 120 87)",
      },
    ],
  },
  diaphragmatic: {
    name: "Belly Breathing",
    phases: [
      {
        name: "Inhale",
        duration: 3000,
        instruction: "Belly expands",
        scale: 1.45,
        color: "rgb(192 132 252)",
      },
      {
        name: "Exhale",
        duration: 6000,
        instruction: "Belly falls",
        scale: 1,
        color: "rgb(147 51 234)",
      },
    ],
  },
};

const BreathingView = () => {
  const [selectedTech, setSelectedTech] = useState("4-7-8");
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const phaseRef = useRef(null);
  const timerRef = useRef(null);

  const technique = TECHNIQUES[selectedTech];
  const currentPhase = technique.phases[currentPhaseIndex];
  const phaseDuration = currentPhase?.duration || 1;
  const phaseProgress = isActive
    ? Math.min(
        100,
        Math.max(
          0,
          ((phaseDuration / 1000 - timeLeft) / (phaseDuration / 1000)) * 100,
        ),
      )
    : 0;

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

  useEffect(() => {
    if (!isActive) return;

    const phase = technique.phases[currentPhaseIndex];
    setTimeLeft(phase.duration / 1000);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-sky-700 dark:text-sky-300">
          <FaWind />
          Guided Breathing
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Slow, steady breathing
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {Object.entries(TECHNIQUES).map(([key, tech]) => {
          const selected = selectedTech === key;

          return (
            <button
              key={key}
              onClick={() => handleTechniqueChange(key)}
              className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                selected
                  ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              }`}
            >
              <div className="text-sm font-semibold">{tech.name}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {technique.name}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {isActive ? currentPhase.instruction : "Tap start to begin"}
            </p>
          </div>

          <div className="text-right text-sm font-medium text-slate-500 dark:text-slate-400">
            {isActive ? `${Math.ceil(timeLeft)}s` : "Idle"}
          </div>
        </div>

        <div className="relative mx-auto mt-8 flex max-w-sm items-center justify-center py-6">
          <motion.div
            className="absolute inset-8 rounded-full bg-sky-100 blur-2xl dark:bg-sky-900/30"
            animate={{
              scale: isActive ? currentPhase.scale * 1.04 : 1,
              opacity: isActive ? 0.9 : 0.45,
              backgroundColor: isActive
                ? currentPhase.color
                : "rgb(226 232 240)",
            }}
            transition={{
              duration: isActive ? currentPhase.duration / 1000 : 0.8,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="relative flex aspect-square w-64 items-center justify-center rounded-full bg-slate-100 shadow-inner dark:bg-slate-900 sm:w-72"
            animate={{
              scale: isActive ? currentPhase.scale : 1,
              backgroundColor: isActive
                ? currentPhase.color
                : "rgb(241 245 249)",
            }}
            transition={{
              duration: isActive ? currentPhase.duration / 1000 : 0.8,
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-[18%] rounded-full border border-white/40 bg-white/35 backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/30">
              {isActive ? (
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={currentPhase.name}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.25 }}
                    className="flex h-full flex-col items-center justify-center text-center"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-600 dark:text-slate-300">
                      {currentPhase.name}
                    </div>
                    <div className="mt-2 text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
                      {Math.ceil(timeLeft)}
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                    Ready
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                    Start
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Keep the exhale longer than the inhale.
          </div>

          {!isActive ? (
            <button
              onClick={startBreathing}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <FaPlay className="text-xs" />
              Start
            </button>
          ) : (
            <button
              onClick={stopBreathing}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <FaStop className="text-xs" />
              Stop
            </button>
          )}
        </div>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <motion.div
            className="h-full rounded-full bg-slate-900 dark:bg-white"
            animate={{ width: `${phaseProgress}%` }}
            transition={{ duration: 0.2, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
};

export default BreathingView;
