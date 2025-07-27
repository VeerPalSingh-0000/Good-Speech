// src/features/hindi/components/StatCard.jsx

import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-4 hover:-translate-y-1 transition-transform">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center text-white text-2xl`}>
        <i className={icon}></i>
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
    