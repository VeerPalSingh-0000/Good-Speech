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
      <div className="relative p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
        {/* Inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 rounded-3xl pointer-events-none" />
        
        <div className="relative flex items-center gap-5">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-105 transition-transform duration-300`}>
            <i className={icon} />
          </div>
          
          {/* Stats */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white tabular-nums">{value}</p>
          </div>

          {/* Streak badge */}
          {isStreak && parseInt(value) > 0 && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold rounded-full shadow-md">
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
