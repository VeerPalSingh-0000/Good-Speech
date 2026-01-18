// src/components/Header.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X, ChevronDown } from 'lucide-react';

// NavButton component kept outside to prevent re-renders
const NavButton = ({ item, isMobile = false, currentView, handleNavClick }) => (
  <motion.button
    key={item.key}
    onClick={() => handleNavClick(item.key)}
    className={`relative flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
      isMobile ? 'text-lg' : 'text-sm'
    } ${
      currentView === item.key
        ? 'text-white'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {currentView === item.key && (
      <motion.div
        layoutId={isMobile ? "mobile-active-pill" : "desktop-active-pill"}
        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg"
        style={{ borderRadius: 8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    )}
    <span className="relative z-10 flex items-center gap-3">
      <i className={`${item.icon} w-5 text-center`}></i>
      <span className="whitespace-nowrap">{item.label}</span>
    </span>
  </motion.button>
);

// ✅ FIX: Added navItems to destructured props and removed hardcoded array
const Header = ({ user, onLogout, currentView, setCurrentView, navItems = [] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    onLogout();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-20">
            
            {/* Left Side: Logo */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleNavClick('home')}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <i className="fas fa-comment-dots text-2xl text-white"></i>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                SpeechGood
              </h1>
            </motion.div>

            {/* Center navigation */}
            <nav className="hidden xl:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                    {/* ✅ Uses the navItems prop now */}
                    {navItems.map(item => (
                        <NavButton key={item.key} item={item} currentView={currentView} handleNavClick={handleNavClick} />
                    ))}
                </div>
            </nav>

            {/* Right Side: User Info and Mobile Menu */}
            <div className="flex items-center justify-end gap-4">
                
                {/* User Info (Desktop) */}
                <div className="hidden xl:flex items-center gap-4 relative">
                  
                  {profileMenuOpen && (
                    <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)} />
                  )}

                  <div className="relative z-20">
                    <button 
                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                        className={`flex items-center gap-2 p-2 pr-3 rounded-full transition-all duration-200 ${profileMenuOpen ? 'bg-slate-200 dark:bg-slate-700 ring-2 ring-purple-500/50' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    >
                      <img src={user.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${user.email}`} alt="User" className="w-8 h-8 rounded-full" />
                      <span className="font-semibold text-sm">{user.displayName || user.email.split('@')[0]}</span>
                      <ChevronDown size={14} className={`transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {profileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                            >
                                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                                    <p className="font-bold text-slate-800 dark:text-white truncate">{user.displayName || "User"}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                                <div className="p-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 p-2 rounded-lg font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="xl:hidden">
                  <motion.button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-full bg-slate-100 dark:bg-slate-800"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence initial={false} mode="wait">
                      <motion.div
                        key={mobileMenuOpen ? 'x' : 'menu'}
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {mobileMenuOpen ? <X/> : <Menu />}
                      </motion.div>
                    </AnimatePresence>
                  </motion.button>
                </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden fixed top-20 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg border-b border-slate-200 dark:border-slate-700 z-30 overflow-hidden"
          >
            <nav className="flex flex-col gap-2 p-4">
              {/* ✅ Uses the navItems prop here too */}
              {navItems.map(item => (
                <NavButton key={item.key} item={item} isMobile={true} currentView={currentView} handleNavClick={handleNavClick} />
              ))}
              
              <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                <div className="flex items-center gap-3 mb-3">
                  <img src={user.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${user.email}`} alt="User" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-600 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 dark:text-white truncate">{user.displayName || user.email.split('@')[0]}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg font-semibold text-white bg-rose-500 hover:bg-rose-600 active:bg-rose-700 transition-colors shadow-sm"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;