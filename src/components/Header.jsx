// src/components/Header.jsx - Optimized version

import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X, ChevronDown } from 'lucide-react';

// Memoized NavButton component
const NavButton = memo(({ item, isMobile = false, currentView, handleNavClick }) => (
  <button
    onClick={() => handleNavClick(item.key)}
    className={`relative flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
      isMobile ? 'text-lg' : 'text-sm'
    } ${
      currentView === item.key
        ? 'text-white bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 shadow-lg'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700/70'
    }`}
  >
    <i className={`${item.icon} w-5 text-center`} />
    <span className="whitespace-nowrap">{item.label}</span>
  </button>
));

NavButton.displayName = 'NavButton';

const Header = ({ user, onLogout, currentView, setCurrentView, navItems = [] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [setCurrentView]);

  const handleLogout = useCallback(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    onLogout();
  }, [onLogout]);

  const userAvatar = user.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${user.email}`;
  const userName = user.displayName || user.email.split('@')[0];

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-all duration-200 ${scrolled ? 'backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 shadow-lg' : 'backdrop-blur-lg bg-white/70 dark:bg-slate-900/70'}`}>
        {/* Gradient border on scroll */}
        {scrolled && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600" />}
        
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <button onClick={() => handleNavClick('home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-comment-dots text-lg text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">SpeechGood</h1>
                <span className="text-[9px] text-slate-400 font-medium tracking-wider uppercase -mt-1 block">Speech Therapy</span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl">
              {navItems.map(item => (
                <NavButton key={item.key} item={item} currentView={currentView} handleNavClick={handleNavClick} />
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Desktop Profile */}
              <div className="hidden xl:block relative">
                {profileMenuOpen && <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)} />}
                
                <button 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-full transition-all ${profileMenuOpen ? 'bg-slate-200 dark:bg-slate-700 ring-2 ring-purple-500/50' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  <img src={userAvatar} alt="User" className="w-7 h-7 rounded-full" />
                  <span className="font-medium text-sm">{userName}</span>
                  <ChevronDown size={14} className={`transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-20"
                    >
                      <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <p className="font-bold text-sm truncate">{user.displayName || "User"}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                          <LogOut size={16} /><span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`xl:hidden p-2 rounded-xl transition-colors ${mobileMenuOpen ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' : 'bg-slate-100 dark:bg-slate-800'}`}>
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <div className="xl:hidden fixed inset-0 bg-black/20 z-30" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="xl:hidden fixed top-16 left-3 right-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-40 p-3"
            >
              <nav className="flex flex-col gap-1">
                {navItems.map(item => (
                  <NavButton key={item.key} item={item} isMobile currentView={currentView} handleNavClick={handleNavClick} />
                ))}
              </nav>
              
              <div className="border-t border-slate-200 dark:border-slate-700 mt-3 pt-3">
                <div className="flex items-center gap-3 mb-3 px-2">
                  <img src={userAvatar} alt="User" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-bold text-sm">{userName}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-500 text-white font-medium">
                  <LogOut size={16} /><span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Header);