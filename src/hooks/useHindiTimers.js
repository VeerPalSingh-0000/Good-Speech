// src/features/hindi/hooks/useHindiTimers.js

import { useState, useRef, useCallback, useMemo } from 'react';
import { formatTime, getStoryName, calculateQuality } from '../utilities/helpers';
import { hindiStories } from '../data/stories';

export const useHindiTimers = (saveToFirebase, showNotification, records) => {
  const [soundTimers, setSoundTimers] = useState({
    आ: { time: 0, isRunning: false },
    ई: { time: 0, isRunning: false },
    ऊ: { time: 0, isRunning: false },
  });
  const [varnmalaTimer, setVarnmalaTimer] = useState({ time: 0, isRunning: false, isPaused: false, laps: [] });
  const [storyTimer, setStoryTimer] = useState({ 
    time: 0, 
    isRunning: false, 
    isPaused: false, 
    targetTime: Infinity // No time limit
  });
  
  const [currentStory, setCurrentStory] = useState(null);
  const [showStory, setShowStory] = useState(false);
  const [showVarnmala, setShowVarnmala] = useState(false);

  const intervals = useRef({});

  const bestTimes = useMemo(() => {
    const bests = { 'आ': 0, 'ई': 0, 'ऊ': 0 };
    if (records?.sounds) {
      records.sounds.forEach(rec => {
        if (rec.time > (bests[rec.sound] || 0)) {
          bests[rec.sound] = rec.time;
        }
      });
    }
    return bests;
  }, [records]);

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
      const isNewBest = currentTime > (bestTimes[sound] || 0);
      const record = {
        sound,
        time: currentTime,
        isNewBest: isNewBest,
        timestamp: new Date(),
        sessionCount: ((records?.sounds || []).filter(r => r.sound === sound).length) + 1,
      };
      saveToFirebase('sounds', record);
      if (isNewBest) {
        showNotification(`नया सर्वश्रेष्ठ समय! ${formatTime(currentTime)}`, "success");
      } else {
        showNotification(`${sound} का समय (${formatTime(currentTime)}) रिकॉर्ड किया गया`, "info");
      }
    }
  }, [soundTimers, saveToFirebase, showNotification, bestTimes, records]);

  // --- Varnmala Timer Functions (Now fully implemented) ---
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
    const randomStory = hindiStories[Math.floor(Math.random() * hindiStories.length)];
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
    setShowStory(false);
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
        const record = {
            storyType: "Open Practice",
            storyTitle: currentStory?.title || "Unknown",
            time: currentTime,
            targetTime: null,
            percentage: null,
            timestamp: new Date(),
        };
        saveToFirebase('stories', record);
        showNotification(`Open Practice session of ${formatTime(currentTime)} recorded!`, "success");
    }
    setStoryTimer(prev => ({ ...prev, time: 0, isRunning: false, isPaused: false, targetTime: Infinity }));
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
