import React, { memo } from 'react';
import { motion } from 'framer-motion';

const BottomNav = ({ currentView, setCurrentView }) => {
  const tabs = [
    { key: "home", label: "Home", icon: "fas fa-home" },
    { key: "exercises", label: "Practice", icon: "fas fa-microphone" },
    { key: "varnmala", label: "Varnmala", icon: "fas fa-list" },
    { key: "stories", label: "Stories", icon: "fas fa-book" },
    { key: "breathing", label: "Breathing", icon: "fas fa-wind" }
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe">
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
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <i className={tab.icon}></i>
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-200 z-10 ${
                  isActive
                    ? 'text-purple-600 dark:text-purple-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-xl z-0 m-1"
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
