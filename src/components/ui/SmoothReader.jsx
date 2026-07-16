import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SmoothWord = ({ wordObj, isActive, isPast, duration, onClick }) => {
  const wordRef = useRef(null);

  useEffect(() => {
    // Scroll the active word into view smoothly
    if (isActive && wordRef.current) {
      wordRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isActive]);

  const displayWord = wordObj.word;

  return (
    <span 
      ref={wordRef}
      onClick={() => onClick(wordObj.globalWordIdx)}
      className={`relative inline-block cursor-pointer px-1 rounded-md transition-all duration-200 ${isActive ? 'scale-105' : ''}`}
    >
      {/* Gliding Background Bubble */}
      {isActive && (
        <motion.span 
          layoutId="guidedReadingHighlight"
          className="absolute inset-0 bg-indigo-200 dark:bg-indigo-600/80 rounded-md z-0"
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      )}
      
      {/* Text Layer */}
      <span className={`relative z-10 transition-colors duration-300 ${
        isActive ? 'text-indigo-900 dark:text-white font-bold' : 
        isPast ? 'text-slate-800 dark:text-slate-200' : 
        'text-slate-400 dark:text-slate-500'
      }`}>
        {displayWord}
      </span>
    </span>
  );
};

/**
 * SmoothReader component renders the text and handles smooth highlighting.
 * @param {Array} parsedText - Array of line objects: { lineIdx, wordObjects: [ { word, globalWordIdx }, ... ] }
 * @param {Object} readerState - State returned from useSmoothReader hook
 */
const SmoothReader = ({ parsedText, readerState }) => {
  const { activeWordIndex, jumpToWord, getWordDuration } = readerState;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {parsedText.map((lineObj) => (
        <div key={lineObj.lineIdx} className="flex flex-wrap items-end mb-6">
          {lineObj.wordObjects.map((w) => {
            const isActive = activeWordIndex === w.globalWordIdx;
            const isPast = activeWordIndex > w.globalWordIdx;
            const duration = isActive ? getWordDuration(w.word) : 0;

            return (
              <SmoothWord
                key={w.globalWordIdx}
                wordObj={w}
                isActive={isActive}
                isPast={isPast}
                duration={duration}
                onClick={jumpToWord}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SmoothReader;
