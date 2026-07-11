import React, { memo } from 'react';
import { motion } from 'framer-motion';

const Sidebar = ({ currentView, setCurrentView, navItems }) => {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 overflow-y-auto z-40">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <i className="fas fa-comment-dots text-lg text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-slate-800 dark:text-white tracking-tight">SpeechGood</h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase block">Therapy</span>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setCurrentView(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-display font-bold transition-all duration-200 border-2 ${
                  isActive
                    ? 'bg-sky-100/50 dark:bg-sky-500/10 border-sky-300 dark:border-sky-500/30 text-sky-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                } btn-gamified hover:border-b-4`}
              >
                <div className={`w-8 flex items-center justify-center text-lg ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                  <i className={item.icon}></i>
                </div>
                <span className="text-sm">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-[2rem] p-5 border-b-4 border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Daily Goal: 45%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default memo(Sidebar);
