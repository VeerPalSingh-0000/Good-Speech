// src/components/StatCard.jsx - Optimized version

import React, { memo } from 'react';
import { motion } from 'framer-motion';

const StatCard = memo(({ title, value, icon, color }) => {
  const isStreak = title.toLowerCase().includes('streak') || title.toLowerCase().includes('स्ट्रीक');

  return (
    <motion.div 
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6 }}
    >
      {/* Gradient glow on hover - simplified */}
      <div className={`absolute -inset-2 bg-gradient-to-r ${color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
      
      {/* Main card */}
      <div className="relative p-4 md:p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
        {/* Inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 rounded-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
          {/* Icon */}
          <div className={`w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-lg md:text-2xl shadow-lg group-hover:scale-105 transition-transform duration-300`}>
            <i className={icon} />
          </div>
          
          {/* Stats */}
          <div className="flex-1 min-w-0 w-full">
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium truncate">{title}</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 dark:text-white tabular-nums tracking-tight md:tracking-normal truncate">{value}</p>
          </div>

          {/* Streak badge */}
          {isStreak && parseInt(value) > 0 && (
            <div className="absolute top-0 right-0 md:top-2 md:right-2 px-2 py-0.5 md:py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] md:text-xs font-bold rounded-full shadow-md z-10 flex items-center justify-center">
              🔥
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
