import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { formatTime, calculateQuality } from '../utilities/helpers';
import { hindiStories } from '../data/stories';

export const useHindiTimers = (saveToFirebase, showNotification, records) => {
    const [soundTimers, setSoundTimers] = useState({
        'आ': { time: 0, isRunning: false },
        'ई': { time: 0, isRunning: false },
        'ऊ': { time: 0, isRunning: false },
    });
    const [varnmalaTimer, setVarnmalaTimer] = useState({ time: 0, isRunning: false, isPaused: false, laps: [] });
    const [storyTimer, setStoryTimer] = useState({ time: 0, isRunning: false, isPaused: false });
    
    // State for the story itself is better managed separately
    const [currentStory, setCurrentStory] = useState(null);

    // Using a ref for intervals is correct, prevents re-creation on renders
    const intervals = useRef({});

    // --- EFFECT for Cleanup ---
    // This is crucial to prevent memory leaks. It clears all running intervals
    // when the component using this hook unmounts.
    useEffect(() => {
        const activeIntervals = intervals.current;
        return () => {
            Object.values(activeIntervals).forEach(clearInterval);
        };
    }, []);


    // --- MEMOIZED VALUES ---
    const bestTimes = useMemo(() => {
        const bests = { 'आ': Infinity, 'ई': Infinity, 'ऊ': Infinity };
        if (records?.sounds) {
            records.sounds.forEach(rec => {
                // BUG FIX: Best time should be the LOWEST time, not the highest.
                if (rec.time < bests[rec.sound]) {
                    bests[rec.sound] = rec.time;
                }
            });
        }
        return bests;
    }, [records]);

    // --- SOUND TIMER FUNCTIONS ---
    // Uses functional updates to avoid stale state and unnecessary dependencies.
    const startSoundTimer = useCallback((sound) => {
        // Guard against starting a timer that's already running
        if (intervals.current[sound]) return;

        setSoundTimers(prev => ({ ...prev, [sound]: { ...prev[sound], isRunning: true } }));
        
        intervals.current[sound] = setInterval(() => {
            setSoundTimers(prev => ({ 
                ...prev, 
                [sound]: { ...prev[sound], time: prev[sound].time + 1 } 
            }));
        }, 100);
    }, []); // Empty dependency array makes this function stable

    const stopSoundTimer = useCallback((sound, shouldRecord = false) => {
        clearInterval(intervals.current[sound]);
        intervals.current[sound] = null;

        let finalTime = 0;
        setSoundTimers(prev => {
            finalTime = prev[sound].time; // Capture the final time safely
            return {
                ...prev,
                [sound]: { time: 0, isRunning: false }
            };
        });
        
        if (shouldRecord && finalTime > 0) {
            // BUG FIX: Comparison was incorrect. Lower is better.
            const isNewBest = finalTime < bestTimes[sound];
            const record = {
                sound,
                time: finalTime,
                isNewBest,
                timestamp: new Date(),
                sessionCount: ((records?.sounds || []).filter(r => r.sound === sound).length) + 1,
            };
            saveToFirebase('sounds', record);
            
            const message = isNewBest
                ? `नया सर्वश्रेष्ठ समय! ${formatTime(finalTime)}`
                : `${sound} का समय (${formatTime(finalTime)}) रिकॉर्ड किया गया`;
            showNotification(message, isNewBest ? "success" : "info");
        }
    }, [saveToFirebase, showNotification, bestTimes, records]);

    // --- VARNMALA TIMER FUNCTIONS ---
    const startVarnmalaTimer = useCallback(() => {
        if (intervals.current.varnmala) return;
        
        setVarnmalaTimer(prev => ({ ...prev, isRunning: true, isPaused: false }));
        intervals.current.varnmala = setInterval(() => {
            setVarnmalaTimer(prev => ({ ...prev, time: prev.time + 1 }));
        }, 100);
        showNotification("वर्णमाला टाइमर शुरू!", "info");
    }, [showNotification]);

    const pauseVarnmalaTimer = useCallback(() => {
        if (!intervals.current.varnmala) return;
        
        clearInterval(intervals.current.varnmala);
        intervals.current.varnmala = null;
        setVarnmalaTimer(prev => ({ ...prev, isRunning: false, isPaused: true }));
        showNotification("वर्णमाला टाइमर रोक दिया गया", "info");
    }, [showNotification]);

    const addVarnmalaLap = useCallback(() => {
        setVarnmalaTimer(prev => {
            const newLap = { time: prev.time, formattedTime: formatTime(prev.time) };
            showNotification(`लैप ${prev.laps.length + 1} रिकॉर्ड किया गया: ${newLap.formattedTime}`, "success");
            return {
                ...prev,
                laps: [...prev.laps, newLap]
            };
        });
    }, [showNotification]);

    const stopVarnmalaTimer = useCallback((shouldRecord = false) => {
        clearInterval(intervals.current.varnmala);
        intervals.current.varnmala = null;

        if (shouldRecord && varnmalaTimer.time > 0) {
            const quality = calculateQuality(varnmalaTimer.time / 10);
            const record = { time: varnmalaTimer.time, quality, laps: varnmalaTimer.laps, timestamp: new Date() };
            saveToFirebase('varnmala', record);
            showNotification(`वर्णमाला अभ्यास (${quality}) रिकॉर्ड किया गया`, "success");
        }
        setVarnmalaTimer({ time: 0, isRunning: false, isPaused: false, laps: [] });
    }, [varnmalaTimer, saveToFirebase, showNotification]);
    
    // --- STORY TIMER FUNCTIONS ---
    const startStoryTimer = useCallback(() => {
        if (intervals.current.story) return;

        // LOGIC FIX: Only select a new story if one isn't already active (e.g., on Resume)
        if (!currentStory) {
             const randomStory = hindiStories[Math.floor(Math.random() * hindiStories.length)];
             setCurrentStory(randomStory);
        }

        setStoryTimer(prev => ({ ...prev, isRunning: true, isPaused: false }));
        intervals.current.story = setInterval(() => {
            setStoryTimer(prev => ({ ...prev, time: prev.time + 1 }));
        }, 100);
        showNotification("पठन टाइमर शुरू!", "info");
    }, [showNotification, currentStory]);

    const pauseStoryTimer = useCallback(() => {
        if (!intervals.current.story) return;
        
        clearInterval(intervals.current.story);
        intervals.current.story = null;
        setStoryTimer(prev => ({ ...prev, isRunning: false, isPaused: true }));
        showNotification("पठन टाइमर रोक दिया गया", "info");
    }, [showNotification]);
    
    const resetStoryTimer = useCallback(() => {
        clearInterval(intervals.current.story);
        intervals.current.story = null;
        setStoryTimer({ time: 0, isRunning: false, isPaused: false });
        setCurrentStory(null);
        showNotification("पठन टाइमर रीसेट कर दिया गया", "info");
    }, [showNotification]);

    const stopStoryTimer = useCallback((storyToRecord) => {
        clearInterval(intervals.current.story);
        intervals.current.story = null;

        if (storyTimer.time > 0) {
            const record = {
                storyTitle: storyToRecord?.title || "Unknown",
                time: storyTimer.time,
                timestamp: new Date(),
            };
            saveToFirebase('stories', record);
            showNotification(`पठन अभ्यास (${formatTime(storyTimer.time)}) रिकॉर्ड किया गया`, "success");
        }
        // Reset everything
        setStoryTimer({ time: 0, isRunning: false, isPaused: false });
        setCurrentStory(null);
    }, [storyTimer, saveToFirebase, showNotification]);

    return {
        soundTimers,
        bestTimes,
        varnmalaTimer,
        storyTimer,
        currentStory,
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
        setCurrentStory,
    };
};