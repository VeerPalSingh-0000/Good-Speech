// src/features/hindi/components/views/StoriesView.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoryName, formatTime } from '../../utilities/helpers';
import { storyTargets } from '../../data/stories';
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

const StoriesView = ({ storyTimer, setStoryTimer, currentStory, showStory, startStoryTimer, pauseStoryTimer, resetStoryTimer, stopStoryTimer }) => {
  const percentage = Math.min(Math.round((storyTimer.time / (storyTimer.targetTime * 10)) * 100), 100);

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">पठन अभ्यास</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg max-w-2xl mx-auto">Improve fluency and confidence by practicing with timed reading sessions.</p>
      </div>

      {/* Story Selection Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Object.keys(storyTargets).map(type => (
            <motion.div
                key={type}
                onClick={() => setStoryTimer(prev => ({...prev, currentStory: type, targetTime: storyTargets[type]}))}
                className={`p-6 rounded-2xl text-center cursor-pointer border-2 transition-all duration-300 ${storyTimer.currentStory === type ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-purple-400'}`}
                whileHover={{ y: -5 }}
            >
                <h3 className="text-xl font-bold">{getStoryName(type)}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">({storyTargets[type] / 60} मिनट)</p>
            </motion.div>
        ))}
      </div>

      {/* Timer and Progress Section */}
      <div className="p-8 bg-white dark:bg-slate-800/50 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
                <p className="text-slate-500 dark:text-slate-400">Selected</p>
                <p className="text-2xl font-bold">{getStoryName(storyTimer.currentStory)}</p>
            </div>
            <div className="text-5xl font-mono font-bold text-center">
                {formatTime(storyTimer.time)}
            </div>
            <div className="text-center sm:text-right">
                 <p className="text-slate-500 dark:text-slate-400">Goal</p>
                 <p className="text-2xl font-bold font-mono">{formatTime(storyTimer.targetTime * 10)}</p>
            </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
            <motion.div 
                className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                initial={{ width: '0%' }}
                animate={{ width: `${percentage}%` }}
            />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
            <AnimatedButton onClick={startStoryTimer} disabled={storyTimer.isRunning} className="bg-green-500 text-white" icon={<FaPlay />}>
                {storyTimer.isPaused ? "Resume" : "Start"}
            </AnimatedButton>
            <AnimatedButton onClick={pauseStoryTimer} disabled={!storyTimer.isRunning} className="bg-yellow-500 text-white" icon={<FaPause />}>Pause</AnimatedButton>
            <AnimatedButton onClick={resetStoryTimer} disabled={storyTimer.time === 0} className="bg-red-500 text-white" icon={<FaRedo />}>Reset</AnimatedButton>
            <AnimatedButton onClick={() => stopStoryTimer(true)} disabled={storyTimer.time === 0} className="bg-purple-600 text-white" icon={<FaSave />}>Record</AnimatedButton>
        </div>
      </div>

      {/* Story Display Modal */}
      <AnimatePresence>
        {showStory && <StoryDisplayModal story={currentStory} onClose={pauseStoryTimer} />}
      </AnimatePresence>
    </div>
  );
};

export default StoriesView;
