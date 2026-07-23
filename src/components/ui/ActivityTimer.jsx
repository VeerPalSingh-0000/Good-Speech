// src/components/ui/ActivityTimer.jsx
// Reusable countdown timer for program activities

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaRedo, FaCheck } from 'react-icons/fa';

const ActivityTimer = memo(({ 
  id,
  durationMinutes, 
  onComplete, 
  onUndo,
  isCompleted = false,
  accentColor = 'indigo',
  size = 'md' // 'sm' | 'md' | 'lg'
}) => {
  const totalSeconds = durationMinutes * 60;
  
  // Persist timer state across navigation
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!id) return totalSeconds;
    const saved = sessionStorage.getItem(`timer-${id}-timeLeft`);
    const savedTime = sessionStorage.getItem(`timer-${id}-lastTick`);
    const wasRunning = sessionStorage.getItem(`timer-${id}-isRunning`) === 'true';
    
    if (saved !== null && savedTime !== null) {
      const elapsedSinceSaved = wasRunning ? Math.floor((Date.now() - parseInt(savedTime)) / 1000) : 0;
      return Math.max(0, parseInt(saved) - elapsedSinceSaved);
    }
    return totalSeconds;
  });

  const [isRunning, setIsRunning] = useState(() => {
    if (!id) return false;
    return sessionStorage.getItem(`timer-${id}-isRunning`) === 'true';
  });
  
  const [hasFinished, setHasFinished] = useState(isCompleted);
  const intervalRef = useRef(null);

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 54; // r=54 matching existing SVG style

  useEffect(() => {
    if (isCompleted) {
      setHasFinished(true);
      setTimeLeft(0);
    }
  }, [isCompleted]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setHasFinished(true);
            onComplete?.();
            if (id) {
              sessionStorage.removeItem(`timer-${id}-timeLeft`);
              sessionStorage.removeItem(`timer-${id}-lastTick`);
              sessionStorage.removeItem(`timer-${id}-isRunning`);
            }
            return 0;
          }
          if (id) {
            sessionStorage.setItem(`timer-${id}-timeLeft`, prev - 1);
            sessionStorage.setItem(`timer-${id}-lastTick`, Date.now());
          }
          return prev - 1;
        });
      }, 1000);
    } else if (id && !isRunning) {
      sessionStorage.setItem(`timer-${id}-isRunning`, 'false');
      sessionStorage.setItem(`timer-${id}-timeLeft`, timeLeft);
      sessionStorage.setItem(`timer-${id}-lastTick`, Date.now());
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, onComplete, id]);

  const handleStart = useCallback(() => {
    if (hasFinished) return;
    setIsRunning(true);
    if (id) sessionStorage.setItem(`timer-${id}-isRunning`, 'true');
  }, [hasFinished, id]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    if (id) sessionStorage.setItem(`timer-${id}-isRunning`, 'false');
  }, [id]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setHasFinished(false);
    setTimeLeft(totalSeconds);
    clearInterval(intervalRef.current);
    if (id) {
      sessionStorage.removeItem(`timer-${id}-timeLeft`);
      sessionStorage.removeItem(`timer-${id}-lastTick`);
      sessionStorage.removeItem(`timer-${id}-isRunning`);
    }
  }, [totalSeconds, id]);

  const handleMarkDone = useCallback(() => {
    setIsRunning(false);
    setHasFinished(true);
    setTimeLeft(0);
    clearInterval(intervalRef.current);
    if (id) {
      sessionStorage.removeItem(`timer-${id}-timeLeft`);
      sessionStorage.removeItem(`timer-${id}-lastTick`);
      sessionStorage.removeItem(`timer-${id}-isRunning`);
    }
    onComplete?.();
  }, [onComplete, id]);

  const formatTimerDisplay = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const sizeClasses = {
    sm: { ring: 'w-20 h-20', text: 'text-lg', btnSize: 'w-8 h-8 text-xs' },
    md: { ring: 'w-28 h-28', text: 'text-3xl', btnSize: 'w-10 h-10 text-sm' },
    lg: { ring: 'w-36 h-36', text: 'text-4xl', btnSize: 'w-12 h-12 text-base' },
  };

  const s = sizeClasses[size];

  // Color maps
  const colorMap = {
    emerald: { ring: 'text-emerald-500', bg: 'bg-emerald-500', btn: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50 dark:bg-emerald-900/20' },
    blue: { ring: 'text-blue-500', bg: 'bg-blue-500', btn: 'from-blue-500 to-indigo-600', light: 'bg-blue-50 dark:bg-blue-900/20' },
    purple: { ring: 'text-purple-500', bg: 'bg-purple-500', btn: 'from-purple-500 to-violet-600', light: 'bg-purple-50 dark:bg-purple-900/20' },
    rose: { ring: 'text-rose-500', bg: 'bg-rose-500', btn: 'from-rose-500 to-red-600', light: 'bg-rose-50 dark:bg-rose-900/20' },
    indigo: { ring: 'text-indigo-500', bg: 'bg-indigo-500', btn: 'from-indigo-500 to-purple-600', light: 'bg-indigo-50 dark:bg-indigo-900/20' },
  };

  const colors = colorMap[accentColor] || colorMap.indigo;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Timer Ring */}
      <div className={`relative ${s.ring}`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60" cy="60" r="54"
            fill="none" strokeWidth="6"
            className="text-slate-200 dark:text-slate-700"
            stroke="currentColor"
          />
          <circle
            cx="60" cy="60" r="54"
            fill="none" strokeWidth="6"
            strokeLinecap="round"
            className={colors.ring}
            stroke="currentColor"
            strokeDasharray={`${(progress / 100) * circumference} ${circumference}`}
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {hasFinished ? (
              <motion.div
                key="done"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`${colors.ring}`}
              >
                <FaCheck className={`${s.text}`} />
              </motion.div>
            ) : (
              <motion.span
                key="timer"
                className={`${s.text} font-black font-display tracking-tight ${
                  isRunning ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {formatTimerDisplay(timeLeft)}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {!hasFinished && (
          <>
            {!isRunning ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleStart}
                className={`${s.btnSize} rounded-full bg-gradient-to-br ${colors.btn} text-white flex items-center justify-center shadow-lg`}
              >
                <FaPlay className="ml-0.5" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handlePause}
                className={`${s.btnSize} rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg`}
              >
                <FaPause />
              </motion.button>
            )}

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleReset}
              className={`${s.btnSize} rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center`}
            >
              <FaRedo />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleMarkDone}
              className={`${s.btnSize} rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-lg`}
              title="Mark as done"
            >
              <FaCheck />
            </motion.button>
          </>
        )}

        {hasFinished && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              handleReset();
              onUndo?.();
            }}
            className={`px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5`}
          >
            <FaRedo className="text-[10px]" /> {isCompleted ? 'Redo Task' : 'Restart'}
          </motion.button>
        )}
      </div>
    </div>
  );
});

ActivityTimer.displayName = 'ActivityTimer';

export default ActivityTimer;
