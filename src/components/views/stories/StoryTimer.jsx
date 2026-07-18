import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaSave, FaRedo } from 'react-icons/fa';
import { formatTime } from '../../../utilities/helpers';
import AudioVisualizer from '../../ui/AudioVisualizer';

const AnimatedButton = ({ children, icon, className = "", active = false, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.03, y: -2 }}
    whileTap={{ scale: 0.97 }}
    className={`flex items-center justify-center gap-2.5 px-6 py-3 font-bold rounded-xl shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${active ? 'ring-2 ring-white/50 shadow-lg' : ''} ${className}`}
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
  active: PropTypes.bool,
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
    className="relative p-8 md:p-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/60 dark:border-slate-700/60 space-y-8 overflow-hidden"
  >
    {/* Decorative Background Elements */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/5 to-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/5 to-indigo-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

    <div className="relative z-10 flex flex-col items-center gap-5">
      <div className="inline-flex items-center justify-center px-4 py-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-full border border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 text-sm font-bold tracking-wide uppercase">
        Open Practice Session
      </div>
      
      <motion.div
        animate={{ scale: storyTimer.isRunning ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        className="text-6xl md:text-8xl font-mono font-black text-center bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent drop-shadow-sm tracking-tight"
      >
        {formatTime(storyTimer.time)}
      </motion.div>

      {storyTimer.isRunning && (
        <div className="flex items-center gap-2.5 text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800/30 animate-pulse">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <span>Timer is active</span>
        </div>
      )}

      <div className="h-16 flex items-center justify-center w-full max-w-md mt-2">
        {storyTimer.isRunning && analyser ? (
          <AudioVisualizer 
            analyser={analyser} 
            isRecording={storyTimer.isRunning} 
            colors={['#10b981', '#6366f1']}
            width={300}
            height={60}
          />
        ) : audioUrl ? (
          <audio src={audioUrl} controls className="w-full opacity-90 transition-opacity hover:opacity-100" />
        ) : null}
      </div>
    </div>

    <div className="relative z-10 flex flex-wrap justify-center gap-4 pt-8 border-t border-slate-200/60 dark:border-slate-700/60">
      <AnimatedButton
        onClick={onStart}
        disabled={storyTimer.isRunning}
        className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-emerald-500/25 focus:ring-emerald-500/50 border border-emerald-400/20"
        icon={<FaPlay />}
        active={storyTimer.isRunning}
      >
        {storyTimer.isPaused ? "Resume" : "Start"}
      </AnimatedButton>
      <AnimatedButton
        onClick={onPause}
        disabled={!storyTimer.isRunning}
        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/25 focus:ring-amber-500/50 border border-amber-400/20"
        icon={<FaPause />}
        active={storyTimer.isPaused}
      >
        Pause
      </AnimatedButton>
      <AnimatedButton
        onClick={onReset}
        disabled={storyTimer.time === 0}
        className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white shadow-rose-500/25 focus:ring-rose-500/50 border border-rose-400/20"
        icon={<FaRedo />}
      >
        Reset
      </AnimatedButton>
      <AnimatedButton
        onClick={() => onStop(currentStory)}
        disabled={storyTimer.time === 0 || !currentStory}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/25 focus:ring-purple-500/50 border border-purple-400/20"
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
