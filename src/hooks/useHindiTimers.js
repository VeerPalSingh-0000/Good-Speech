import { useState, useRef, useCallback, useMemo, useEffect } from "react";

import { formatTime, calculateQuality } from "../utilities/helpers";

import { allStories } from "../data/stories/index";

export const useHindiTimers = (saveToFirebase, showNotification, records) => {
  const [soundTimers, setSoundTimers] = useState({
    आ: { time: 0, isRunning: false },
    ई: { time: 0, isRunning: false },
    ऊ: { time: 0, isRunning: false },
    क: { time: 0, isRunning: false },
    ख: { time: 0, isRunning: false },
    ग: { time: 0, isRunning: false },
    घ: { time: 0, isRunning: false },
    त: { time: 0, isRunning: false },
    थ: { time: 0, isRunning: false },
    द: { time: 0, isRunning: false },
    ध: { time: 0, isRunning: false },
  });

  const [varnmalaTimer, setVarnmalaTimer] = useState({
    time: 0,
    isRunning: false,
    isPaused: false,
    laps: [],
  });

  const [storyTimer, setStoryTimer] = useState({
    time: 0,
    isRunning: false,
    isPaused: false,
  }); // State for the story itself is better managed separately

  const [currentStory, setCurrentStory] = useState(null); // Using a ref for intervals is correct, prevents re-creation on renders

  const soundTimersRef = useRef(soundTimers);
  const varnmalaTimerRef = useRef(varnmalaTimer);
  const storyTimerRef = useRef(storyTimer);

  const intervals = useRef({}); // --- EFFECT for Cleanup --- // This is crucial to prevent memory leaks. It clears all running intervals // when the component using this hook unmounts.

  useEffect(() => {
    const activeIntervals = intervals.current;

    return () => {
      Object.values(activeIntervals).forEach(clearInterval);
    };
  }, []);

  useEffect(() => {
    soundTimersRef.current = soundTimers;
  }, [soundTimers]);

  useEffect(() => {
    varnmalaTimerRef.current = varnmalaTimer;
  }, [varnmalaTimer]);

  useEffect(() => {
    storyTimerRef.current = storyTimer;
  }, [storyTimer]);

  // --- BUG FIX: StrictMode Double Save Prevention ---
  const saveLockRef = useRef(false);

  const saveSafely = useCallback(
    (type, record, audioBlob = null) => {
      if (saveLockRef.current) return;
      saveLockRef.current = true;
      saveToFirebase(type, record, audioBlob);
      // Automatically unlock after a short delay (gives React time to settle in StrictMode)
      setTimeout(() => {
        saveLockRef.current = false;
      }, 500);
    },
    [saveToFirebase],
  );

  // --- MEMOIZED VALUES ---

  const bestTimes = useMemo(() => {
    const bests = {
      आ: 0,
      ई: 0,
      ऊ: 0,
      क: 0,
      ख: 0,
      ग: 0,
      घ: 0,
      त: 0,
      थ: 0,
      द: 0,
      ध: 0,
    };

    if (records?.sounds) {
      records.sounds.forEach((rec) => {
        // BUG FIX: Best time should be the LOWEST time, not the highest.

        if (rec.time > bests[rec.sound]) {
          bests[rec.sound] = rec.time;
        }
      });
    }

    return bests;
  }, [records]); // --- SOUND TIMER FUNCTIONS --- // Uses functional updates to avoid stale state and unnecessary dependencies.

  const startSoundTimer = useCallback((sound) => {
    // Guard against starting a timer that's already running

    if (intervals.current[sound]) return;

    setSoundTimers((prev) => ({
      ...prev,
      [sound]: { ...prev[sound], isRunning: true },
    }));

    intervals.current[sound] = setInterval(() => {
      setSoundTimers((prev) => ({
        ...prev,

        [sound]: { ...prev[sound], time: prev[sound].time + 1 },
      }));
    }, 100);
  }, []); // Empty dependency array makes this function stable

  const stopSoundTimer = useCallback(
    (sound, shouldRecord = false) => {
      clearInterval(intervals.current[sound]);
      intervals.current[sound] = null;

      const finalTime = soundTimersRef.current[sound]?.time || 0;

      if (shouldRecord && finalTime > 0) {
        const isNewBest = finalTime > (bestTimes[sound] || Infinity);

        const record = {
          sound,
          time: finalTime,
          isNewBest,
          timestamp: new Date(),
          sessionCount:
            (records?.sounds || []).filter((r) => r.sound === sound).length + 1,
        };

        saveSafely(
          "sounds",
          record,
          shouldRecord instanceof Blob ? shouldRecord : undefined,
        );

        const message = isNewBest
          ? `नया सर्वश्रेष्ठ समय! ${formatTime(finalTime)}`
          : `${sound} का समय (${formatTime(finalTime)}) रिकॉर्ड किया गया`;

        showNotification(message, isNewBest ? "success" : "info");
      }

      setSoundTimers((prev) => ({
        ...prev,
        [sound]: {
          time: shouldRecord ? 0 : prev[sound].time,
          isRunning: false,
        },
      }));
    },
    [saveSafely, showNotification, bestTimes, records],
  ); // --- VARNMALA TIMER FUNCTIONS ---

  const startVarnmalaTimer = useCallback(() => {
    if (intervals.current.varnmala) return;

    setVarnmalaTimer((prev) => ({ ...prev, isRunning: true, isPaused: false }));

    intervals.current.varnmala = setInterval(() => {
      setVarnmalaTimer((prev) => ({ ...prev, time: prev.time + 1 }));
    }, 100);

    showNotification("वर्णमाला टाइमर शुरू!", "info");
  }, [showNotification]);

  const pauseVarnmalaTimer = useCallback(() => {
    if (!intervals.current.varnmala) return;

    clearInterval(intervals.current.varnmala);

    intervals.current.varnmala = null;

    setVarnmalaTimer((prev) => ({ ...prev, isRunning: false, isPaused: true }));

    showNotification("वर्णमाला टाइमर रोक दिया गया", "info");
  }, [showNotification]);

  const addVarnmalaLap = useCallback(() => {
    setVarnmalaTimer((prev) => {
      const newLap = { time: prev.time, formattedTime: formatTime(prev.time) };

      showNotification(
        `लैप ${prev.laps.length + 1} रिकॉर्ड किया गया: ${newLap.formattedTime}`,
        "success",
      );

      return {
        ...prev,

        laps: [...prev.laps, newLap],
      };
    });
  }, [showNotification]);

  const stopVarnmalaTimer = useCallback(
    (shouldRecord = false) => {
      clearInterval(intervals.current.varnmala);
      intervals.current.varnmala = null;

      const finalTime = varnmalaTimerRef.current.time;

      if (shouldRecord && finalTime > 0) {
        const quality = calculateQuality(finalTime / 10);
        const record = {
          time: finalTime,
          quality,
          laps: varnmalaTimerRef.current.laps,
          timestamp: new Date(),
        };

        saveSafely("varnmala", record);

        showNotification(
          `वर्णमाला अभ्यास (${quality}) रिकॉर्ड किया गया`,
          "success",
        );

        setVarnmalaTimer({
          time: 0,
          isRunning: false,
          isPaused: false,
          laps: [],
        });
      } else {
        setVarnmalaTimer((prev) => ({
          ...prev,
          isRunning: false,
          isPaused: true,
        }));
      }
    },
    [saveSafely, showNotification],
  ); // --- STORY TIMER FUNCTIONS ---

  const startStoryTimer = useCallback(() => {
    if (intervals.current.story) return; // LOGIC FIX: Only select a new story if one isn't already active (e.g., on Resume)

    if (!currentStory) {
      const randomStory =
        allStories[Math.floor(Math.random() * allStories.length)];

      setCurrentStory(randomStory);
    }

    setStoryTimer((prev) => ({ ...prev, isRunning: true, isPaused: false }));

    intervals.current.story = setInterval(() => {
      setStoryTimer((prev) => ({ ...prev, time: prev.time + 1 }));
    }, 100);

    showNotification("पठन टाइमर शुरू!", "info");
  }, [showNotification, currentStory]);

  const pauseStoryTimer = useCallback(() => {
    if (!intervals.current.story) return;

    clearInterval(intervals.current.story);

    intervals.current.story = null;

    setStoryTimer((prev) => ({ ...prev, isRunning: false, isPaused: true }));

    showNotification("पठन टाइमर रोक दिया गया", "info");
  }, [showNotification]);

  const resetStoryTimer = useCallback(() => {
    clearInterval(intervals.current.story);

    intervals.current.story = null;

    setStoryTimer({ time: 0, isRunning: false, isPaused: false });

    setCurrentStory(null);

    showNotification("पठन टाइमर रीसेट कर दिया गया", "info");
  }, [showNotification]);

  const stopStoryTimer = useCallback(
    (storyToRecord, audioBlob = null) => {
      clearInterval(intervals.current.story);
      intervals.current.story = null;

      const finalTime = storyTimerRef.current.time;

      if (finalTime > 0) {
        const record = {
          storyTitle: storyToRecord?.title || "Unknown",
          time: finalTime,
          timestamp: new Date(),
        };

        saveSafely(
          "stories",
          record,
          audioBlob instanceof Blob ? audioBlob : null,
        );

        showNotification(
          `पठन अभ्यास (${formatTime(finalTime)}) रिकॉर्ड किया गया`,
          "success",
        );
      }

      setStoryTimer({ time: 0, isRunning: false, isPaused: false });
      setCurrentStory(null);
    },
    [saveSafely, showNotification],
  );

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
