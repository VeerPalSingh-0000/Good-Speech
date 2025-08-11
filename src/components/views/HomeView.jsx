// src/features/hindi/components/views/HomeView.jsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import StatCard from '../StatCard';
import { formatTime } from '../../utilities/helpers';
import { FaPlayCircle, FaHistory, FaBullseye } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const HomeView = ({ user, records, setCurrentView }) => {
  const stats = useMemo(() => {
    if (!records) return { totalSessions: 0, totalTime: "00:00.00", bestSound: "00.00", streak: 0 };
    
    const allRecords = [...(records.sounds || []), ...(records.varnmala || []), ...(records.stories || [])];
    if (allRecords.length === 0) {
      return { totalSessions: 0, totalTime: "00:00.00", bestSound: "00.00", streak: 0 };
    }

    const totalSessions = allRecords.length;
    const totalTime = allRecords.reduce((sum, r) => sum + (r.time || 0), 0);
    const bestSound = records.sounds && records.sounds.length > 0 ? Math.max(...records.sounds.map(r => r.time || 0)) : 0;
    
    const practiceDates = [...new Set(allRecords.map(r => 
        new Date(r.timestamp?.seconds ? r.timestamp.seconds * 1000 : r.timestamp).toDateString()
    ))];
    
    let streak = 0;
    if (practiceDates.length > 0) {
        const sortedDates = practiceDates.map(d => new Date(d)).sort((a, b) => b - a);
        const today = new Date();
        today.setHours(0,0,0,0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (sortedDates[0].getTime() === today.getTime() || sortedDates[0].getTime() === yesterday.getTime()) {
            streak = 1;
            for (let i = 1; i < sortedDates.length; i++) {
                const dayBefore = new Date(sortedDates[i-1]);
                dayBefore.setDate(dayBefore.getDate() - 1);
                if (dayBefore.toDateString() === sortedDates[i].toDateString()) {
                    streak++;
                } else {
                    break;
                }
            }
        }
    }

    return {
      totalSessions,
      totalTime: formatTime(totalTime),
      bestSound: formatTime(bestSound),
      streak,
    };
  }, [records]);

  const dailyGoal = 11;
  const sessionsToday = useMemo(() => {
    const todayString = new Date().toDateString();
    return [...(records.sounds || []), ...(records.varnmala || []), ...(records.stories || [])]
           .filter(r => new Date(r.timestamp?.seconds ? r.timestamp.seconds * 1000 : r.timestamp).toDateString() === todayString).length;
  }, [records]);
  const goalProgress = Math.min((sessionsToday / dailyGoal) * 100, 100);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Animated Stat Cards */}
      <motion.div variants={containerVariants} className="pt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants}><StatCard title="कुल सत्र" value={stats.totalSessions} icon="fas fa-calendar-check" color="from-blue-500 to-cyan-500" /></motion.div>
        <motion.div variants={itemVariants}><StatCard title="कुल समय" value={stats.totalTime} icon="fas fa-clock" color="from-green-500 to-emerald-500" /></motion.div>
        <motion.div variants={itemVariants}><StatCard title="सर्वश्रेष्ठ स्वर" value={stats.bestSound} icon="fas fa-trophy" color="from-purple-500 to-pink-500" /></motion.div>
        <motion.div variants={itemVariants}><StatCard title="डेली स्ट्रीक" value={`${stats.streak} दिन`} icon="fas fa-fire" color="from-orange-500 to-red-500" /></motion.div>
      </motion.div>

      {/* New Goal of the Day Section */}
      <motion.div variants={itemVariants} className="p-8 bg-white dark:bg-slate-800/50 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
                <motion.div whileHover={{ scale: 1.1, rotate: -5 }} className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white text-4xl shadow-lg">
                    <FaBullseye />
                </motion.div>
                <div>
                    <h3 className="text-2xl font-bold">Goal of the Day</h3>
                    <p className="text-slate-500 dark:text-slate-400">Complete {dailyGoal} practice sessions to build your streak!</p>
                </div>
            </div>
            <div className="w-full md:w-1/3 text-center">
                <div className="flex items-center justify-center gap-4">
                    <span className="font-bold text-xl">{sessionsToday} / {dailyGoal}</span>
                    <span className="font-bold text-2xl text-emerald-500">{goalProgress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mt-2">
                    <motion.div 
                        className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                        initial={{ width: '0%' }}
                        animate={{ width: `${goalProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </div>
            </div>
        </div>
      </motion.div>

      {/* Redesigned CTA Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
          <div 
            onClick={() => setCurrentView('exercises')} 
            className="group relative p-10 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-center space-y-4 flex flex-col items-center justify-center h-full cursor-pointer shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center justify-center">
                <motion.div whileHover={{ scale: 1.1, rotate: -10 }} className="p-4 bg-white/20 rounded-full mb-4">
                    <FaPlayCircle className="text-5xl" />
                </motion.div>
                <h3 className="text-3xl font-bold">अभ्यास शुरू करें</h3>
                <p className="opacity-80 text-lg">अपनी स्पीच थेरेपी यात्रा आज ही शुरू करें।</p>
            </div>
          </div>
        </motion.div>
        <motion.div variants={itemVariants}>
          <div 
            onClick={() => setCurrentView('history')} 
            className="group relative p-10 rounded-3xl bg-white dark:bg-slate-800 text-center space-y-4 flex flex-col items-center justify-center h-full cursor-pointer shadow-2xl hover:shadow-slate-500/20 transition-all duration-300 hover:-translate-y-2 border border-slate-200 dark:border-slate-700"
          >
            <div className="relative flex flex-col items-center justify-center">
                <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                    <FaHistory className="text-5xl text-slate-500 dark:text-slate-300" />
                </motion.div>
                <h3 className="text-3xl font-bold">अपनी प्रगति देखें</h3>
                <p className="text-slate-500 dark:text-slate-400 text-lg">अपने पिछले सभी रिकॉर्ड्स और सुधार देखें।</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HomeView;
