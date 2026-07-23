import React, { useState, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ESSENTIAL_KEYS = ['home', 'program', 'varnmala', 'stories'];

const Sidebar = ({ currentView, setCurrentView, navItems }) => {
  const mainNavItems = navItems.filter(item => ESSENTIAL_KEYS.includes(item.key));
  const secondaryNavItems = navItems.filter(item => !ESSENTIAL_KEYS.includes(item.key));

  const isSecondaryActive = secondaryNavItems.some(item => item.key === currentView);
  const [isMoreOpen, setIsMoreOpen] = useState(isSecondaryActive);

  useEffect(() => {
    if (isSecondaryActive) {
      setIsMoreOpen(true);
    }
  }, [isSecondaryActive]);

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 overflow-y-auto z-40">
      <div className="p-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <i className="fas fa-comment-dots text-lg text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-slate-800 dark:text-white tracking-tight">SpeechGood</h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase block">Therapy</span>
          </div>
        </div>

        {/* Essential Main Navigation */}
        <div className="mb-4">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-2">Main</p>
          <nav className="space-y-0.5">
            {mainNavItems.map((item) => {
              const isActive = currentView === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setCurrentView(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-display font-bold transition-all duration-200 relative group overflow-hidden ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sky-500 dark:bg-sky-400 rounded-r-full"
                    />
                  )}
                  
                  <div className={`w-6 flex items-center justify-center text-[17px] transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-sky-500 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-300'
                  }`}>
                    <i className={item.icon}></i>
                  </div>
                  <span className="text-[13px] tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Collapsible More / Hamburger Section */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
              isSecondaryActive 
                ? 'text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-900/10' 
                : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-bars text-sm text-slate-400 dark:text-slate-500" />
              <span>More Features</span>
            </div>
            <i className={`fas fa-chevron-${isMoreOpen ? 'up' : 'down'} text-[10px] transition-transform duration-200`} />
          </button>

          <AnimatePresence>
            {isMoreOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden space-y-0.5 mt-1 pl-2"
              >
                {secondaryNavItems.map((item) => {
                  const isActive = currentView === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setCurrentView(item.key)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-display font-semibold transition-all duration-200 relative group ${
                        isActive
                          ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sky-500 dark:bg-sky-400 rounded-r-full"
                        />
                      )}
                      
                      <div className={`w-5 flex items-center justify-center text-[15px] ${
                        isActive ? 'text-sky-500 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        <i className={item.icon}></i>
                      </div>
                      <span className="text-[12.5px] tracking-wide">{item.label}</span>
                    </button>
                  );
                })}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-[2rem] p-5 border-b-4 border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Ready to Practice</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default memo(Sidebar);
