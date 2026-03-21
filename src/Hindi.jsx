// src/Hindi.jsx - Optimized version

import React, { useState, useMemo, memo, useCallback, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';

const HomeView = lazy(() => import('./components/views/HomeView'));
const ExercisesView = lazy(() => import('./components/views/ExercisesView'));
const VarnmalaView = lazy(() => import('./components/views/VarnmalaView'));
const StoriesView = lazy(() => import('./components/views/StoriesView'));
const RecordsView = lazy(() => import('./components/views/RecordsView'));
const HistoryView = lazy(() => import('./components/views/HistoryView'));
const BreathingView = lazy(() => import('./components/views/BreathingView'));
const TongueTwistersView = lazy(() => import('./components/views/TongueTwistersView'));
const ProfileView = lazy(() => import('./components/views/ProfileView'));
const EducationView = lazy(() => import('./components/views/EducationView'));
const OnboardingView = lazy(() => import('./components/views/OnboardingView'));
import { useHindiRecords } from './hooks/useHindiRecords';
import { useHindiTimers } from './hooks/useHindiTimers';
import { allStories } from './data/stories/index';
import LoadingScreen from './components/ui/LoadingScreen';

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
    storyBookmarks, lineBookmarks, toggleStoryBookmark, toggleLineBookmark,
    userSettings, updateUserSettings
  } = useHindiRecords(user, showNotification);

  const timerProps = useHindiTimers(saveToFirebase, showNotification, records);

  const navItems = useMemo(() => [
    { key: "home", label: "Home", icon: "fas fa-home" },
    { key: "exercises", label: "Practice", icon: "fas fa-microphone" },
    { key: "varnmala", label: "Varnmala", icon: "fas fa-list" },
    { key: "stories", label: "Stories", icon: "fas fa-book" },
    { key: "breathing", label: "Breathing", icon: "fas fa-wind" },
    { key: "twisters", label: "Twisters", icon: "fas fa-layer-group" },
    { key: "records", label: "My Records", icon: "fas fa-compact-disc" },
    { key: "learn", label: "Learn", icon: "fas fa-graduation-cap" },
    { key: "history", label: "Analytics", icon: "fas fa-chart-line" },
    { key: "profile", label: "Profile", icon: "fas fa-user-circle" }
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

  const showOnboarding = userSettings && !userSettings.hasCompletedOnboarding;

  return (
    <>
      <Toaster 
        position="bottom-center" 
        toastOptions={{ 
          style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '12px' },
          duration: 2000,
        }} 
      />
      
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans flex flex-col overflow-x-hidden">
        <Header user={user} onLogout={onLogout} currentView={getCurrentView()} setCurrentView={handleNavigation} navItems={navItems} />

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full pb-24 xl:pb-6 relative">
          <AnimatePresence mode="wait">
            {showOnboarding && (
              <Suspense key="onboarding" fallback={<LoadingScreen />}>
                <OnboardingView userSettings={userSettings} updateUserSettings={updateUserSettings} />
              </Suspense>
            )}
            <Suspense key="routes" fallback={<LoadingScreen />}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><HomeView user={user} records={records} setCurrentView={handleNavigation} /></PageTransition>} />
                <Route path="/exercises" element={<PageTransition><ExercisesView {...commonProps} /></PageTransition>} />
                <Route path="/varnmala" element={<PageTransition><VarnmalaView {...commonProps} showVarnmala={showVarnmala} startVarnmalaTimer={handleStartVarnmala} stopVarnmalaTimer={handleStopVarnmala} /></PageTransition>} />
                <Route path="/stories" element={<PageTransition><StoriesView {...commonProps} stories={allStories} storyBookmarks={storyBookmarks} lineBookmarks={lineBookmarks} onToggleStoryBookmark={toggleStoryBookmark} onToggleLineBookmark={toggleLineBookmark} /></PageTransition>} />
                <Route path="/breathing" element={<PageTransition><BreathingView /></PageTransition>} />
                <Route path="/twisters" element={<PageTransition><TongueTwistersView /></PageTransition>} />
                <Route path="/records" element={<PageTransition><RecordsView records={records} deleteRecord={deleteRecord} /></PageTransition>} />
                <Route path="/history" element={<PageTransition><HistoryView records={records} lineBookmarks={lineBookmarks} stories={allStories} /></PageTransition>} />
                <Route path="/learn" element={<PageTransition><EducationView /></PageTransition>} />
                <Route path="/profile" element={<PageTransition><ProfileView user={user} records={records} onLogout={onLogout} userSettings={userSettings} updateUserSettings={updateUserSettings} /></PageTransition>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>

        <Footer setCurrentView={handleNavigation} navItems={navItems} />
        <BottomNav currentView={getCurrentView()} setCurrentView={handleNavigation} />
      </div>
    </>
  );
};

export default memo(Hindi);