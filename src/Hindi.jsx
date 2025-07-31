// src/Hindi.jsx

import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Import all components, hooks, and data
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
import { hindiStories } from './data/stories';

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

const Hindi = ({ user, onLogout }) => {
    const [currentView, setCurrentView] = useState("home");

    const navItems = [
        { key: "home", label: "Home", icon: "fas fa-home" },
        { key: "exercises", label: "स्वर अभ्यास", icon: "fas fa-microphone" },
        { key: "varnmala", label: "वर्णमाला", icon: "fas fa-list" },
        { key: "stories", label: "पठन", icon: "fas fa-book" },
        { key: "records", label: "रिकॉर्ड्स", icon: "fas fa-chart-line" },
        { key: "history", label: "History", icon: "fas fa-history" },
    ];

    const showNotification = (message, type = "info") => {
        switch (type) {
            case "success": toast.success(message); break;
            case "error": toast.error(message); break;
            default: toast(message); break;
        }
    };

    // --- HOOKS AS SINGLE SOURCE OF TRUTH ---
    // All state and logic is now correctly managed by these hooks.
    const { records, isLoading, saveToFirebase, deleteRecord, storyBookmarks, lineBookmarks, toggleStoryBookmark, toggleLineBookmark } = useHindiRecords(user, showNotification);
    const timerProps = useHindiTimers(saveToFirebase, showNotification, records);

    // This component is now clean. It just gets props from hooks and passes them down.
    
    const renderView = () => {
        // Combine all props to pass down to the views
        const viewProps = {
            user,
            records,
            deleteRecord,
            showNotification,
            ...timerProps, // Spreads all timer state and functions
        };

        switch (currentView) {
            case "home":
                return <HomeView user={user} records={records} setCurrentView={setCurrentView} />;
            
            case "exercises":
                return <ExercisesView {...viewProps} />;
            
            case "varnmala":
                return <VarnmalaView {...viewProps} />;
            
            case "stories":
                // Pass the specific bookmark props to StoriesView
                return <StoriesView 
                            {...viewProps} 
                            stories={hindiStories}
                            storyBookmarks={storyBookmarks}
                            lineBookmarks={lineBookmarks}
                            onToggleStoryBookmark={toggleStoryBookmark}
                            onToggleLineBookmark={toggleLineBookmark}
                        />;
            
            case "records":
                // BUG FIX: Correctly pass the deleteRecord function
                return <RecordsView records={records} deleteRecord={deleteRecord} />;

            case "history":
                return <HistoryView records={records} lineBookmarks={lineBookmarks} stories={hindiStories} />;
            
            default:
                return <HomeView user={user} records={records} setCurrentView={setCurrentView} />;
        }
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Toaster position="bottom-center" toastOptions={{ style: { background: '#1E293B', color: '#F1F5F9', border: '1px solid #334155' } }} />
            <div className="min-h-screen bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-slate-200 font-sans flex flex-col">
                <Header user={user} onLogout={onLogout} currentView={currentView} setCurrentView={setCurrentView} navItems={navItems} />
                <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                    {renderView()}
                </main>
                <Footer setCurrentView={setCurrentView} navItems={navItems} />
            </div>
        </>
    );
};

export default Hindi;