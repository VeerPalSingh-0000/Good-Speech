// src/components/ui/LoadingScreen.jsx
import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex flex-col items-center justify-center text-white gap-4 p-4">
            <div className="relative w-24 h-24">
                {/* Outer static ring */}
                <div className="absolute inset-0 border-4 border-purple-400/30 rounded-full"></div>
                {/* Inner spinning ring */}
                <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-comment text-3xl text-purple-400"></i>
                </div>
            </div>
            
            <h2 className="text-2xl font-bold animate-pulse bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SpeechGood
            </h2>
            
            <p className="text-slate-400 text-sm font-medium">
                Initializing Your Session...
            </p>
        </div>
    );
};

export default LoadingScreen;