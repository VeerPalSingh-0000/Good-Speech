// src/components/Header.jsx - Optimized version

import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import DarkModeToggle from './ui/DarkModeToggle';

const NavButton = memo(({ item, isMobile = false, currentView, handleNavClick }) => (
  <button
    onClick={() => handleNavClick(item.key)}
    className={`relative flex items-center gap-3 w-full text-left px-2 py-2 rounded-2xl transition-all duration-200 font-display ${
      isMobile ? 'text-lg font-bold px-4 py-3' : 'text-[11px] lg:text-xs xl:text-sm font-bold'
    } ${
      currentView === item.key
        ? 'text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/30 border-2 border-b-[4px] border-sky-300 dark:border-sky-800 btn-gamified cursor-default'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
    }`}
  >
    <i className={`${item.icon} ${isMobile ? 'w-6 text-center text-xl' : 'w-4 text-center text-sm'}`} />
    <span className="whitespace-nowrap">{item.label}</span>
  </button>
));

NavButton.displayName = 'NavButton';

const Header = ({ user, onLogout, currentView, setCurrentView, navItems = [] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
      <header className={`sticky top-0 z-40 w-full transition-all duration-200 ${scrolled ? 'bg-white dark:bg-slate-900 shadow-sm border-b-4 border-slate-200 dark:border-slate-800' : 'bg-slate-50 dark:bg-[#0f172a] border-b-4 border-transparent'}`}>
        
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo - Hidden on lg+ because Sidebar has it */}
            <button onClick={() => handleNavClick('home')} className="lg:hidden flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0 mr-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <i className="fas fa-comment-dots text-lg text-white" />
              </div>
            </button>

            {/* Desktop Navigation - Hidden because Sidebar has it */}
            <div className="hidden lg:block flex-1" />

            {/* Right Side */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Theme Toggle */}
              <div className="flex items-center">
                <DarkModeToggle 
                  isDark={theme === 'dark'} 
                  onToggle={toggleTheme} 
                />
              </div>

              {/* Desktop Profile */}
              <div className="hidden xl:block relative">
                {profileMenuOpen && <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)} />}
                
                <button 
                  aria-label="Toggle Profile Menu"
                  aria-expanded={profileMenuOpen}
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-full transition-all border-2 ${profileMenuOpen ? 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'} btn-gamified hover:border-b-4`}
                >
                  <img src={userAvatar} alt="User" className="w-7 h-7 rounded-full" />
                  <span className="font-medium text-xs max-w-[100px] truncate">{userName}</span>
                  <ChevronDown size={14} className={`transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-4 border-slate-200 dark:border-slate-700 overflow-hidden z-20"
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

              {/* Menu Button - Hidden on lg+ */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className={`lg:hidden p-2 rounded-xl transition-colors ${mobileMenuOpen ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Sidebar / Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/20 z-30" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="fixed top-20 right-4 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 p-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="xl:hidden flex items-center gap-4 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <img src={userAvatar} alt="User" className="w-12 h-12 rounded-full border-2 border-blue-500" />
                <div className="overflow-hidden">
                  <p className="font-bold text-lg truncate dark:text-white">{userName}</p>
                  <p className="text-sm text-slate-500 truncate">{user.email}</p>
                </div>
              </div>

              <nav className="flex flex-col gap-1 mb-4">
                {navItems.slice(5).map(item => (
                  <NavButton key={item.key} item={item} isMobile currentView={currentView} handleNavClick={handleNavClick} />
                ))}
              </nav>
              
              <div className="xl:hidden border-t border-slate-200 dark:border-slate-700 pt-4">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors font-display font-bold text-lg border-2 border-b-[4px] border-rose-200 dark:border-rose-500/30 btn-gamified">
                  <LogOut size={20} /><span>Sign Out</span>
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