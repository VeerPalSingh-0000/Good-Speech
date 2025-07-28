
import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color }) => {
  const isStreak = title.toLowerCase().includes('streak');

  return (
    <div className="relative group p-6 rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      {/* Dynamic Gradient Glow on Hover */}
      <div className={`absolute -inset-2 bg-gradient-to-r ${color} rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
      
      <div className="relative flex items-center gap-5">
        <motion.div 
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-3xl shadow-md group-hover:scale-110 transition-transform duration-300`}
          whileHover={{ rotate: 10 }}
        >
          <i className={icon}></i>
        </motion.div>
        
        <div className="flex-1">
          <p className="text-slate-500 dark:text-slate-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{value}</p>
        </div>

        {/* Special badge for the streak card */}
        {isStreak && parseInt(value) > 0 && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold rounded-full shadow-md animate-pulse">
            🔥
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
