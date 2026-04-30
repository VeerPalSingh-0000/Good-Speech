// src/components/views/DayDetailView.jsx
// Individual day practice screen with activities, timers, and completion tracking

import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowLeft, FaArrowRight, FaCheckCircle, FaPlay, FaClock,
  FaWind, FaBookOpen, FaLayerGroup, FaComments, FaUser,
  FaChevronDown, FaChevronUp, FaExternalLinkAlt
} from 'react-icons/fa';
import confetti from 'canvas-confetti';
import { getDayData, getWeekForDay, getDayTotalDuration, GOLDEN_HABITS } from '../../data/programData';
import ActivityTimer from '../ui/ActivityTimer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
};

// Activity icon map
const activityIcons = {
  breathing: FaWind,
  reading: FaBookOpen,
  tongueTwisters: FaLayerGroup,
  speaking: FaComments,
};

// Week color maps for styling
const colorMap = {
  emerald: {
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-500',
    light: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    ring: 'ring-emerald-500',
  },
  blue: {
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-500',
    light: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    ring: 'ring-blue-500',
  },
  purple: {
    gradient: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-500',
    light: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
    ring: 'ring-purple-500',
  },
  rose: {
    gradient: 'from-rose-500 to-red-600',
    bg: 'bg-rose-500',
    light: 'bg-rose-50 dark:bg-rose-900/20',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800',
    ring: 'ring-rose-500',
  },
};

