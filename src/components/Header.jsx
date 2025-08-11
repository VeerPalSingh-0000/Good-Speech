import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X } from 'lucide-react';

// ✅ FIX: Moved NavButton outside of the Header component to prevent re-definition on every render.
// It now receives currentView and handleNavClick as props.
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

const Header = ({ user, onLogout, currentView, setCurrentView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: "home", label: "Home", icon: "fas fa-home" },
    { key: "exercises", label: "स्वर अभ्यास", icon: "fas fa-microphone" },
    { key: "varnmala", label: "वर्णमाला", icon: "fas fa-list" },
    { key: "stories", label: "पठन", icon: "fas fa-book" },
    { key: "history", label: "History", icon: "fas fa-history" },
  ];

  const handleNavClick = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
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
            <nav className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                    {/* ✅ FIX: Pass required props to the stable NavButton component */}
                    {navItems.map(item => <NavButton key={item.key} item={item} currentView={currentView} handleNavClick={handleNavClick} />)}
                </div>
            </nav>

            {/* Right Side: User Info and Mobile Menu */}
            <div className="flex items-center justify-end gap-4">
                {/* User Info and Actions (Desktop) */}
                <div className="hidden lg:flex items-center gap-4">
                  <div className="relative group">
                    <button className="flex items-center gap-2 p-2 rounded-full bg-slate-100 dark:bg-slate-800">
                      <img src={user.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${user.email}`} alt="User" className="w-8 h-8 rounded-full" />
                      <span className="font-semibold text-sm pr-2">{user.displayName || user.email.split('@')[0]}</span>
                    </button>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border dark:border-slate-700 p-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                      <div className="p-2 text-center border-b dark:border-slate-700">
                        <p className="font-bold">{user.displayName}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 mt-1 p-2 rounded-md font-semibold text-left text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
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
            className="lg:hidden fixed top-20 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg border-b border-slate-200 dark:border-slate-700 z-30"
          >
            <nav className="flex flex-col gap-2 p-4">
              {/* ✅ FIX: Pass required props to the stable NavButton component */}
              {navItems.map(item => <NavButton key={item.key} item={item} isMobile={true} currentView={currentView} handleNavClick={handleNavClick} />)}
              <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <img src={user.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${user.email}`} alt="User" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-bold">{user.displayName || user.email.split('@')[0]}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 p-3 rounded-lg font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut size={20} />
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