import { useState, useEffect, useCallback, useRef } from 'react';

// Average length of a Hindi word for duration normalization
const AVERAGE_WORD_LENGTH = 5;

/**
 * Hook to manage a smooth reading guide.
 * @param {Array} words - Flat array of word objects { word, globalWordIdx, ... }
 * @param {number} targetWPM - Target Words Per Minute
 * @returns {Object} Controls and state for the reader
 */
export const useSmoothReader = (words = [], targetWPM = 60) => {
  const [isReading, setIsReading] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const timerRef = useRef(null);

  // Calculate duration in seconds for a specific word based on WPM and length
  const getWordDuration = useCallback((wordStr) => {
    // Base duration per word in seconds
    const baseDuration = 60 / (targetWPM || 60); 
    
    if (!wordStr) return baseDuration;

    // Add fixed time for punctuation pauses (in seconds)
    let pauseDuration = 0;
    if (wordStr.includes(',') || wordStr.includes(';')) pauseDuration = 0.6;
    if (wordStr.includes('.') || wordStr.includes('!') || wordStr.includes('?') || wordStr.includes('।') || wordStr.includes('|') || wordStr.includes('॥')) pauseDuration = 1.2;

    // Remove punctuation for length calculation
    const cleanWord = wordStr.replace(/[.,!?।|॥\-\s]/g, '');
    
    // Softer length scaling so short words aren't rushed
    const lengthRatio = Math.max(0.4, 0.6 + (cleanWord.length * 0.08)); 
    
    return (baseDuration * lengthRatio) + pauseDuration;
  }, [targetWPM]);

  const stop = useCallback(() => {
    setIsReading(false);
    setActiveWordIndex(-1);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const pause = useCallback(() => {
    setIsReading(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const play = useCallback(() => {
    if (words.length === 0) return;
    
    // If we're at the end or haven't started, start from 0
    if (activeWordIndex === -1 || activeWordIndex >= words.length - 1) {
      setActiveWordIndex(0);
    }
    setIsReading(true);
  }, [activeWordIndex, words.length]);

  const jumpToWord = useCallback((index) => {
    if (index >= 0 && index < words.length) {
      setActiveWordIndex(index);
    }
  }, [words.length]);

  // Main reading loop
  useEffect(() => {
    if (!isReading || activeWordIndex === -1 || activeWordIndex >= words.length) {
      return;
    }

    const currentWord = words[activeWordIndex];
    if (!currentWord) {
      stop();
      return;
    }

    const durationSeconds = getWordDuration(currentWord.word);
    
    timerRef.current = setTimeout(() => {
      setActiveWordIndex(prev => {
        const next = prev + 1;
        if (next >= words.length) {
          setIsReading(false);
          return -1; // Reset or stop
        }
        return next;
      });
    }, durationSeconds * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isReading, activeWordIndex, words, getWordDuration, stop]);

  return {
    isReading,
    activeWordIndex,
    play,
    pause,
    stop,
    jumpToWord,
    getWordDuration
  };
};
