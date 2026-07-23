import React from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle Dark Mode"
      className="relative flex items-center justify-between w-14 h-8 px-1.5 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700/80 transition-colors duration-300 focus:outline-none shadow-inner"
    >
      <Sun size={12} className={`transition-opacity duration-200 ${isDark ? 'opacity-30 text-slate-400' : 'opacity-0'}`} />
      <Moon size={12} className={`transition-opacity duration-200 ${isDark ? 'opacity-0' : 'opacity-30 text-slate-400'}`} />
      
      <div
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 shadow-md flex items-center justify-center transition-transform duration-300 border border-slate-200 dark:border-slate-700 ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon size={13} className="text-indigo-400 fill-indigo-400/20" />
        ) : (
          <Sun size={13} className="text-amber-500 fill-amber-500/20" />
        )}
      </div>
    </button>
  );
};

export default DarkModeToggle;
