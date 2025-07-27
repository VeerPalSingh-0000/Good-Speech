// src/Hindi.jsx

import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Import all components and hooks
import Header from './components/Header';
import HomeView from './components/views/HomeView';
import ExercisesView from './components/views/ExercisesView';
import VarnmalaView from './components/views/VarnmalaView';
import StoriesView from './components/views/StoriesView';
import RecordsView from './components/views/RecordsView';
import HistoryView from './components/views/HistoryView';
import { useAuth } from './contexts/AuthContext';
import { useHindiRecords } from './hooks/useHindiRecords';
import { useHindiTimers } from './hooks/useHindiTimers';

// A beautiful, self-contained loading screen component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex flex-col items-center justify-center text-white gap-4">
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 border-4 border-purple-400/30 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <i className="fas fa-comment text-3xl text-purple-400"></i>
      </div>
    </div>
    <h2 className="text-2xl font-bold animate-pulse">Loading Your SpeechGood Data...</h2>
    <p className="text-slate-400">Preparing your exercises and records.</p>
  </div>
);

// A professional footer component
const Footer = () => (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-slate-500 dark:text-slate-400">
            <p>&copy; {new Date().getFullYear()} SpeechGood. All rights reserved.</p>
            <p className="mt-2 text-sm">Your professional partner in speech therapy.</p>
        </div>
    </footer>
);


const Hindi = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState("home");

  // Use react-hot-toast for professional notifications
  const showNotification = (message, type = "info") => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      default:
        toast(message);
        break;
    }
  };

  const { records, isLoading, saveToFirebase, deleteRecord } = useHindiRecords(user, showNotification);
  const timerProps = useHindiTimers(saveToFirebase, showNotification);

  const renderView = () => {
    const viewProps = { user, records, ...timerProps, saveToFirebase, deleteRecord, showNotification };
    switch (currentView) {
      case "exercises":
        return <ExercisesView {...viewProps} />;
      case "varnmala":
        return <VarnmalaView {...viewProps} />;
      case "stories":
        return <StoriesView {...viewProps} />;
      case "records":
        return <RecordsView {...viewProps} />;
      case "history":
        return <HistoryView records={records} deleteRecord={deleteRecord} />;
      default:
        return <HomeView user={user} records={records} setCurrentView={setCurrentView} />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Toaster 
        position="bottom-center"
        toastOptions={{
            className: '',
            style: {
                background: '#1E293B',
                color: '#F1F5F9',
                border: '1px solid #334155',
            },
        }}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-slate-200 font-sans">
        <Header 
          user={user} 
          onLogout={onLogout} 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderView()}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Hindi;
