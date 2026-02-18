// src/Hindi.jsx - Optimized version

import React, { useState, useMemo, memo, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

import Header from './components/Header';
import HomeView from './components/views/HomeView';
import ExercisesView from './components/views/ExercisesView';
import VarnmalaView from './components/views/VarnmalaView';
import StoriesView from './components/views/StoriesView';
import RecordsView from './components/views/RecordsView';
import HistoryView from './components/views/HistoryView';
import Footer from './components/Footer';
import { useHindiRecords } from './hooks/useHindiRecords';
import { useHindiTimers } from './hooks/useHindiTimers';
import { allStories } from './data/stories/index';

// Simple loading screen
const LoadingScreen = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center text-white gap-4">
    <div className="w-20 h-20 relative">
      <div className="absolute inset-0 border-4 border-purple-400/30 rounded-full" />
      <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
          <i className="fas fa-comment-dots text-xl text-white" />
        </div>
      </div>
    </div>
    <h2 className="text-xl font-bold">Loading SpeechGood</h2>
    <p className="text-slate-400 text-sm">Preparing your data...</p>
  </div>
));

LoadingScreen.displayName = 'LoadingScreen';

// Simple page transition
const PageTransition = memo(({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
));

PageTransition.displayName = 'PageTransition';

const Hindi = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showVarnmala, setShowVarnmala] = useState(false);

  const showNotification = useCallback((message, type = "info") => {
    switch (type) {
      case "success": toast.success(message); break;
      case "error": toast.error(message); break;
      default: toast(message); break;
    }
  }, []);

  const { 
    records, isLoading, saveToFirebase, deleteRecord, 
    storyBookmarks, lineBookmarks, toggleStoryBookmark, toggleLineBookmark 
  } = useHindiRecords(user, showNotification);

  const timerProps = useHindiTimers(saveToFirebase, showNotification, records);

  const navItems = useMemo(() => [
    { key: "home", label: "Home", icon: "fas fa-home" },
    { key: "exercises", label: "स्वर अभ्यास", icon: "fas fa-microphone" },
    { key: "varnmala", label: "वर्णमाला", icon: "fas fa-list" },
    { key: "stories", label: "पठन", icon: "fas fa-book" },
    { key: "records", label: "रिकॉर्ड्स", icon: "fas fa-chart-line" },
    { key: "history", label: "History", icon: "fas fa-history" },
  ], []);

  const getCurrentView = useCallback(() => {
    const path = location.pathname.substring(1);
    return path === '' ? 'home' : path;
  }, [location.pathname]);

  const handleNavigation = useCallback((viewKey) => {
    navigate(viewKey === 'home' ? '/' : `/${viewKey}`);
  }, [navigate]);

  const handleStartVarnmala = useCallback(() => {
    timerProps.startVarnmalaTimer();
    setShowVarnmala(true);
  }, [timerProps]);

  const handleStopVarnmala = useCallback((shouldRecord) => {
    timerProps.stopVarnmalaTimer(shouldRecord);
    setShowVarnmala(false);
  }, [timerProps]);

  const commonProps = useMemo(() => ({
    user, records, deleteRecord, showNotification, ...timerProps,
  }), [user, records, deleteRecord, showNotification, timerProps]);

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Toaster 
        position="bottom-center" 
        toastOptions={{ 
          style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '12px' },
          duration: 2000,
        }} 
      />
      
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans flex flex-col">
        <Header user={user} onLogout={onLogout} currentView={getCurrentView()} setCurrentView={handleNavigation} navItems={navItems} />

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><HomeView user={user} records={records} setCurrentView={handleNavigation} /></PageTransition>} />
              <Route path="/exercises" element={<PageTransition><ExercisesView {...commonProps} /></PageTransition>} />
              <Route path="/varnmala" element={<PageTransition><VarnmalaView {...commonProps} showVarnmala={showVarnmala} startVarnmalaTimer={handleStartVarnmala} stopVarnmalaTimer={handleStopVarnmala} /></PageTransition>} />
              <Route path="/stories" element={<PageTransition><StoriesView {...commonProps} stories={allStories} storyBookmarks={storyBookmarks} lineBookmarks={lineBookmarks} onToggleStoryBookmark={toggleStoryBookmark} onToggleLineBookmark={toggleLineBookmark} /></PageTransition>} />
              <Route path="/records" element={<PageTransition><RecordsView records={records} deleteRecord={deleteRecord} /></PageTransition>} />
              <Route path="/history" element={<PageTransition><HistoryView records={records} lineBookmarks={lineBookmarks} stories={allStories} /></PageTransition>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer setCurrentView={handleNavigation} navItems={navItems} />
      </div>
    </>
  );
};

export default memo(Hindi);