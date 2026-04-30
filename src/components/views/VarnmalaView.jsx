// src/components/views/VarnmalaView.jsx - Matching ExercisesView color template

import { memo, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatTime } from "../../utilities/helpers";
import { FaPlay, FaPause, FaSave, FaCheckCircle } from "react-icons/fa";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";

// Varnmala data - memoized outside component
const VARNMALA_DATA = {
  swar: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ", "अं", "अः"],
  vyanjan: [
    "क",
    "ख",
    "ग",
    "घ",
    "ङ",
    "च",
    "छ",
    "ज",
    "झ",
    "ञ",
    "ट",
    "ठ",
    "ड",
    "ढ",
    "ण",
    "त",
    "थ",
    "द",
    "ध",
    "न",
    "प",
    "फ",
    "ब",
    "भ",
    "म",
    "य",
    "र",
    "ल",
    "व",
    "श",
    "ष",
    "स",
    "ह",
  ],
  sanyukt: ["क्ष", "त्र", "ज्ञ"],
};

// Color schemes matching ExercisesView
const sectionColors = {
  swar: {
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-500",
    glow: "shadow-violet-500/30",
    text: "text-violet-500",
  },
  vyanjan: {
    gradient: "from-cyan-500 to-blue-600",
    bg: "bg-cyan-500",
    glow: "shadow-cyan-500/30",
    text: "text-cyan-500",
  },
  sanyukt: {
    gradient: "from-pink-500 to-rose-600",
    bg: "bg-pink-500",
    glow: "shadow-pink-500/30",
    text: "text-pink-500",
  },
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
};

const letterVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

// Letter Card Component - Memoized for performance
const LetterCard = memo(({ char, category, isSpoken }) => {
  const colors = sectionColors[category];

  return (
    <motion.div
      variants={letterVariants}
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.95 }}
      className="group relative"
      tabIndex={0}
      aria-label={`Hindi letter ${char} ${isSpoken ? "- Spoken correctly" : ""}`}
      role="listitem"
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${colors.gradient} rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300`}
      />

      {/* Card */}
      <div
        className={`relative p-3 rounded-xl ${isSpoken ? "bg-emerald-50 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700" : "bg-white dark:bg-slate-800 border-slate-200/50 dark:border-slate-700/50"} border shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center min-w-[3rem]`}
      >
        {/* Top gradient accent */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${isSpoken ? "from-emerald-400 to-green-500" : colors.gradient} rounded-t-xl`}
        />

        <span
          aria-hidden="true"
          className={`text-xl md:text-2xl font-bold ${isSpoken ? "text-emerald-600 dark:text-emerald-400" : `bg-gradient-to-br ${colors.gradient} bg-clip-text text-transparent`}`}
        >
          {char}
        </span>
        {isSpoken && (
          <div className="absolute -top-2 -right-2">
            <FaCheckCircle className="text-emerald-500 text-sm bg-white rounded-full" />
          </div>
        )}
      </div>
    </motion.div>
  );
});

LetterCard.displayName = "LetterCard";

// Section Header Component
const SectionHeader = memo(({ title, subtitle, color }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${color}`} />
    <div>
      <h4 className="text-lg font-bold text-slate-800 dark:text-white">
        {title}
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  </div>
));

SectionHeader.displayName = "SectionHeader";

// Varnmala Display Component - Memoized
const VarnmalaDisplay = memo(({ transcript }) => {
  const isCharSpoken = useCallback(
    (char) => {
      if (!transcript) return false;
      return transcript.includes(char);
    },
    [transcript],
  );

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
      className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-xl"
    >
      {/* Top gradient accent bar */}
      <div className="h-2 bg-gradient-to-r from-violet-500 via-cyan-500 to-pink-500" />

      <div className="p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-3">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            Hindi Alphabet
          </div>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white">
            Devanagari Script
          </h3>
        </div>

        {/* Swar Section */}
        <div>
          <SectionHeader
            title="Vowels"
            subtitle="Swar (13)"
            color="from-violet-500 to-purple-600"
          />
          <motion.div
            role="list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-2 md:gap-3"
          >
            {VARNMALA_DATA.swar.map((char, index) => (
              <LetterCard
                key={`swar-${index}`}
                char={char}
                category="swar"
                isSpoken={isCharSpoken(char)}
              />
            ))}
          </motion.div>
        </div>

        {/* Vyanjan Section */}
        <div>
          <SectionHeader
            title="Consonants"
            subtitle="Vyanjan (33)"
            color="from-cyan-500 to-blue-600"
          />
          <motion.div
            role="list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-2 md:gap-3"
          >
            {VARNMALA_DATA.vyanjan.map((char, index) => (
              <LetterCard
                key={`vyanjan-${index}`}
                char={char}
                category="vyanjan"
                isSpoken={isCharSpoken(char)}
              />
            ))}
          </motion.div>
        </div>

        {/* Sanyukt Akshar Section */}
        <div>
          <SectionHeader
            title="Conjuncts"
            subtitle="Sanyukt Akshar (3)"
            color="from-pink-500 to-rose-600"
          />
          <motion.div
            role="list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-2 md:gap-3"
          >
            {VARNMALA_DATA.sanyukt.map((char, index) => (
              <LetterCard
                key={`sanyukt-${index}`}
                char={char}
                category="sanyukt"
                isSpoken={isCharSpoken(char)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

VarnmalaDisplay.displayName = "VarnmalaDisplay";

// Timer Ring Component - Matching ExercisesView style
const TimerRing = memo(({ time, isRunning }) => {
  const progress = useMemo(() => Math.min(time / 600, 1), [time]);

  return (
    <div className="relative w-48 h-48 md:w-56 md:h-56">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        {/* Background track */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          strokeWidth="8"
          className="text-slate-200 dark:text-slate-700"
          stroke="currentColor"
        />
        {/* Progress arc */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-purple-500"
          stroke="currentColor"
          strokeDasharray={`${progress * 339} 339`}
          style={{ transition: "stroke-dasharray 0.1s ease" }}
        />
      </svg>

      {/* Timer display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span
          aria-live="polite"
          className={`text-3xl md:text-4xl font-bold font-mono tracking-wider ${isRunning ? "text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}
        >
          {formatTime(time)}
        </span>
        {isRunning && (
          <span className="text-[10px] text-green-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Running
          </span>
        )}
      </div>
    </div>
  );
});