// Single Activity Card component
const ActivityCard = memo(({ activity, index, isCompleted, onComplete, weekColor, onNavigate }) => {
  const [expanded, setExpanded] = useState(false);
  const colors = colorMap[weekColor] || colorMap.emerald;
  const Icon = activityIcons[activity.type] || FaPlay;

  return (
    <motion.div
      variants={itemVariants}
      className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
        isCompleted
          ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
          : `bg-white dark:bg-slate-800 ${colors.border}`
      } shadow-sm`}
    >
      {/* Card Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center gap-4 text-left"
      >
        {/* Step number */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          isCompleted
            ? 'bg-emerald-100 dark:bg-emerald-900/30'
            : colors.light
        }`}>
          {isCompleted ? (
            <FaCheckCircle className="text-emerald-500 text-lg" />
          ) : (
            <Icon className={`${colors.text} text-lg`} />
          )}
        </div>

        {/* Title & meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`font-bold text-sm ${isCompleted ? 'text-emerald-700 dark:text-emerald-400 line-through' : 'text-slate-800 dark:text-white'}`}>
              {activity.titleEn || activity.title}
            </h4>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">{activity.title}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <FaClock className="text-[9px]" /> {activity.duration} min
            </span>
            {activity.linkedView && (
              <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-medium">
                ↗ App Link
              </span>
            )}
          </div>
        </div>

        {/* Expand indicator */}
        <div className="text-slate-400 shrink-0">
          {expanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {/* Divider */}
              <div className="border-t border-slate-100 dark:border-slate-700" />

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  📝 {activity.instructionsEn || activity.instructions}
                </p>
                {activity.instructionsEn && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">
                    {activity.instructions}
                  </p>
                )}
              </div>

              {/* Sentences (for breathing exercises) */}
              {activity.sentences && activity.sentences.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Practice Sentences</p>
                  {activity.sentences.map((sentence, i) => (
                    <div key={i} className={`p-3 rounded-xl ${colors.light} text-sm font-medium`}>
                      <span className={colors.text}>👉</span> {sentence}
                    </div>
                  ))}
                </div>
              )}

              {/* Speaking prompt */}
              {activity.prompt && (
                <div className={`p-4 rounded-xl ${colors.light}`}>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Today's Task</p>
                  <p className={`text-base font-bold ${colors.text}`}>
                    {activity.prompt.english || activity.prompt.hindi}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {activity.prompt.hindi}
                  </p>
                </div>
              )}

              {/* Target WPM (for reading) */}
              {activity.targetWPM && (
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${colors.light} text-xs font-semibold ${colors.text}`}>
                  🎯 Target Speed: {activity.targetWPM} WPM
                </div>
              )}

              {/* Timer + Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <ActivityTimer
                  durationMinutes={activity.duration}
                  onComplete={() => onComplete(activity.id)}
                  isCompleted={isCompleted}
                  accentColor={weekColor}
                  size="md"
                />

                {/* Link to App Feature */}
                {activity.linkedView && !isCompleted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(activity.linkedView);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${colors.gradient} text-white text-sm font-medium shadow-md hover:shadow-lg transition-all`}
                  >
                    <FaExternalLinkAlt className="text-xs" />
                    Open in App
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
ActivityCard.displayName = 'ActivityCard';

const DayDetailView = ({ userSettings, updateUserSettings, setCurrentView }) => {
  const navigate = useNavigate();
  const { dayNumber } = useParams();
  const dayNum = parseInt(dayNumber, 10);

  const dayData = useMemo(() => getDayData(dayNum), [dayNum]);
  const weekData = useMemo(() => getWeekForDay(dayNum), [dayNum]);
  const totalDuration = useMemo(() => getDayTotalDuration(dayNum), [dayNum]);

  const programProgress = userSettings?.programProgress || {
    currentDay: 1,
    startDate: null,
    completedDays: {},
  };

  const dayProgress = programProgress.completedDays?.[dayNum] || null;
  const [completedActivities, setCompletedActivities] = useState(
    dayProgress?.activities || {}
  );
  const [dayCompleted, setDayCompleted] = useState(!!dayProgress?.completedAt);

  const colors = colorMap[weekData?.color] || colorMap.emerald;

  // Count completed
  const activitiesTotal = dayData?.activities?.length || 0;
  const activitiesCompleted = Object.keys(completedActivities).filter(k => completedActivities[k]).length;
  const allDone = activitiesCompleted === activitiesTotal && activitiesTotal > 0;

  // Check if all activities are done → mark day complete
  useEffect(() => {
    if (allDone && !dayCompleted) {
      setDayCompleted(true);
      // Fire confetti!
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'],
      });

      // Self-healing for past race conditions
      if (!programProgress.completedDays?.[dayNum]?.completedAt) {
        const newCompletedDays = {
          ...programProgress.completedDays,
          [dayNum]: {
            ...(programProgress.completedDays?.[dayNum] || {}),
            completedAt: new Date().toISOString(),
            activities: completedActivities,
          }
        };

        const newCurrentDay = Math.max(programProgress.currentDay, dayNum + 1);

        updateUserSettings({
          programProgress: {
            ...programProgress,
            completedDays: newCompletedDays,
            currentDay: newCurrentDay,
          }
        });
      }
    }
  }, [allDone, dayCompleted, programProgress, dayNum, completedActivities, updateUserSettings]);

  const handleActivityComplete = useCallback((activityId) => {
    const updated = { ...completedActivities, [activityId]: true };
    setCompletedActivities(updated);

    // check if all done
    const total = dayData?.activities?.length || 0;
    const completedCount = Object.keys(updated).filter(k => updated[k]).length;
    const isNowAllDone = completedCount === total && total > 0;

    let newCurrentDay = programProgress.currentDay;
    let completedAt = programProgress.completedDays?.[dayNum]?.completedAt;

    if (isNowAllDone && !completedAt) {
      newCurrentDay = Math.max(programProgress.currentDay, dayNum + 1);
      completedAt = new Date().toISOString();
    }

    // Persist progress
    const newCompletedDays = {
      ...programProgress.completedDays,
      [dayNum]: {
        ...(programProgress.completedDays?.[dayNum] || {}),
        activities: updated,
        ...(completedAt ? { completedAt } : {})
      }
    };

    updateUserSettings({
      programProgress: {
        ...programProgress,
        completedDays: newCompletedDays,
        currentDay: newCurrentDay,
      }
    });
  }, [dayNum, programProgress, updateUserSettings, dayData, completedActivities]);

  const handleNavigateToView = useCallback((viewPath) => {
    navigate(viewPath);
  }, [navigate]);

  const handleGoBack = useCallback(() => {
    navigate('/program');
  }, [navigate]);

  const handleNextDay = useCallback(() => {
    const nextDay = dayNum + 1;
    if (nextDay <= 30) {
      navigate(`/program/day/${nextDay}`);
    } else {
      navigate('/program');
    }
  }, [dayNum, navigate]);



  if (!dayData || !weekData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-slate-500 text-lg">Day not found</p>
        <button onClick={handleGoBack} className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium">
          ← Back to Program
        </button>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 max-w-3xl mx-auto">

      {/* Back Button + Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <button
          onClick={handleGoBack}
          className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <FaArrowLeft />
        </button>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {weekData.emoji} Week {weekData.id}: {weekData.title}
          </p>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Day {dayNum}
          </h2>
        </div>
      </motion.div>

      {/* Day Overview Card */}
      <motion.div
        variants={itemVariants}
        className={`relative rounded-2xl p-6 overflow-hidden bg-gradient-to-br ${colors.gradient} text-white shadow-lg`}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FaClock className="text-white/80" />
              <span className="font-semibold">{totalDuration} minutes</span>
            </div>
            <div className="text-sm font-bold">
              {activitiesCompleted}/{activitiesTotal} done
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(activitiesCompleted / activitiesTotal) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Week rule */}
          <p className="mt-3 text-sm text-white/80">
            🎯 {weekData.rule}
          </p>
        </div>
      </motion.div>

      {/* Day Completed Banner */}
      <AnimatePresence>
        {dayCompleted && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-center shadow-lg"
          >
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold">Day {dayNum} Complete!</h3>
            <p className="text-emerald-100 text-sm mt-1">Excellent! You've completed today's practice.</p>

            {dayNum < 30 && (
              <button
                onClick={handleGoBack}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-600 text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                Return to Program <FaArrowRight />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity Cards */}
      <motion.div variants={containerVariants} className="space-y-3">
        <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${colors.bg}`} />
          Today's Activities
        </h3>

        {dayData.activities.map((activity, index) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            index={index}
            isCompleted={!!completedActivities[activity.id]}
            onComplete={handleActivityComplete}
            weekColor={weekData.color}
            onNavigate={handleNavigateToView}
          />
        ))}
      </motion.div>

      {/* Golden Habit Reminder */}
      <motion.div variants={itemVariants} className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3">
          💡 Daily Reminder
        </p>
        <div className="space-y-2">
          {GOLDEN_HABITS.map(h => (
            <p key={h.id} className="text-sm text-slate-700 dark:text-slate-300">
              {h.icon} <strong>{h.title}</strong> — {h.description}
            </p>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div variants={itemVariants} className="flex items-center justify-between pt-2 pb-8">
        {dayNum > 1 ? (
          <button
            onClick={() => navigate(`/program/day/${dayNum - 1}`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <FaArrowLeft className="text-xs" /> Day {dayNum - 1}
          </button>
        ) : <div />}

        <button
          onClick={handleGoBack}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          📋 Program Overview
        </button>

        {dayNum < 30 ? (
          <button
            onClick={handleNextDay}
            disabled={dayNum >= programProgress.currentDay && !dayCompleted}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              dayNum >= programProgress.currentDay && !dayCompleted
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            Day {dayNum + 1} <FaArrowRight className="text-xs" />
          </button>
        ) : <div />}
      </motion.div>
    </motion.div>
  );
};

export default memo(DayDetailView);
