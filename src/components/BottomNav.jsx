import React, { memo } from 'react';
import { motion } from 'framer-motion';

const BottomNav = ({ currentView, setCurrentView }) => {
  const tabs = [
    { key: "home", label: "Home", icon: "fas fa-home" },
    { key: "program", label: "Program", icon: "fas fa-calendar-check" },
    { key: "exercises", label: "Swar", icon: "fas fa-microphone" },
    { key: "varnmala", label: "Varnmala", icon: "fas fa-list" },
    { key: "stories", label: "Stories", icon: "fas fa-book" }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t-4 border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = currentView === tab.key;
          return (
            <button
              key={tab.key}
              aria-label={tab.label}
              onClick={() => setCurrentView(tab.key)}
              className="relative flex flex-col items-center justify-center w-full h-full space-y-1 focus:outline-none"
            >
              <div
                className={`text-xl transition-colors duration-200 z-10 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <i className={tab.icon}></i>
              </div>
              <span
                className={`text-[10px] font-display transition-colors duration-200 z-10 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                    : 'text-slate-500 dark:text-slate-400 font-bold'
                }`}
              >
                {tab.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-sky-100 dark:bg-sky-900/30 rounded-2xl z-0 m-1 border-b-4 border-sky-300 dark:border-sky-800"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(BottomNav);
