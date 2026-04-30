// src/components/views/ProgramView.jsx
// 30-Day Speech Improvement Program — Dashboard

import React, { useState, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarCheck, FaLock, FaCheckCircle, FaPlay, FaClock,
  FaTrophy, FaStar, FaArrowRight, FaQuoteLeft
} from 'react-icons/fa';
import { PROGRAM_DATA, GOLDEN_HABITS, EXPECTED_RESULTS, FINAL_PRINCIPLE, getDayTotalDuration, getWeekForDay } from '../../data/programData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
};

// Week tab colors
const weekColors = {
  emerald: {
    active: 'bg-emerald-500 text-white shadow-emerald-500/30',
    inactive: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
    card: 'border-emerald-200 dark:border-emerald-800',
    gradient: 'from-emerald-500 to-teal-600',
    light: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  blue: {
    active: 'bg-blue-500 text-white shadow-blue-500/30',
    inactive: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20',
    card: 'border-blue-200 dark:border-blue-800',
    gradient: 'from-blue-500 to-indigo-600',
    light: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  purple: {
    active: 'bg-purple-500 text-white shadow-purple-500/30',
    inactive: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-900/20',
    card: 'border-purple-200 dark:border-purple-800',
    gradient: 'from-purple-500 to-violet-600',
    light: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
    dot: 'bg-purple-500',
  },
  rose: {
    active: 'bg-rose-500 text-white shadow-rose-500/30',
    inactive: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20',
    card: 'border-rose-200 dark:border-rose-800',
    gradient: 'from-rose-500 to-red-600',
    light: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
};

// Day card component
const DayCard = memo(({ day, weekColor, isCompleted, isCurrent, isLocked, onStart }) => {
  const colors = weekColors[weekColor] || weekColors.emerald;
  const totalMin = getDayTotalDuration(day.day);

  return (
    <motion.button
      variants={itemVariants}
      onClick={() => !isLocked && onStart(day.day)}
      disabled={isLocked}
      className={`relative group w-full p-4 rounded-2xl border transition-all duration-200 text-left ${
        isCompleted
          ? `bg-white dark:bg-slate-800 ${colors.card} shadow-sm`
          : isCurrent
            ? `bg-white dark:bg-slate-800 border-2 ${colors.card} shadow-md ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ${colors.card.replace('border-', 'ring-')}`
            : isLocked
              ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed'
              : `bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md`
      }`}
      whileTap={!isLocked ? { scale: 0.97 } : {}}
    >
      {/* Status indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          isCompleted ? colors.light : isCurrent ? colors.light : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
        }`}>
          Day {day.day}
        </span>
        <div>
          {isCompleted ? (
            <FaCheckCircle className="text-emerald-500 text-lg" />
          ) : isCurrent ? (
            <div className={`w-3 h-3 rounded-full ${colors.dot} animate-pulse`} />
          ) : isLocked ? (
            <FaLock className="text-slate-300 dark:text-slate-600 text-sm" />
          ) : null}
        </div>
      </div>

      {/* Activities summary */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
        <FaClock className="text-[9px]" />
        <span>{totalMin} min</span>
        <span className="mx-1">•</span>
        <span>{day.activities.length} activities</span>
      </div>

      {/* Current day CTA */}
      {isCurrent && (
        <div className={`mt-3 flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
          <FaPlay className={`text-[10px] ${colors.dot.replace('bg-', 'text-')}`} />
          Start Practice
        </div>
      )}
    </motion.button>
  );
});
DayCard.displayName = 'DayCard';

// Habit card
const HabitCard = memo(({ habit }) => (
  <motion.div variants={itemVariants} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
    <div className="flex items-start gap-3">
      <span className="text-2xl">{habit.icon}</span>
      <div>
        <h4 className="font-bold text-slate-800 dark:text-white text-sm">{habit.title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{habit.description}</p>
      </div>
    </div>
  </motion.div>
));
HabitCard.displayName = 'HabitCard';

const ProgramView = ({ userSettings, updateUserSettings }) => {
  const navigate = useNavigate();
  const phase = PROGRAM_DATA.phases[0]; // Phase 1 for now

  const programProgress = userSettings?.programProgress || {
    currentDay: 1,
    startDate: null,
    completedDays: {},
  };

  const { currentDay, completedDays } = programProgress;

  // Determine which week tab to show based on current day
  const currentWeek = useMemo(() => {
    const w = getWeekForDay(currentDay);
    return w?.id || 1;
  }, [currentDay]);

  const [activeWeek, setActiveWeek] = useState(currentWeek);

  // Overall progress
  const totalCompleted = Object.values(completedDays).filter(d => !!d.completedAt).length;
  const overallProgress = Math.round((totalCompleted / phase.totalDays) * 100);

  // Get days for active week
  const weekData = phase.weeks.find(w => w.id === activeWeek);
  const weekDays = useMemo(() => {
    if (!weekData) return [];
    return phase.days.filter(d => d.day >= weekData.dayRange[0] && d.day <= weekData.dayRange[1]);
  }, [activeWeek, weekData, phase.days]);

  // Next milestone
  const nextMilestone = useMemo(() => {
    return EXPECTED_RESULTS.find(m => m.day > totalCompleted) || EXPECTED_RESULTS[EXPECTED_RESULTS.length - 1];
  }, [totalCompleted]);

  const handleStartDay = useCallback((dayNumber) => {
    // Initialize start date if first time
    if (!programProgress.startDate) {
      updateUserSettings({
        programProgress: {
          ...programProgress,
          startDate: new Date().toISOString(),
        }
      });
    }
    navigate(`/program/day/${dayNumber}`);
  }, [navigate, programProgress, updateUserSettings]);

  const circumference = 2 * Math.PI * 56;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 md:space-y-8 max-w-5xl mx-auto">

      {/* Hero Header */}
      <motion.div variants={itemVariants} className="relative bg-slate-900 text-white rounded-[2rem] p-8 md:p-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm font-medium mb-4">
              <FaCalendarCheck className="text-indigo-400" />
              <span>Phase {phase.id}: {phase.title}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
              Speech Improvement
              <span className="block text-indigo-400">Program</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-md">
              {phase.description}
            </p>

            {/* Current status */}
            <div className="mt-4 flex items-center gap-4 flex-wrap justify-center md:justify-start">
              <div className="px-3 py-1.5 rounded-full bg-slate-800 text-xs font-medium">
                📅 Day <span className="text-indigo-400 font-bold">{currentDay}</span> of {phase.totalDays}
              </div>
              <div className="px-3 py-1.5 rounded-full bg-slate-800 text-xs font-medium">
                ✅ <span className="text-emerald-400 font-bold">{totalCompleted}</span> completed
              </div>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="relative shrink-0">
            <svg className="w-36 h-36 -rotate-90">
              <circle cx="72" cy="72" r="56" strokeWidth="10" fill="transparent"
                className="text-slate-800" stroke="currentColor" />
              <circle cx="72" cy="72" r="56" strokeWidth="10" fill="transparent"
                strokeLinecap="round"
                className="text-indigo-500"
                stroke="currentColor"
                strokeDasharray={`${(overallProgress / 100) * circumference} ${circumference}`}
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black">{overallProgress}%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Complete</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Start Today CTA */}
      {currentDay <= phase.totalDays && (
        <motion.div variants={itemVariants}>
          <button
            onClick={() => handleStartDay(currentDay)}
            className="group w-full p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-indigo-500 hover:to-purple-500 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-indigo-200 text-xs font-medium mb-1">
                  {getWeekForDay(currentDay)?.emoji} {getWeekForDay(currentDay)?.title}
                </p>
                <h3 className="text-xl font-bold">
                  Start Day {currentDay} Practice
                </h3>
                <p className="text-indigo-200 text-sm mt-1">
                  {getDayTotalDuration(currentDay)} minutes • {PROGRAM_DATA.phases[0].days.find(d => d.day === currentDay)?.activities.length || 4} activities
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <FaArrowRight />
              </div>
            </div>
          </button>
        </motion.div>
      )}

      {/* Week Tabs */}
      <motion.div variants={itemVariants}>
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto">
          {phase.weeks.map(week => {
            const colors = weekColors[week.color];
            const isActive = activeWeek === week.id;
            return (
              <button
                key={week.id}
                onClick={() => setActiveWeek(week.id)}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive ? `${colors.active} shadow-md` : colors.inactive
                }`}
              >
                <span>{week.emoji}</span>
                <span className="hidden sm:inline">Week {week.id}</span>
                <span className="sm:hidden">W{week.id}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Week Info Card */}
      {weekData && (
        <motion.div
          variants={itemVariants}
          className={`p-5 rounded-2xl border ${weekColors[weekData.color].card} bg-white dark:bg-slate-800 shadow-sm`}
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">{weekData.emoji}</span>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{weekData.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{weekData.goal}</p>
              <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${weekColors[weekData.color].light} text-xs font-semibold`}>
                🎯 Rule: {weekData.rule}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Day Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {weekDays.map(day => {
          const isCompleted = !!completedDays[day.day]?.completedAt;
          const isCurrent = day.day === currentDay;
          const isLocked = day.day > currentDay;

          return (
            <DayCard
              key={day.day}
              day={day}
              weekColor={weekData?.color || 'emerald'}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              isLocked={isLocked}
              onStart={handleStartDay}
            />
          );
        })}
      </motion.div>

      {/* Next Milestone */}
      {nextMilestone && (
        <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-2xl">
              {nextMilestone.icon}
            </div>
            <div>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">Next Milestone — Day {nextMilestone.day}</p>
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mt-0.5">{nextMilestone.result}</h4>
            </div>
          </div>
        </motion.div>
      )}

      {/* Golden Habits */}
      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <FaStar className="text-amber-500" /> Daily Golden Habits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {GOLDEN_HABITS.map(habit => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      </motion.div>

      {/* Final Principle */}
      <motion.div variants={itemVariants} className="p-8 rounded-[2rem] bg-slate-900 text-white text-center">
        <FaQuoteLeft className="mx-auto text-indigo-500 text-2xl mb-4" />
        <p className="text-xl md:text-2xl font-bold mb-2">{FINAL_PRINCIPLE.text}</p>
      </motion.div>

      {/* Expected Results */}
      <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <FaTrophy className="text-amber-500" /> Expected Results
        </h3>
        <div className="flex flex-wrap gap-4">
          {EXPECTED_RESULTS.map(r => (
            <div key={r.day}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                totalCompleted >= r.day
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="text-xl">{r.icon}</span>
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Day {r.day}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{r.result}</p>
              </div>
              {totalCompleted >= r.day && <FaCheckCircle className="text-emerald-500 text-sm ml-1" />}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default memo(ProgramView);
