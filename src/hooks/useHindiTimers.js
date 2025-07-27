// src/features/hindi/hooks/useHindiTimers.js

import { useState, useRef, useCallback } from 'react';
import { formatTime, getStoryName, calculateQuality } from '../utilities/helpers';
import { hindiStories, storyTargets } from '../data/stories';

export const useHindiTimers = (saveToFirebase, showNotification) => {
  const [soundTimers, setSoundTimers] = useState({
    आ: { time: 0, isRunning: false },
    ई: { time: 0, isRunning: false },
    ऊ: { time: 0, isRunning: false },
  });
  const [varnmalaTimer, setVarnmalaTimer] = useState({ time: 0, isRunning: false, isPaused: false, laps: [] });
  const [storyTimer, setStoryTimer] = useState({ time: 0, isRunning: false, isPaused: false, currentStory: 'short', targetTime: 300 });
  
  const [currentStory, setCurrentStory] = useState(null);
  const [showStory, setShowStory] = useState(false);
  const [showVarnmala, setShowVarnmala] = useState(false);

  const intervals = useRef({});

  // --- Sound Timer Functions ---
  const startSoundTimer = useCallback((sound) => {
    if (soundTimers[sound].isRunning) return;
    setSoundTimers(prev => ({ ...prev, [sound]: { ...prev[sound], isRunning: true } }));
    intervals.current[sound] = setInterval(() => {
      setSoundTimers(prev => ({ ...prev, [sound]: { ...prev[sound], time: prev[sound].time + 1 } }));
    }, 100);
  }, [soundTimers]);

  const stopSoundTimer = useCallback((sound, shouldRecord = false) => {
    clearInterval(intervals.current[sound]);
    const currentTime = soundTimers[sound].time;
    setSoundTimers(prev => ({ ...prev, [sound]: { time: shouldRecord ? 0 : currentTime, isRunning: false } }));
    
    if (shouldRecord && currentTime > 0) {
      const record = { sound, time: currentTime, timestamp: new Date() };
      saveToFirebase('sounds', record);
      showNotification(`${sound} का समय (${formatTime(currentTime)}) रिकॉर्ड किया गया`, "success");
    }
  }, [soundTimers, saveToFirebase, showNotification]);

  // --- Varnmala Timer Functions ---
  const startVarnmalaTimer = useCallback(() => {
    if (varnmalaTimer.isRunning) return;
    setShowVarnmala(true);
    setVarnmalaTimer(prev => ({ ...prev, isRunning: true, isPaused: false }));
    intervals.current.varnmala = setInterval(() => {
        setVarnmalaTimer(prev => ({ ...prev, time: prev.time + 1 }));
    }, 100);
    showNotification("वर्णमाला टाइमर शुरू!", "info");
  }, [varnmalaTimer, showNotification]);

  const pauseVarnmalaTimer = useCallback(() => {
    if (!varnmalaTimer.isRunning) return;
    clearInterval(intervals.current.varnmala);
    setVarnmalaTimer(prev => ({...prev, isRunning: false, isPaused: true}));
    showNotification("वर्णमाला टाइमर रोक दिया गया", "info");
  }, [varnmalaTimer, showNotification]);

  const addVarnmalaLap = useCallback(() => {
    if (!varnmalaTimer.isRunning) return;
    const lapTime = varnmalaTimer.time;
    setVarnmalaTimer(prev => ({
        ...prev,
        laps: [...prev.laps, { time: lapTime, formattedTime: formatTime(lapTime) }]
    }));
    showNotification(`लैप ${varnmalaTimer.laps.length + 1} रिकॉर्ड किया गया: ${formatTime(lapTime)}`, "success");
  }, [varnmalaTimer, showNotification]);

  const stopVarnmalaTimer = useCallback((shouldRecord = false) => {
    clearInterval(intervals.current.varnmala);
    const currentTime = varnmalaTimer.time;
    if (shouldRecord && currentTime > 0) {
        const quality = calculateQuality(currentTime / 10);
        const record = { time: currentTime, quality, laps: varnmalaTimer.laps, timestamp: new Date() };
        saveToFirebase('varnmala', record);
        showNotification(`वर्णमाला अभ्यास (${quality}) रिकॉर्ड किया गया`, "success");
    }
    setVarnmalaTimer({ time: 0, isRunning: false, isPaused: false, laps: [] });
    setShowVarnmala(false);
  }, [varnmalaTimer, saveToFirebase, showNotification]);
  
  // --- Story Timer Functions ---
  const startStoryTimer = useCallback(() => {
    if (storyTimer.isRunning) return;
    const storiesOfType = hindiStories[storyTimer.currentStory] || hindiStories.short;
    const randomStory = storiesOfType[Math.floor(Math.random() * storiesOfType.length)];
    setCurrentStory(randomStory);
    setShowStory(true);
    setStoryTimer(prev => ({ ...prev, isRunning: true, isPaused: false }));
    intervals.current.story = setInterval(() => {
        setStoryTimer(prev => ({ ...prev, time: prev.time + 1 }));
    }, 100);
    showNotification("पठन टाइमर शुरू!", "info");
  }, [storyTimer, showNotification]);

  const pauseStoryTimer = useCallback(() => {
    if (!storyTimer.isRunning) return;
    clearInterval(intervals.current.story);
    setStoryTimer(prev => ({...prev, isRunning: false, isPaused: true}));
    setShowStory(false); // <-- THE FIX: This now also hides the story modal
    showNotification("पठन टाइमर रोक दिया गया", "info");
  }, [storyTimer, showNotification]);
  
  const resetStoryTimer = useCallback(() => {
    clearInterval(intervals.current.story);
    setStoryTimer(prev => ({...prev, time: 0, isRunning: false, isPaused: false}));
    setShowStory(false);
    setCurrentStory(null);
    showNotification("पठन टाइमर रीसेट कर दिया गया", "info");
  }, [showNotification]);

  const stopStoryTimer = useCallback((shouldRecord = false) => {
    clearInterval(intervals.current.story);
    const currentTime = storyTimer.time;
    if (shouldRecord && currentTime > 0) {
        const targetTime = storyTimer.targetTime * 10;
        const percentage = Math.round((currentTime / targetTime) * 100);
        const record = {
            storyType: storyTimer.currentStory,
            storyTitle: currentStory?.title || "Unknown",
            time: currentTime,
            targetTime,
            percentage,
            timestamp: new Date(),
        };
        saveToFirebase('stories', record);
        showNotification(`${getStoryName(storyTimer.currentStory)} का अभ्यास रिकॉर्ड किया गया`, "success");
    }
    setStoryTimer(prev => ({ ...prev, time: 0, isRunning: false, isPaused: false }));
    setShowStory(false);
    setCurrentStory(null);
  }, [storyTimer, currentStory, saveToFirebase, showNotification]);

  return {
    soundTimers,
    varnmalaTimer,
    storyTimer,
    currentStory,
    showStory,
    showVarnmala,
    startSoundTimer,
    stopSoundTimer,
    startVarnmalaTimer,
    pauseVarnmalaTimer,
    addVarnmalaLap,
    stopVarnmalaTimer,
    startStoryTimer,
    pauseStoryTimer,
    resetStoryTimer,
    stopStoryTimer,
    setStoryTimer,
  };
};
