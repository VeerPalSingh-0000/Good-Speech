import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaSave, FaRedo } from 'react-icons/fa';
import { formatTime } from '../../../utilities/helpers';
import AudioVisualizer from '../../ui/AudioVisualizer';

const AnimatedButton = ({ children, icon, className = "", ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {icon}
    <span>{children}</span>
  </motion.button>
);

AnimatedButton.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.element,
  className: PropTypes.string,
};

const StoryTimer = ({
  storyTimer,
  onStart,
  onPause,
  onReset,
  onStop,
  currentStory,
  analyser,
  audioUrl,
}) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 100 }}
    className="p-8 md:p-12 bg-white dark:bg-slate-800/50 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 space-y-8"
  >
    <div className="flex flex-col items-center gap-4">
      <p className="text-slate-500 dark:text-slate-400 text-xl font-semibold">
        Open Practice Session
      </p>
      <motion.div
        animate={{ scale: storyTimer.isRunning ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        className="text-6xl md:text-7xl font-mono font-bold text-center bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
      >
        {formatTime(storyTimer.time)}
      </motion.div>

      {storyTimer.isRunning && (
        <div className="flex items-center gap-2 text-green-500 dark:text-green-400 font-semibold animate-pulse">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Timer is active</span>
        </div>
      )}

      <div className="h-16 flex items-center justify-center w-full max-w-md mt-4">
        {storyTimer.isRunning && analyser ? (
          <AudioVisualizer 
            analyser={analyser} 
            isRecording={storyTimer.isRunning} 
            colors={['#3b82f6', '#8b5cf6']}
            width={300}
            height={60}
          />
        ) : audioUrl ? (
          <audio src={audioUrl} controls className="w-full opacity-90 transition-opacity hover:opacity-100" />
        ) : null}
      </div>
    </div>

    <div className="flex flex-wrap justify-center gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
      <AnimatedButton
        onClick={onStart}
        disabled={storyTimer.isRunning}
        className="bg-green-500 hover:bg-green-600 text-white focus:ring-green-500/50"
        icon={<FaPlay />}
      >
        {storyTimer.isPaused ? "Resume" : "Start"}
      </AnimatedButton>
      <AnimatedButton
        onClick={onPause}
        disabled={!storyTimer.isRunning}
        className="bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500/50"
        icon={<FaPause />}
      >
        Pause
      </AnimatedButton>
      <AnimatedButton
        onClick={onReset}
        disabled={storyTimer.time === 0}
        className="bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/50"
        icon={<FaRedo />}
      >
        Reset
      </AnimatedButton>
      <AnimatedButton
        onClick={() => onStop(currentStory)}
        disabled={storyTimer.time === 0 || !currentStory}
        className="bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500/50"
        icon={<FaSave />}
        title={
          !currentStory
            ? "Select a story first to record your time"
            : "Record session"
        }
      >
        Record
      </AnimatedButton>
    </div>
  </motion.div>
);

StoryTimer.propTypes = {
  storyTimer: PropTypes.object.isRequired,
  onStart: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  currentStory: PropTypes.object,
  analyser: PropTypes.object,
  audioUrl: PropTypes.string,
};

export default StoryTimer;
