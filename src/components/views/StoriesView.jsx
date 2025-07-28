// src/features/hindi/components/views/StoriesView.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime } from '../../utilities/helpers';
import AnimatedButton from '../ui/AnimatedButton';
import { FaPlay, FaPause, FaSave, FaRedo } from 'react-icons/fa';

const StoryDisplayModal = ({ story, onClose }) => (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        >
            <h2 className="text-2xl sm:text-3xl font-bold text-center p-6 border-b border-slate-200 dark:border-slate-700">{story.title}</h2>
            <div className="overflow-y-auto p-8 prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-line text-lg leading-relaxed">{story.content}</p>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <button onClick={onClose} className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">Close</button>
            </div>
        </motion.div>
    </motion.div>
);

const StoriesView = ({ storyTimer, currentStory, showStory, startStoryTimer, pauseStoryTimer, resetStoryTimer, stopStoryTimer }) => {

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">पठन अभ्यास</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg max-w-2xl mx-auto">Improve fluency and confidence with open-ended, timed reading sessions.</p>
      </div>

      {/* Main Timer and Control Panel */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="p-8 md:p-12 bg-white dark:bg-slate-800/50 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 space-y-8"
      >
        <div className="flex flex-col items-center gap-4">
            <p className="text-slate-500 dark:text-slate-400 text-xl font-semibold">Open Practice Session</p>
            <motion.div 
              animate={{ scale: storyTimer.isRunning ? 1.05 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              className="text-7xl md:text-8xl font-mono font-bold text-center bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
            >
                {formatTime(storyTimer.time)}
            </motion.div>
             {storyTimer.isRunning && (
                <div className="flex items-center gap-2 text-green-500 dark:text-green-400 font-semibold animate-pulse">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Timer is active</span>
                </div>
             )}
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
            <AnimatedButton onClick={startStoryTimer} disabled={storyTimer.isRunning} className="bg-green-500 text-white" icon={<FaPlay />}>
                {storyTimer.isPaused ? "Resume" : "Start"}
            </AnimatedButton>
            <AnimatedButton onClick={pauseStoryTimer} disabled={!storyTimer.isRunning} className="bg-yellow-500 text-white" icon={<FaPause />}>Pause</AnimatedButton>
            <AnimatedButton onClick={resetStoryTimer} disabled={storyTimer.time === 0} className="bg-red-500 text-white" icon={<FaRedo />}>Reset</AnimatedButton>
            <AnimatedButton onClick={() => stopStoryTimer(true)} disabled={storyTimer.time === 0} className="bg-purple-600 text-white" icon={<FaSave />}>Record</AnimatedButton>
        </div>
      </motion.div>

      {/* Story Display Modal */}
      <AnimatePresence>
        {showStory && <StoryDisplayModal story={currentStory} onClose={pauseStoryTimer} />}
      </AnimatePresence>
    </div>
  );
};

export default StoriesView;