TimerRing.displayName = "TimerRing";

const VarnmalaView = ({
  varnmalaTimer,
  showVarnmala,
  startVarnmalaTimer,
  pauseVarnmalaTimer,
  stopVarnmalaTimer,
}) => {
  const {
    isListening,
    startListening,
    stopListening,
    fullTranscript,
    resetTranscript,
  } = useSpeechRecognition("hi-IN");

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  const handleStart = () => {
    try {
      resetTranscript();
      startListening();
      startVarnmalaTimer();
    } catch (err) {
      console.error(err);
      startVarnmalaTimer();
      startListening();
    }
  };

  const handlePause = () => {
    stopListening();
    pauseVarnmalaTimer();
  };

  const handleRecord = useCallback(() => {
    stopListening();
    stopVarnmalaTimer(true);
  }, [stopVarnmalaTimer, stopListening]);

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
          Alphabet Practice
        </div>
        <h2 className="text-4xl font-bold text-slate-800 dark:text-white">
          Alphabet Practice
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Track your speed and consistency while reciting the Hindi alphabet
        </p>
      </motion.div>

      {/* Timer Card */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-xl max-w-md mx-auto"
      >
        {/* Top gradient accent bar */}
        <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />

        <div className="p-6 md:p-8 flex flex-col items-center gap-6">
          <TimerRing
            time={varnmalaTimer.time}
            isRunning={varnmalaTimer.isRunning}
          />

          <div className="h-16 flex flex-col items-center justify-center w-full max-w-[280px]">
            <div className="h-10" />
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {/* Play button */}
            <motion.button
              aria-label="Start Varnmala Practice"
              onClick={handleStart}
              disabled={varnmalaTimer.isRunning}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-medium shadow-lg transition-all ${
                varnmalaTimer.isRunning
                  ? "bg-slate-300 dark:bg-slate-600 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-br from-emerald-500 to-green-600 hover:shadow-emerald-500/40 hover:scale-105"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay className="ml-0.5" />
            </motion.button>

            {/* Pause button */}
            <motion.button
              aria-label="Pause Varnmala Practice"
              onClick={handlePause}
              disabled={!varnmalaTimer.isRunning}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-medium shadow-lg transition-all ${
                !varnmalaTimer.isRunning
                  ? "bg-slate-300 dark:bg-slate-600 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-br from-amber-500 to-orange-600 hover:shadow-amber-500/40 hover:scale-105"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <FaPause />
            </motion.button>

            {/* Save button */}
            <motion.button
              aria-label="Save Practice Session"
              onClick={handleRecord}
              disabled={varnmalaTimer.time === 0}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-medium shadow-lg transition-all ${
                varnmalaTimer.time === 0
                  ? "bg-slate-300 dark:bg-slate-600 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-br from-purple-500 to-pink-600 hover:shadow-purple-500/40 hover:scale-105"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <FaSave />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center">
        {/* Varnmala Display */}
        <div className="max-w-4xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {showVarnmala && <VarnmalaDisplay transcript={fullTranscript} />}
          </AnimatePresence>
        </div>
      </div>

      {/* Tip section - matching ExercisesView */}
      <motion.div
        variants={itemVariants}
        className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/50"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg flex-shrink-0">
            💡
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white mb-1">
              Pro Tip
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Practice reciting the full alphabet smoothly. Focus on clear
              pronunciation and try to improve your time with each session!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default memo(VarnmalaView);
