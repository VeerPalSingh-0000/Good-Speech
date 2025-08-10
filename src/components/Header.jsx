// src/components/Header.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ user, onLogout, currentView, setCurrentView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: "home", label: "Home", icon: "fas fa-home" },
    { key: "exercises", label: "स्वर अभ्यास", icon: "fas fa-microphone" },
    { key: "varnmala", label: "वर्णमाला", icon: "fas fa-list" },
    { key: "stories", label: "पठन", icon: "fas fa-book" },
    { key: "records", label: "रिकॉर्ड्स", icon: "fas fa-chart-line" },
    { key: "history", label: "History", icon: "fas fa-history" },
  ];

  const handleNavClick = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false); // Close mobile menu on selection
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Brand Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <i className="fas fa-comment text-xl text-white"></i>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SpeechGood
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentView === item.key
                      ? 'bg-purple-600 text-white shadow-lg scale-105'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* User Info and Logout (Desktop) */}
            <div className="hidden lg:flex items-center gap-4">
                <div className="text-right">
                    <p className="font-semibold text-sm">{user.displayName || user.email}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Welcome back!</p>
                </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-lg font-medium bg-rose-500 hover:bg-rose-600 text-white transition-colors shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-20 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-slate-200 dark:border-slate-700 z-30"
          >
            <nav className="flex flex-col gap-2 p-4">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`flex items-center gap-4 p-4 rounded-lg font-semibold text-left transition-colors text-lg ${
                    currentView === item.key
                      ? 'bg-purple-600 text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <i className={`${item.icon} w-6 text-center`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
              <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
              <button
                onClick={onLogout}
                className="flex items-center gap-4 p-4 rounded-lg font-semibold text-left transition-colors text-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
              >
                <i className="fas fa-sign-out-alt w-6 text-center"></i>
                <span>Logout</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
