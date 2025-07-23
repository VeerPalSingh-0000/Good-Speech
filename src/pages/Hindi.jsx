import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { addResult, getResults, subscribeToResults } from "../../firestore";
const Hindi = ({ user, onLogout }) => {
  // Global state for timers
  const [soundTimers, setSoundTimers] = useState({
    आ: { time: 0, isRunning: false, bestTime: 0, sessions: 0 },
    ई: { time: 0, isRunning: false, bestTime: 0, sessions: 0 },
    ऊ: { time: 0, isRunning: false, bestTime: 0, sessions: 0 },
  });

  const [varnmalaTimer, setVarnmalaTimer] = useState({
    time: 0,
    isRunning: false,
    laps: [],
  });
  const [showVarnmala, setShowVarnmala] = useState(false);

  const [storyTimer, setStoryTimer] = useState({
    time: 0,
    isRunning: false,
    targetTime: 300,
    currentStory: "short",
    isPaused: false,
  });

  const [records, setRecords] = useState({
    sounds: [],
    varnmala: [],
    stories: [],
    dailyGoals: [],
  });

  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(300);
  const [currentView, setCurrentView] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs for intervals
  const soundIntervals = useRef({});
  const varnmalaInterval = useRef(null);
  const storyInterval = useRef(null);
  const audioContext = useRef(null);
  const mediaRecorder = useRef(null);

  const storyTargets = {
    short: 300,
    medium: 600,
    long: 900,
    extended: 1200,
  };

  // ============================================
  // UTILITY FUNCTIONS FIRST (to avoid hoisting issues)
  // ============================================

  const formatTime = useCallback((deciseconds) => {
    const totalSeconds = deciseconds / 10;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(2);

    if (minutes > 0) {
      return `${minutes.toString().padStart(2, "0")}:${seconds.padStart(
        5,
        "0"
      )}`;
    }
    return seconds.padStart(5, "0");
  }, []);

  const getStoryName = useCallback((storyType) => {
    const names = {
      short: "छोटी कहानी",
      medium: "मध्यम कहानी",
      long: "लंबी कहानी",
      extended: "विस्तृत कहानी",
    };
    return names[storyType] || storyType;
  }, []);

  const clearAllIntervals = useCallback(() => {
    Object.values(soundIntervals.current).forEach(clearInterval);
    clearInterval(varnmalaInterval.current);
    clearInterval(storyInterval.current);
  }, []);

  // ============================================
  // AUDIO AND NOTIFICATION FUNCTIONS
  // ============================================

  const initializeAudioContext = useCallback(() => {
    if (soundEnabled && !audioContext.current) {
      try {
        audioContext.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      } catch (error) {
        console.log("Audio context not supported");
      }
    }
  }, [soundEnabled]);

  const playFeedbackSound = useCallback(
    (frequency = 440, duration = 200) => {
      if (!soundEnabled || !audioContext.current) return;

      try {
        const oscillator = audioContext.current.createOscillator();
        const gainNode = audioContext.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.current.destination);

        oscillator.frequency.value = frequency;
        gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.current.currentTime + duration / 1000
        );

        oscillator.start(audioContext.current.currentTime);
        oscillator.stop(audioContext.current.currentTime + duration / 1000);
      } catch (error) {
        console.log("Sound playback failed:", error);
      }
    },
    [soundEnabled]
  );

  const showNotification = useCallback(
    (message, type = "info", duration = 3000) => {
      const id = Date.now();
      const newNotification = { id, message, type, timestamp: new Date() };
      setNotifications((prev) => [...prev.slice(-4), newNotification]);

      const soundMap = { success: 523, error: 147, warning: 294, info: 392 };
      playFeedbackSound(soundMap[type] || 392, 150);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    },
    [playFeedbackSound]
  );

  // ============================================
  // STORAGE FUNCTIONS
  // ============================================

  const saveToStorage = useCallback(() => {
    try {
      localStorage.setItem("hindiTimerRecords", JSON.stringify(records));
      localStorage.setItem("hindiSoundTimers", JSON.stringify(soundTimers));
      localStorage.setItem(
        "hindiSettings",
        JSON.stringify({
          theme,
          soundEnabled,
          weeklyGoal,
          dailyStreak,
        })
      );
    } catch (error) {
      console.error("Storage error:", error);
    }
  }, [records, soundTimers, theme, soundEnabled, weeklyGoal, dailyStreak]);

  // ✅ ADDED THIS PLACEHOLDER FUNCTION TO PREVENT CRASHES
  const saveToFirebase = useCallback(
    async (type, data) => {
      if (user?.uid) {
        try {
          await addResult(user.uid, type, data);
          showNotification(`${type} data saved to cloud.`, "success");
        } catch (error) {
          showNotification(`Failed to save ${type} data to cloud.`, "error");
          console.error("Firebase save error:", error);
        }
      }
    },
    [user, showNotification]
  );

  // Add this new function to fetch data from Firebase
  const loadFromFirebase = useCallback(async () => {
    if (user?.uid) {
      try {
        const unsubscribe = subscribeToResults(user.uid, (data) => {
          setRecords(data);
        });
        return unsubscribe;
      } catch (error) {
        console.error("Firebase load error:", error);
        showNotification("Failed to load data from cloud.", "error");
      }
    }
  }, [user, showNotification]);

  const loadFromStorage = useCallback(async () => {
    try {
      const savedRecords = localStorage.getItem("hindiTimerRecords");
      const savedTimers = localStorage.getItem("hindiSoundTimers");
      const savedSettings = localStorage.getItem("hindiSettings");

      if (savedRecords) {
        setRecords(JSON.parse(savedRecords));
      }

      if (savedTimers) {
        const timers = JSON.parse(savedTimers);
        setSoundTimers((prev) => {
          const updated = { ...prev };
          Object.keys(timers).forEach((sound) => {
            if (updated[sound]) {
              updated[sound].bestTime = timers[sound]?.bestTime || 0;
              updated[sound].sessions = timers[sound]?.sessions || 0;
            }
          });
          return updated;
        });
      }

      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setTheme(settings.theme || "light");
        setSoundEnabled(settings.soundEnabled !== false);
        setWeeklyGoal(settings.weeklyGoal || 300);
        setDailyStreak(settings.dailyStreak || 0);
        document.documentElement.classList.toggle(
          "dark",
          settings.theme === "dark"
        );
      }
    } catch (error) {
      console.error("Loading error:", error);
    }
  }, []);

  // ============================================
  // OTHER UTILITY FUNCTIONS
  // ============================================

  const calculateDailyStreak = useCallback(() => {
    const today = new Date().toDateString();
    const recentRecords = [
      ...records.sounds,
      ...records.varnmala,
      ...records.stories,
    ].filter((record) => {
      const recordDate = new Date(record.timestamp).toDateString();
      return recordDate === today;
    });

    if (recentRecords.length > 0) {
      const streak = parseInt(localStorage.getItem("dailyStreak") || "0") + 1;
      setDailyStreak(streak);
      localStorage.setItem("dailyStreak", streak.toString());
      localStorage.setItem("lastActiveDate", today);
    }
  }, [records]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    playFeedbackSound(newTheme === "dark" ? 200 : 400, 100);
  }, [theme, playFeedbackSound]);

  const deleteRecord = useCallback(
    (type, timestamp) => {
      if (window.confirm("क्या आप इस रिकॉर्ड को हटाना चाहते हैं?")) {
        setRecords((prev) => ({
          ...prev,
          [type]: prev[type].filter((r) => r.timestamp !== timestamp),
        }));
        showNotification("रिकॉर्ड हटा दिया गया", "info");
        saveToStorage();
      }
    },
    [showNotification, saveToStorage]
  );

  // ============================================
  // TIMER FUNCTIONS (now all utilities are defined above)
  // ============================================

  const startSoundTimer = useCallback(
    (sound) => {
      if (soundTimers[sound].isRunning) return;

      setSoundTimers((prev) => ({
        ...prev,
        [sound]: { ...prev[sound], isRunning: true },
      }));

      soundIntervals.current[sound] = setInterval(() => {
        setSoundTimers((prev) => ({
          ...prev,
          [sound]: { ...prev[sound], time: prev[sound].time + 1 },
        }));
      }, 100);

      playFeedbackSound(523, 100);
      showNotification(`${sound} स्वर टाइमर शुरू किया गया`, "info");
    },
    [soundTimers, playFeedbackSound, showNotification]
  );

  const pauseSoundTimer = useCallback(
    (sound) => {
      if (!soundTimers[sound].isRunning) return;

      setSoundTimers((prev) => ({
        ...prev,
        [sound]: { ...prev[sound], isRunning: false },
      }));

      clearInterval(soundIntervals.current[sound]);
      playFeedbackSound(294, 100);
      showNotification(`${sound} स्वर टाइमर रोक दिया गया`, "warning");
    },
    [soundTimers, playFeedbackSound, showNotification]
  );

  const recordTime = useCallback(
    (sound) => {
      const currentTime = soundTimers[sound].time;

      if (currentTime === 0) {
        showNotification("पहले टाइमर चलाएं!", "warning");
        return;
      }

      if (soundTimers[sound].isRunning) {
        pauseSoundTimer(sound);
      }

      let improvement = "";
      const isNewBest =
        soundTimers[sound].bestTime === 0 ||
        currentTime > soundTimers[sound].bestTime;

      if (isNewBest) {
        const oldBest = soundTimers[sound].bestTime;
        setSoundTimers((prev) => ({
          ...prev,
          [sound]: {
            ...prev[sound],
            bestTime: currentTime,
            time: 0,
            sessions: prev[sound].sessions + 1,
          },
        }));

        if (oldBest > 0) {
          const diff = ((currentTime - oldBest) / 10).toFixed(1);
          improvement = `+${diff}s`;
        } else {
          improvement = "पहला रिकॉर्ड";
        }
        showNotification(
          `नया सर्वश्रेष्ठ समय! ${formatTime(currentTime)}`,
          "success"
        );
        playFeedbackSound(659, 300);
      } else {
        const diff = ((soundTimers[sound].bestTime - currentTime) / 10).toFixed(
          1
        );
        improvement = `-${diff}s`;
        setSoundTimers((prev) => ({
          ...prev,
          [sound]: {
            ...prev[sound],
            time: 0,
            sessions: prev[sound].sessions + 1,
          },
        }));
      }

      const record = {
        sound: sound,
        time: currentTime,
        formattedTime: formatTime(currentTime),
        date: new Date().toLocaleDateString("hi-IN"),
        improvement: improvement,
        timestamp: Date.now(),
        isNewBest: isNewBest,
        sessionCount: soundTimers[sound].sessions + 1,
      };

      setRecords((prev) => ({
        ...prev,
        sounds: [...prev.sounds, record],
      }));

      // Save to Firebase - ADD THIS INSIDE THE FUNCTION
      saveToFirebase("sound", {
        sound: sound,
        time: currentTime,
        formattedTime: formatTime(currentTime),
        improvement: improvement,
        isNewBest: isNewBest,
        sessionCount: soundTimers[sound].sessions + 1,
        date: new Date(),
      });

      saveToStorage();
    },
    [
      soundTimers,
      pauseSoundTimer,
      showNotification,
      playFeedbackSound,
      formatTime,
      saveToStorage,
    ]
  );

  // ============================================
  // VARNMALA TIMER FUNCTIONS
  // ============================================

  const startVarnmalaTimer = useCallback(() => {
    if (varnmalaTimer.isRunning) return;

    setVarnmalaTimer((prev) => ({ ...prev, isRunning: true }));
    setShowVarnmala(true); // Show the Varnmala when starting

    varnmalaInterval.current = setInterval(() => {
      setVarnmalaTimer((prev) => ({ ...prev, time: prev.time + 1 }));
    }, 100);

    showNotification("वर्णमाला टाइमर शुरू!", "info");
    playFeedbackSound(523, 100);
  }, [varnmalaTimer, showNotification, playFeedbackSound]);

  const addVarnmalaLap = useCallback(() => {
    if (!varnmalaTimer.isRunning) return;

    const lapTime = varnmalaTimer.time;
    const lapNumber = varnmalaTimer.laps.length + 1;

    setVarnmalaTimer((prev) => ({
      ...prev,
      laps: [
        ...prev.laps,
        { lapNumber, time: lapTime, formattedTime: formatTime(lapTime) },
      ],
    }));

    showNotification(`लैप ${lapNumber}: ${formatTime(lapTime)}`, "info");
    playFeedbackSound(440, 100);
  }, [varnmalaTimer, showNotification, playFeedbackSound, formatTime]);

  const pauseVarnmalaTimer = useCallback(() => {
    if (!varnmalaTimer.isRunning) return;

    setVarnmalaTimer((prev) => ({ ...prev, isRunning: false }));
    clearInterval(varnmalaInterval.current);
    showNotification("वर्णमाला टाइमर रोक दिया गया", "info");
    playFeedbackSound(294, 100);
  }, [varnmalaTimer, showNotification, playFeedbackSound]);

  const recordVarnmalaTime = useCallback(() => {
    const currentTime = varnmalaTimer.time;

    if (currentTime === 0) {
      showNotification("पहले टाइमर चलाएं!", "warning");
      return;
    }

    if (varnmalaTimer.isRunning) {
      pauseVarnmalaTimer();
    }

    const timeInSeconds = currentTime / 10;
    let quality = "";

    if (timeInSeconds >= 120) {
      quality = "उत्कृष्ट";
    } else if (timeInSeconds >= 90) {
      quality = "अच्छा";
    } else if (timeInSeconds >= 60) {
      quality = "सामान्य";
    } else {
      quality = "सुधार की आवश्यकता";
    }

    const record = {
      session: records.varnmala.length + 1,
      time: currentTime,
      formattedTime: formatTime(currentTime),
      date: new Date().toLocaleDateString("hi-IN"),
      quality: quality,
      timestamp: Date.now(),
      laps: varnmalaTimer.laps,
    };

    setRecords((prev) => ({
      ...prev,
      varnmala: [...prev.varnmala, record],
    }));

    setVarnmalaTimer({ time: 0, isRunning: false, laps: [] });
    setShowVarnmala(false); // Hide the Varnmala when recording

    showNotification(
      `वर्णमाला अभ्यास रिकॉर्ड किया गया! (${quality})`,
      "success"
    );
    playFeedbackSound(quality === "उत्कृष्ट" ? 659 : 523, 200);

    saveToFirebase("varnmala", {
      time: currentTime,
      laps: varnmalaTimer.laps,
      formattedTime: formatTime(currentTime),
      date: new Date(),
    });

    saveToStorage();
  }, [
    varnmalaTimer,
    records.varnmala,
    pauseVarnmalaTimer,
    formatTime,
    showNotification,
    playFeedbackSound,
    saveToFirebase,
    saveToStorage,
  ]);

  // ============================================
  // STORY TIMER FUNCTIONS
  // ============================================

  const selectStory = useCallback(
    (storyType) => {
      setStoryTimer((prev) => ({
        ...prev,
        currentStory: storyType,
        targetTime: storyTargets[storyType],
        time: 0,
      }));
      showNotification(`${getStoryName(storyType)} चुनी गई`, "info");
    },
    [showNotification, getStoryName]
  );

  const startStoryTimer = useCallback(() => {
    if (storyTimer.isRunning) return;

    setStoryTimer((prev) => ({ ...prev, isRunning: true, isPaused: false }));
    storyInterval.current = setInterval(() => {
      setStoryTimer((prev) => {
        const newTime = prev.time + 1;
        if (newTime >= prev.targetTime * 10) {
          clearInterval(storyInterval.current);
          showNotification("लक्ष्य समय पूरा हो गया! बधाई हो! 🎉", "success");
          playFeedbackSound(659, 500);
          return { ...prev, time: newTime, isRunning: false };
        }
        return { ...prev, time: newTime };
      });
    }, 100);

    showNotification("पठन टाइमर शुरू!", "info");
    playFeedbackSound(523, 100);
  }, [storyTimer, showNotification, playFeedbackSound]);

  const pauseStoryTimer = useCallback(() => {
    if (!storyTimer.isRunning) return;

    setStoryTimer((prev) => ({ ...prev, isRunning: false, isPaused: true }));
    clearInterval(storyInterval.current);
    showNotification("पठन टाइमर रोक दिया गया", "info");
    playFeedbackSound(294, 100);
  }, [storyTimer, showNotification, playFeedbackSound]);

  const resetStoryTimer = useCallback(() => {
    clearInterval(storyInterval.current);
    setStoryTimer((prev) => ({
      ...prev,
      time: 0,
      isRunning: false,
      isPaused: false,
    }));
    showNotification("पठन टाइमर रीसेट कर दिया गया", "info");
    playFeedbackSound(220, 100);
  }, [showNotification, playFeedbackSound]);

  const recordStoryTime = useCallback(() => {
    const currentTime = storyTimer.time;

    if (currentTime === 0) {
      showNotification("पहले टाइमर चलाएं!", "warning");
      return;
    }

    if (storyTimer.isRunning) {
      pauseStoryTimer();
    }

    const targetTime = storyTimer.targetTime * 10;
    const percentage = (currentTime / targetTime) * 100;
    let score = "";

    if (percentage >= 100) {
      score = "⭐⭐⭐⭐⭐ (पूर्ण)";
    } else if (percentage >= 80) {
      score = "⭐⭐⭐⭐ (उत्कृष्ट)";
    } else if (percentage >= 60) {
      score = "⭐⭐⭐ (अच्छा)";
    } else if (percentage >= 40) {
      score = "⭐⭐ (सामान्य)";
    } else {
      score = "⭐ (सुधार की आवश्यकता)";
    }

    const record = {
      storyType: getStoryName(storyTimer.currentStory),
      time: currentTime,
      formattedTime: formatTime(currentTime),
      target: formatTime(targetTime),
      date: new Date().toLocaleDateString("hi-IN"),
      score: score,
      percentage: Math.round(percentage),
      timestamp: Date.now(),
    };

    setRecords((prev) => ({
      ...prev,
      stories: [...prev.stories, record],
    }));

    setStoryTimer((prev) => ({
      ...prev,
      time: 0,
      isRunning: false,
      isPaused: false,
    }));
    showNotification(`पठन अभ्यास रिकॉर्ड किया गया! ${score}`, "success");
    playFeedbackSound(percentage >= 80 ? 659 : 523, 300);
    // Add before saveToStorage():
    saveToFirebase("reading", {
      storyType: storyTimer.currentStory,
      time: currentTime,
      formattedTime: formatTime(currentTime),
      date: new Date(),
    });

    saveToStorage();
  }, [
    storyTimer,
    getStoryName,
    formatTime,
    pauseStoryTimer,
    showNotification,
    playFeedbackSound,
    saveToStorage,
  ]);

  // ============================================
  // VOICE RECORDING FUNCTIONS
  // ============================================

  const startVoiceRecording = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showNotification("वॉयस रिकॉर्डिंग समर्थित नहीं है", "error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          showNotification("रिकॉर्डिंग सहेजी गई", "success");
        }
      };

      mediaRecorder.current.start();
      setVoiceRecording(true);
      showNotification("वॉयस रिकॉर्डिंग शुरू", "info");
    } catch (error) {
      showNotification("रिकॉर्डिंग शुरू करने में त्रुटि", "error");
    }
  }, [showNotification]);

  const stopVoiceRecording = useCallback(() => {
    if (mediaRecorder.current && voiceRecording) {
      mediaRecorder.current.stop();
      setVoiceRecording(false);
      showNotification("रिकॉर्डिंग बंद", "info");
    }
  }, [voiceRecording, showNotification]);

  // ============================================
  // KEYBOARD LISTENERS
  // ============================================

  const setupKeyboardListeners = useCallback(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space" && event.target === document.body) {
        event.preventDefault();
        Object.keys(soundTimers).forEach((sound) => {
          if (soundTimers[sound].isRunning) {
            pauseSoundTimer(sound);
          }
        });
        if (varnmalaTimer.isRunning) {
          pauseVarnmalaTimer();
        }
        if (storyTimer.isRunning) {
          pauseStoryTimer();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [
    soundTimers,
    varnmalaTimer,
    storyTimer,
    pauseSoundTimer,
    pauseVarnmalaTimer,
    pauseStoryTimer,
  ]);

  // ============================================
  // INITIALIZATION
  // ============================================

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        await loadFromStorage();

        // Load from Firebase if user is authenticated
        if (user?.uid) {
          await loadFromFirebase();
        }

        setupKeyboardListeners();
        initializeAudioContext();
        calculateDailyStreak();

        setTimeout(() => setIsLoading(false), 1500);
      } catch (error) {
        console.error("Initialization error:", error);
        showNotification("एप्लिकेशन लोड करने में त्रुटि", "error");
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [user]); // Add user as dependency

  useEffect(() => {
    const autoSave = setInterval(() => {
      saveToStorage();
    }, 30000);

    return () => clearInterval(autoSave);
  }, [saveToStorage]);

  // ============================================
  // ✅ HISTORY DATA AGGREGATION
  // ============================================
  // ✅ HISTORY DATA AGGREGATION (UPDATED)
  // This part is updated to include the 'lastPracticed' date.
  // All distinct sounds you ever practised, kept in fixed order
  const allSounds = useMemo(
    () => Array.from(new Set(records.sounds.map((r) => r.sound))).sort(),
    [records.sounds]
  );

  // date  ➜  round #  ➜  { sound : record }
  const soundRoundsByDate = useMemo(() => {
    const map = {};

    // we rely on the property `sessionCount` that each sound-record already has
    // (if you don’t have it, see the note at the bottom)
    records.sounds.forEach((r) => {
      const dateKey = new Date(r.timestamp).toLocaleDateString("hi-IN");
      const round = r.sessionCount || 1; // fallback 1

      if (!map[dateKey]) map[dateKey] = {};
      if (!map[dateKey][round]) map[dateKey][round] = {};

      map[dateKey][round][r.sound] = r; // keep the full record for later
    });

    return map; //  {date}{round}{sound} -> record
  }, [records.sounds]);

  const historyStats = useMemo(() => {
    // Helper function to calculate stats for any category
    const calculateStats = (records, keyField) => {
      return records.reduce((acc, record) => {
        const key = record[keyField];
        const { time, timestamp } = record;

        if (!acc[key]) {
          acc[key] = {
            sessions: 0,
            totalTime: 0,
            bestTime: 0,
            lastPracticed: 0,
            avgTime: 0,
          };
        }

        acc[key].sessions += 1;
        acc[key].totalTime += time;
        acc[key].bestTime = Math.max(acc[key].bestTime, time);
        acc[key].lastPracticed = Math.max(acc[key].lastPracticed, timestamp);
        acc[key].avgTime = acc[key].totalTime / acc[key].sessions;

        return acc;
      }, {});
    };

    // Sound Stats
    const soundStats = calculateStats(records.sounds, "sound");

    // Reading Stats
    const readingStats = calculateStats(records.stories, "storyType");

    // Varnmala Stats - optimized single pass calculation
    const varnmalaStats = records.varnmala.reduce(
      (stats, record) => ({
        totalSessions: stats.totalSessions + 1,
        totalTime: stats.totalTime + record.time,
        lastPracticed: Math.max(stats.lastPracticed, record.timestamp),
        bestTime: Math.max(stats.bestTime, record.time),
      }),
      { totalSessions: 0, totalTime: 0, lastPracticed: 0, bestTime: 0 }
    );

    // Calculate average time for varnmala
    varnmalaStats.avgTime =
      varnmalaStats.totalSessions > 0
        ? varnmalaStats.totalTime / varnmalaStats.totalSessions
        : 0;

    return {
      soundStats,
      readingStats,
      varnmalaStats,
    };
  }, [records]);

  // Loading Screen Component
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-md mx-auto">
          {/* Main Loading Animation */}
          <div className="relative mx-auto w-32 h-32">
            {/* Outer ring */}
            <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-blue-100 dark:border-gray-700"></div>

            {/* Spinning ring */}
            <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>

            {/* Inner ring */}
            <div className="absolute inset-2 w-28 h-28 rounded-full border-2 border-purple-100 dark:border-gray-600"></div>

            {/* Center circle with icon */}
            <div className="absolute inset-6 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Floating dots around the circle */}
            <div className="absolute -inset-4">
              <div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full animate-ping"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full animate-ping"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-pink-400 rounded-full animate-ping"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-2 bg-indigo-400 rounded-full animate-ping"
                style={{ animationDelay: "1.5s" }}
              ></div>
            </div>
          </div>

          {/* Brand and Loading Text */}
          <div className="space-y-6">
            {/* Brand Name */}
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                SpeechGood
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                Enhancing Your Communication Skills
              </p>
            </div>

            {/* Loading Dots */}
            <div className="flex justify-center items-center space-x-2">
              <span className="text-gray-500 dark:text-gray-400 font-medium">
                Loading
              </span>
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-64 mx-auto">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Initializing application...
              </p>
            </div>
          </div>

          {/* Bottom decorative elements */}
          <div className="relative">
            <div className="flex justify-center space-x-8 opacity-50">
              <div
                className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 animate-float"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 animate-float"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 animate-float"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hindi Varnmala Display Component
  const VarnmalaDisplay = () => {
    const hindiVarnmala = [
      // Vowels (स्वर)
      { char: "अ", type: "vowel" },
      { char: "आ", type: "vowel" },
      { char: "इ", type: "vowel" },
      { char: "ई", type: "vowel" },
      { char: "उ", type: "vowel" },
      { char: "ऊ", type: "vowel" },
      { char: "ऋ", type: "vowel" },
      { char: "ए", type: "vowel" },
      { char: "ऐ", type: "vowel" },
      { char: "ओ", type: "vowel" },
      { char: "औ", type: "vowel" },
      { char: "अं", type: "vowel" },
      { char: "अः", type: "vowel" },

      // Consonants (व्यंजन)
      { char: "क", type: "consonant" },
      { char: "ख", type: "consonant" },
      { char: "ग", type: "consonant" },
      { char: "घ", type: "consonant" },
      { char: "ङ", type: "consonant" },
      { char: "च", type: "consonant" },
      { char: "छ", type: "consonant" },
      { char: "ज", type: "consonant" },
      { char: "झ", type: "consonant" },
      { char: "ञ", type: "consonant" },
      { char: "ट", type: "consonant" },
      { char: "ठ", type: "consonant" },
      { char: "ड", type: "consonant" },
      { char: "ढ", type: "consonant" },
      { char: "ण", type: "consonant" },
      { char: "त", type: "consonant" },
      { char: "थ", type: "consonant" },
      { char: "द", type: "consonant" },
      { char: "ध", type: "consonant" },
      { char: "न", type: "consonant" },
      { char: "प", type: "consonant" },
      { char: "फ", type: "consonant" },
      { char: "ब", type: "consonant" },
      { char: "भ", type: "consonant" },
      { char: "म", type: "consonant" },
      { char: "य", type: "consonant" },
      { char: "र", type: "consonant" },
      { char: "ल", type: "consonant" },
      { char: "व", type: "consonant" },
      { char: "श", type: "consonant" },
      { char: "ष", type: "consonant" },
      { char: "स", type: "consonant" },
      { char: "ह", type: "consonant" },
      { char: "क्ष", type: "consonant" },
      { char: "त्र", type: "consonant" },
      { char: "ज्ञ", type: "consonant" },
    ];

    return (
      <div
        className={`mt-8 p-6 md:p-8 rounded-3xl shadow-2xl border ${
          theme === "dark"
            ? "bg-gray-800/50 border-gray-700/20"
            : "bg-white/50 border-gray-200/20"
        } backdrop-blur-xl`}
      >
        <div className="text-center mb-6">
          <h4 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            हिंदी वर्णमाला
          </h4>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            नीचे दिए गए अक्षरों का अभ्यास करें
          </p>
        </div>

        {/* Vowels Section */}
        <div className="mb-8">
          <h5 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4 text-center">
            स्वर (Vowels)
          </h5>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {hindiVarnmala
              .filter((item) => item.type === "vowel")
              .map((item, index) => (
                <div
                  key={index}
                  className={`p-3 md:p-4 rounded-2xl text-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 cursor-pointer ${
                    theme === "dark"
                      ? "bg-purple-900/30 border border-purple-600/30 hover:bg-purple-800/50"
                      : "bg-purple-50 border border-purple-200 hover:bg-purple-100"
                  }`}
                >
                  <span className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {item.char}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Consonants Section */}
        <div>
          <h5 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 text-center">
            व्यंजन (Consonants)
          </h5>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {hindiVarnmala
              .filter((item) => item.type === "consonant")
              .map((item, index) => (
                <div
                  key={index}
                  className={`p-3 md:p-4 rounded-2xl text-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 cursor-pointer ${
                    theme === "dark"
                      ? "bg-blue-900/30 border border-blue-600/30 hover:bg-blue-800/50"
                      : "bg-blue-50 border border-blue-200 hover:bg-blue-100"
                  }`}
                >
                  <span className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {item.char}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Practice Instructions */}
        <div className="mt-8 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl border border-yellow-200 dark:border-yellow-600/30">
          <div className="text-center">
            <i className="fas fa-lightbulb text-yellow-600 dark:text-yellow-400 text-2xl mb-2"></i>
            <p className="text-yellow-800 dark:text-yellow-300 font-medium">
              प्रत्येक अक्षर को स्पष्ट रूप से बोलें और सही उच्चारण पर ध्यान दें
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Main component render
  return (
    <div
      className={`min-h-screen transition-all duration-500 ease-in-out ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"
      } ${isFullscreen ? "fixed inset-0 z-50 overflow-y-auto" : ""}`}
    >
      {/* Floating Action Buttons */}
      <div className="fixed flex flex-col top-2 right-6 z-50 gap-3">
        <button
          onClick={toggleTheme}
          className={`group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-xl border-2 hover:scale-110 shadow-xl ${
            theme === "dark"
              ? "bg-gray-800/90 border-gray-600 text-yellow-400 hover:border-yellow-400 hover:shadow-yellow-400/25"
              : "bg-white/90 border-gray-200 text-gray-600 hover:border-blue-500 hover:shadow-blue-500/25"
          }`}
          title={`${theme === "light" ? "Dark" : "Light"} Mode`}
        >
          <i
            className={`fas fa-${
              theme === "light" ? "moon" : "sun"
            } text-xl transition-transform duration-300 group-hover:rotate-12`}
          ></i>
        </button>

        {/* <button
          className={`group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-xl border-2 hover:scale-110 shadow-xl ${
            soundEnabled
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent hover:shadow-purple-500/25"
              : theme === "dark"
              ? "bg-gray-800/90 border-gray-600 text-gray-400 hover:border-gray-500"
              : "bg-white/90 border-gray-200 text-gray-500 hover:border-gray-300"
          }`}
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={`${soundEnabled ? "Disable" : "Enable"} Sound`}
        >
          <i
            className={`fas fa-volume-${
              soundEnabled ? "up" : "mute"
            } text-xl transition-transform duration-300 group-hover:scale-110`}
          ></i>
        </button> */}
      </div>

      {/* Enhanced Notifications */}
      <div className="fixed top-6 left-6 z-50 space-y-3 max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="transform transition-all duration-500 ease-out translate-x-0 opacity-100"
          >
            <div
              className={`relative overflow-hidden rounded-2xl shadow-xl backdrop-blur-xl border-l-4 ${
                notification.type === "success"
                  ? "bg-green-500/90 border-green-400"
                  : notification.type === "error"
                  ? "bg-red-500/90 border-red-400"
                  : notification.type === "warning"
                  ? "bg-yellow-500/90 border-yellow-400"
                  : "bg-blue-500/90 border-blue-400"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
              <div className="relative flex items-start justify-between p-4 text-white">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5 animate-pulse">
                    {notification.type === "success" && "✅"}
                    {notification.type === "warning" && "⚠️"}
                    {notification.type === "error" && "❌"}
                    {notification.type === "info" && "ℹ️"}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium leading-5">
                      {notification.message}
                    </p>
                    <p className="text-xs opacity-75 mt-1">
                      {notification.timestamp.toLocaleTimeString("hi-IN")}
                    </p>
                  </div>
                </div>
                <button
                  className="ml-3 opacity-70 hover:opacity-100 transition-opacity"
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.filter((n) => n.id !== notification.id)
                    )
                  }
                >
                  <i className="fas fa-times text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Navigation */}
      {/* Enhanced Navigation */}
      <nav
        className={`sticky top-0 z-40 backdrop-blur-2xl border-b shadow-lg transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-900/80 border-gray-700/80"
            : "bg-white/80 border-gray-200/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <i
                    className="fas fa-comment text-white text-xl"
                    aria-hidden="true"
                  ></i>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Speech Good
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              {[
                { key: "home", label: "Home", icon: "fas fa-home" },
                {
                  key: "exercises",
                  label: "स्वर अभ्यास",
                  icon: "fas fa-microphone",
                },
                {
                  key: "varnmala",
                  label: "वर्णमाला अभ्यास",
                  icon: "fas fa-list",
                },
                { key: "stories", label: "पठन अभ्यास", icon: "fas fa-book" },
                { key: "records", label: "Records", icon: "fas fa-chart-line" },
                { key: "history", label: "History", icon: "fas fa-history" },
              ].map((view) => (
                <button
                  key={view.key}
                  className={`relative px-3 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    currentView === view.key
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                      : theme === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                  }`}
                  onClick={() => setCurrentView(view.key)}
                >
                  <i className={`${view.icon} text-sm`}></i>
                  <span className="hidden xl:inline">{view.label}</span>
                  {currentView === view.key && (
                    <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse"></div>
                  )}
                </button>
              ))}

              {/* Desktop Theme Toggle */}

              {/* Desktop Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-400/50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Right Side Controls */}
            <div className="lg:hidden mr-20">
              {/* Mobile Menu Button */}
              <button
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  theme === "dark"
                    ? "text-white hover:bg-gray-700/50 border border-gray-600"
                    : "text-gray-700 hover:bg-gray-100/50 border border-gray-300"
                }`}
                onClick={() => {
                  console.log("Mobile menu clicked:", !mobileMenuOpen);
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
              >
                <i
                  className={`fas fa-${
                    mobileMenuOpen ? "times" : "bars"
                  } text-lg transition-transform duration-200`}
                ></i>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg relative z-50">
              <div className="grid grid-cols-2 gap-3 px-2">
                {[
                  { key: "home", label: "Home", icon: "fas fa-home" },
                  {
                    key: "exercises",
                    label: "स्वर अभ्यास",
                    icon: "fas fa-microphone",
                  },
                  {
                    key: "varnmala",
                    label: "वर्णमाला अभ्यास",
                    icon: "fas fa-list",
                  },
                  { key: "stories", label: "पठन अभ्यास", icon: "fas fa-book" },
                  {
                    key: "records",
                    label: "Records",
                    icon: "fas fa-chart-line",
                  },
                  { key: "history", label: "History", icon: "fas fa-history" },
                ].map((view) => (
                  <button
                    key={view.key}
                    className={`p-4 rounded-xl font-medium transition-all duration-300 flex flex-col items-center gap-2 ${
                      currentView === view.key
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : theme === "dark"
                        ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                    }`}
                    onClick={() => {
                      setCurrentView(view.key);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <i className={`${view.icon} text-lg`}></i>
                    <span className="text-sm text-center">{view.label}</span>
                  </button>
                ))}
              </div>

              {/* Mobile Logout Button */}
              <div className="mt-4 px-2">
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-4 py-3 rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-400/50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Home Section */}
        {currentView === "home" && (
          <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl "></div>
              <div className="relative grid lg:grid-cols-2 gap-12 items-center py-12 lg:py-20 px-4 sm:px-8">
                <div className="space-y-8 text-center lg:text-left">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-sm font-medium">
                      <i className="fas fa-star text-yellow-500"></i>
                      Professional Speech Therapy Platform
                    </div>
                    <h1 className="text-2xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                      <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        समय आधारित
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        अभ्यास
                      </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                      Advanced timer-based speech therapy exercises designed to
                      help you overcome stuttering with scientific precision and
                      personal tracking.
                    </p>
                  </div>

                  {/* Enhanced Stats */}
                  <div className="grid grid-cols-3 gap-4 md:gap-6">
                    {[
                      {
                        value: dailyStreak,
                        label: "दिन की लकीर",
                        icon: "fas fa-fire",
                        color: "from-orange-500 to-red-500",
                      },
                      {
                        value: Object.values(soundTimers).reduce(
                          (sum, timer) => sum + timer.sessions,
                          0
                        ),
                        label: "कुल सत्र",
                        icon: "fas fa-chart-line",
                        color: "from-green-500 to-blue-500",
                      },
                      {
                        value:
                          records.sounds.length +
                          records.varnmala.length +
                          records.stories.length,
                        label: "कुल रिकॉर्ड",
                        icon: "fas fa-trophy",
                        color: "from-purple-500 to-pink-500",
                      },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className={`relative p-4 md:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 group ${
                          theme === "dark"
                            ? "bg-gray-800/50 backdrop-blur-xl"
                            : "bg-white/50 backdrop-blur-xl"
                        } border border-gray-200/20 dark:border-gray-700/20 shadow-xl`}
                      >
                        <div className="text-center space-y-3">
                          <div
                            className={`w-8 h-8 md:w-12 md:h-12 mx-auto rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                          >
                            <i
                              className={`${stat.icon} text-white text-sm md:text-xl`}
                            ></i>
                          </div>
                          <div
                            className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                          >
                            {stat.value}
                          </div>
                          <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                      onClick={() => setCurrentView("exercises")}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative flex items-center gap-3">
                        <i className="fas fa-play-circle text-xl"></i>
                        Start Practice Session
                      </div>
                    </button>

                    <button
                      className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold text-lg hover:border-purple-500 hover:text-purple-500 transition-all duration-300"
                      onClick={() => setCurrentView("records")}
                    >
                      <i className="fas fa-chart-bar mr-3"></i>
                      View Progress
                    </button>
                  </div>
                </div>

                {/* Enhanced Visual */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                    <div
                      className={`relative w-60 h-60 md:w-80 md:h-80 rounded-full flex flex-col items-center justify-center shadow-2xl border-8 ${
                        theme === "dark"
                          ? "bg-gradient-to-br from-gray-800 to-gray-700 border-purple-500/50"
                          : "bg-gradient-to-br from-white to-blue-50 border-blue-500/50"
                      } backdrop-blur-xl`}
                    >
                      <div className="text-center space-y-4">
                        {/* <div className="text-3xl md:text-5xl font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {formatTime(
                            Object.values(soundTimers).reduce(
                              (max, timer) => Math.max(max, timer.time),
                              0
                            )
                          )}
                        </div> */}
                        <div className="text-3xl  md:text-3xl text-gray-500 dark:text-gray-400 font-medium">
                          " Just Do It "
                        </div>
                        <div className="flex justify-center space-x-2">
                          <div
                            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "fas fa-microphone",
                  title: "Voice Training",
                  description:
                    "Professional speech exercises with real-time feedback",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: "fas fa-chart-line",
                  title: "Progress Tracking",
                  description: "Detailed analytics and improvement metrics",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  icon: "fas fa-clock",
                  title: "Timed Sessions",
                  description:
                    "Structured practice with optimal time management",
                  color: "from-purple-500 to-violet-500",
                },
                {
                  icon: "fas fa-trophy",
                  title: "Achievement System",
                  description: "Motivation through goals and milestones",
                  color: "from-orange-500 to-red-500",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 ${
                    theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
                  } backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20 shadow-xl`}
                >
                  <div className="space-y-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <i className={`${feature.icon} text-white text-2xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* Enhanced Sound Timer Practice */}
        {currentView === "exercises" && (
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl p-4 md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                स्वर अभ्यास
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Practice vowel sounds with precision timing. Each session helps
                build muscle memory and improves speech fluency.
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
              {Object.keys(soundTimers).map((sound) => (
                <div
                  key={sound}
                  className={`group relative p-6 md:p-8 rounded-3xl transition-all duration-500 hover:-translate-y-4 hover:scale-105 ${
                    theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
                  } backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20 shadow-2xl hover:shadow-purple-500/25`}
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative text-center space-y-6">
                    {/* Sound Display */}
                    <div className="space-y-3">
                      <div className="text-6xl p-4 md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                        {sound}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Sessions: {soundTimers[sound].sessions} | Best:{" "}
                        {formatTime(soundTimers[sound].bestTime)}
                      </div>
                    </div>

                    {/* Enhanced Circular Timer */}
                    <div className="relative w-32 md:w-40 h-32 md:h-40 mx-auto">
                      <svg
                        className="w-full h-full -rotate-90"
                        viewBox="0 0 160 160"
                      >
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="transparent"
                          stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
                          strokeWidth="8"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="transparent"
                          stroke="url(#timer-gradient)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={440}
                          strokeDashoffset={
                            440 - (soundTimers[sound].time / 600) * 440
                          }
                          className="transition-all duration-300"
                        />
                        <defs>
                          <linearGradient
                            id="timer-gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="rgb(59 130 246)" />
                            <stop offset="50%" stopColor="rgb(147 51 234)" />
                            <stop offset="100%" stopColor="rgb(236 72 153)" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-lg md:text-2xl font-bold font-mono">
                          {formatTime(soundTimers[sound].time)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          TIME
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Controls */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          className={`px-2 md:px-4 py-3 rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 ${
                            soundTimers[sound].isRunning
                              ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600"
                              : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:scale-105"
                          }`}
                          onClick={() => startSoundTimer(sound)}
                          disabled={soundTimers[sound].isRunning}
                        >
                          <i className="fas fa-play"></i>
                        </button>
                        <button
                          className={`px-2 md:px-4 py-3 rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 ${
                            !soundTimers[sound].isRunning
                              ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600"
                              : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg hover:scale-105"
                          }`}
                          onClick={() => pauseSoundTimer(sound)}
                          disabled={!soundTimers[sound].isRunning}
                        >
                          <i className="fas fa-pause"></i>
                        </button>
                        <button
                          className="px-2 md:px-4 py-3 rounded-xl font-semibold text-xs md:text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                          onClick={() => recordTime(sound)}
                        >
                          <i className="fas fa-save"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Voice Recording Section */}
            <section
              className={`relative overflow-hidden p-8 md:p-12 rounded-3xl ${
                theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
              } backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20 shadow-2xl`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-pink-500/10 to-purple-500/10"></div>
              <div className="relative text-center space-y-8">
                <div className="space-y-4">
                  <div className="w-16 md:w-20 h-16 md:h-20 mx-auto rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                    <i className="fas fa-microphone text-white text-2xl md:text-3xl"></i>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    Voice Recording Practice
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Record your speech exercises to track pronunciation
                    improvement and build confidence in your voice.
                  </p>
                </div>

                <div className="space-y-6">
                  {!voiceRecording ? (
                    <button
                      className="group relative px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-bold text-lg md:text-xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:-translate-y-2 hover:scale-105"
                      onClick={startVoiceRecording}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative flex items-center gap-3 md:gap-4">
                        <i className="fas fa-microphone text-xl md:text-2xl"></i>
                        <span>Start Recording</span>
                      </div>
                    </button>
                  ) : (
                    <div className="space-y-6">
                      <button
                        className="px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl font-bold text-lg md:text-xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:-translate-y-2"
                        onClick={stopVoiceRecording}
                      >
                        <i className="fas fa-stop mr-3 md:mr-4 text-xl md:text-2xl"></i>
                        Stop Recording
                      </button>

                      <div className="flex items-center justify-center gap-4 md:gap-6 p-4 md:p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border-2 border-dashed border-red-300 dark:border-red-600">
                        <div className="flex space-x-2">
                          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                          <div
                            className="w-4 h-4 bg-red-500 rounded-full animate-pulse"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-4 h-4 bg-red-500 rounded-full animate-pulse"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                        <span className="text-red-700 dark:text-red-300 font-bold text-base md:text-lg">
                          Recording in progress...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Varnmala Timer */}
        {currentView === "varnmala" && (
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl p-4 md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                वर्णमाला अभ्यास
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Practice the Hindi alphabet with timing control. Track your
                pronunciation speed and consistency across multiple rounds.
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            <div className="flex flex-col items-center gap-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <svg
                  className="relative w-48 md:w-64 h-48 md:h-64 -rotate-90"
                  viewBox="0 0 256 256"
                >
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    fill="transparent"
                    stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
                    strokeWidth="12"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    fill="transparent"
                    stroke="url(#varnmala-gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={691.15}
                    strokeDashoffset={
                      691.15 - (varnmalaTimer.time / 1200) * 691.15
                    }
                    className="transition-all duration-300"
                  />
                  <defs>
                    <linearGradient
                      id="varnmala-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="rgb(59 130 246)" />
                      <stop offset="50%" stopColor="rgb(147 51 234)" />
                      <stop offset="100%" stopColor="rgb(236 72 153)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl md:text-4xl font-bold font-mono bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formatTime(varnmalaTimer.time)}
                  </div>
                  <div className="text-base md:text-lg text-gray-500 dark:text-gray-400 mt-2 font-medium">
                    वर्णमाला समय
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  className={`px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 ${
                    varnmalaTimer.isRunning
                      ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:-translate-y-1 hover:scale-105"
                  }`}
                  onClick={startVarnmalaTimer}
                  disabled={varnmalaTimer.isRunning}
                >
                  <i className="fas fa-play mr-2"></i>शुरू करें
                </button>
                <button
                  className={`px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 ${
                    !varnmalaTimer.isRunning
                      ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600"
                      : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg hover:-translate-y-1 hover:scale-105"
                  }`}
                  onClick={pauseVarnmalaTimer}
                  disabled={!varnmalaTimer.isRunning}
                >
                  <i className="fas fa-pause mr-2"></i>रोकें
                </button>
                <button
                  className={`px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 ${
                    !varnmalaTimer.isRunning
                      ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:-translate-y-1 hover:scale-105"
                  }`}
                  onClick={addVarnmalaLap}
                  disabled={!varnmalaTimer.isRunning}
                >
                  <i className="fas fa-flag mr-2"></i>लैप
                </button>
                <button
                  className="px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                  onClick={recordVarnmalaTime}
                >
                  <i className="fas fa-save mr-2"></i>रिकॉर्ड करें
                </button>
              </div>

              {varnmalaTimer.laps.length > 0 && (
                <div
                  className={`w-full max-w-2xl p-6 md:p-8 rounded-3xl shadow-2xl border ${
                    theme === "dark"
                      ? "bg-gray-800/50 border-gray-700/20"
                      : "bg-white/50 border-gray-200/20"
                  } backdrop-blur-xl`}
                >
                  <h4 className="text-xl md:text-2xl font-bold text-center mb-6">
                    लैप समय
                  </h4>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {varnmalaTimer.laps.map((lap, index) => (
                      <div
                        key={index}
                        className={`flex justify-between items-center p-4 rounded-xl border transition-all duration-200 hover:-translate-y-1 ${
                          theme === "dark"
                            ? "bg-gray-700/50 border-gray-600/30"
                            : "bg-gray-50/50 border-gray-200/30"
                        } backdrop-blur-sm`}
                      >
                        <span className="font-bold text-base md:text-lg">
                          लैप {lap.lapNumber}
                        </span>
                        <span className="font-mono font-bold text-lg md:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {lap.formattedTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Varnmala Display - Add this line here */}
            {showVarnmala && <VarnmalaDisplay />}
          </div>
        )}

        {/* Story Reading Timer */}
        {currentView === "stories" && (
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl p-4 md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                पठन अभ्यास
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Timed reading sessions to improve fluency and confidence. Choose
                your story length and track your progress.
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            <div className="max-w-6xl mx-auto space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  {
                    icon: "fas fa-clock",
                    label: "वर्तमान सत्र",
                    value: formatTime(storyTimer.time),
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: "fas fa-trophy",
                    label: "सबसे लंबा सत्र",
                    value:
                      records.stories.length > 0
                        ? formatTime(
                            Math.max(...records.stories.map((r) => r.time))
                          )
                        : "00:00.0",
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    icon: "fas fa-calendar-day",
                    label: "आज का कुल समय",
                    value: formatTime(
                      records.stories
                        .filter(
                          (r) =>
                            r.date === new Date().toLocaleDateString("hi-IN")
                        )
                        .reduce((sum, r) => sum + r.time, 0)
                    ),
                    color: "from-purple-500 to-violet-500",
                  },
                  {
                    icon: "fas fa-percentage",
                    label: "लक्ष्य प्रगति",
                    value: `${Math.round(
                      Math.min(
                        (storyTimer.time / (storyTimer.targetTime * 10)) * 100,
                        100
                      )
                    )}%`,
                    color: "from-orange-500 to-red-500",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`p-4 md:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 group ${
                      theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
                    } backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20 shadow-xl`}
                  >
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                      <div
                        className={`w-10 md:w-14 h-10 md:h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <i
                          className={`${stat.icon} text-white text-lg md:text-xl`}
                        ></i>
                      </div>
                      <div className="text-center md:text-left">
                        <div className="text-lg md:text-2xl font-bold font-mono">
                          {stat.value}
                        </div>
                        <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Story Selection */}
              <div className="text-center space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold">कहानी चुनें:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.keys(storyTargets).map((storyType) => (
                    <button
                      key={storyType}
                      className={`p-4 md:p-6 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 border-2 hover:-translate-y-1 hover:scale-105 ${
                        storyTimer.currentStory === storyType
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-xl"
                          : theme === "dark"
                          ? "border-gray-600 text-gray-300 hover:border-blue-500 hover:text-white hover:bg-gray-700/50"
                          : "border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-gray-50/50"
                      } backdrop-blur-xl`}
                      onClick={() => selectStory(storyType)}
                    >
                      <div className="space-y-2">
                        <div>{getStoryName(storyType)}</div>
                        <div className="text-xs md:text-sm opacity-75">
                          ({storyTargets[storyType] / 60} मिनट)
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reading Timer */}
              <div
                className={`p-8 md:p-10 rounded-3xl shadow-2xl border ${
                  theme === "dark"
                    ? "bg-gray-800/50 border-gray-700/20"
                    : "bg-white/50 border-gray-200/20"
                } backdrop-blur-xl`}
              >
                <div className="space-y-8">
                  {/* Progress Bar */}
                  <div className="space-y-4">
                    <div className="relative h-6 md:h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300 rounded-full relative overflow-hidden"
                        style={{
                          width: `${Math.min(
                            (storyTimer.time / (storyTimer.targetTime * 10)) *
                              100,
                            100
                          )}%`,
                          background:
                            storyTimer.time / (storyTimer.targetTime * 10) >= 1
                              ? "linear-gradient(90deg, rgb(34 197 94), rgb(74 222 128))"
                              : storyTimer.time /
                                  (storyTimer.targetTime * 10) >=
                                0.8
                              ? "linear-gradient(90deg, rgb(59 130 246), rgb(147 51 234))"
                              : "linear-gradient(90deg, rgb(236 72 153), rgb(59 130 246))",
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-lg md:text-xl font-bold">
                      <span>
                        {Math.round(
                          Math.min(
                            (storyTimer.time / (storyTimer.targetTime * 10)) *
                              100,
                            100
                          )
                        )}
                        %
                      </span>
                      <span>/ {formatTime(storyTimer.targetTime * 10)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      className={`px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 ${
                        storyTimer.isRunning
                          ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600"
                          : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:-translate-y-1 hover:scale-105"
                      }`}
                      onClick={startStoryTimer}
                      disabled={storyTimer.isRunning}
                    >
                      <i className="fas fa-play mr-2"></i>
                      <span className="hidden sm:inline">
                        {storyTimer.isPaused ? "जारी रखें" : "शुरू करें"}
                      </span>
                      <span className="sm:hidden">▶</span>
                    </button>
                    <button
                      className={`px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 ${
                        !storyTimer.isRunning
                          ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600"
                          : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg hover:-translate-y-1 hover:scale-105"
                      }`}
                      onClick={pauseStoryTimer}
                      disabled={!storyTimer.isRunning}
                    >
                      <i className="fas fa-pause mr-2"></i>
                      <span className="hidden sm:inline">रोकें</span>
                      <span className="sm:hidden">⏸</span>
                    </button>
                    <button
                      className="px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                      onClick={resetStoryTimer}
                    >
                      <i className="fas fa-refresh mr-2"></i>
                      <span className="hidden sm:inline">रीसेट करें</span>
                      <span className="sm:hidden">↻</span>
                    </button>
                    <button
                      className="px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                      onClick={recordStoryTime}
                    >
                      <i className="fas fa-save mr-2"></i>
                      <span className="hidden sm:inline">रिकॉर्ड करें</span>
                      <span className="sm:hidden">💾</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Records Section */}
        {currentView === "records" && (
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl p-4 font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                प्रगति रिकॉर्ड
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Track your improvement over time with detailed session records
                and progress analytics.
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-12">
              {/* Sound Records */}
              <div
                className={`p-6 md:p-8 rounded-3xl shadow-2xl border-t-4 border-t-blue-500 ${
                  theme === "dark"
                    ? "bg-gray-800/50 border-b border-x border-gray-700/20"
                    : "bg-white/50 border-b border-x border-gray-200/20"
                } backdrop-blur-xl`}
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-4">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <i className="fas fa-microphone text-white text-lg md:text-xl"></i>
                  </div>
                  स्वर अभ्यास रिकॉर्ड
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <tr>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold rounded-tl-2xl">
                          स्वर
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold">
                          समय
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold">
                          दिनांक
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold">
                          सुधार
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold">
                          सत्र
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold rounded-tr-2xl">
                          कार्य
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        theme === "dark" ? "divide-gray-700" : "divide-gray-200"
                      }`}
                    >
                      {records.sounds.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-12 text-center text-lg md:text-xl text-gray-500 dark:text-gray-400"
                          >
                            <div className="space-y-4">
                              <i className="fas fa-chart-line text-3xl md:text-4xl opacity-30"></i>
                              <p>अभी तक कोई रिकॉर्ड नहीं है</p>
                              <p className="text-sm">
                                अपना पहला अभ्यास सत्र शुरू करें!
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        records.sounds
                          .sort((a, b) => b.timestamp - a.timestamp)
                          .slice(0, 15)
                          .map((record) => (
                            <tr
                              key={record.timestamp}
                              className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                                record.isNewBest
                                  ? "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500"
                                  : ""
                              }`}
                            >
                              <td className="px-4 md:px-6 py-4">
                                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                  {record.sound}
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-4">
                                <div className="text-lg md:text-xl font-mono font-bold">
                                  {record.formattedTime}
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-4 text-sm md:text-lg">
                                {record.date}
                              </td>
                              <td
                                className={`px-4 md:px-6 py-4 font-bold text-sm md:text-lg ${
                                  record.improvement.includes("+") ||
                                  record.improvement === "पहला रिकॉर्ड"
                                    ? "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 md:px-3 py-1 rounded-full"
                                    : record.improvement.includes("-")
                                    ? "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 md:px-3 py-1 rounded-full"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                {record.improvement}
                              </td>
                              <td className="px-4 md:px-6 py-4 text-sm md:text-lg font-semibold">
                                {record.sessionCount || 1}
                              </td>
                              <td className="px-4 md:px-6 py-4">
                                <button
                                  className="w-10 md:w-12 h-10 md:h-12 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 hover:scale-110"
                                  onClick={() =>
                                    deleteRecord("sounds", record.timestamp)
                                  }
                                  title="रिकॉर्ड हटाएं"
                                >
                                  <i className="fas fa-trash text-lg md:text-xl"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Progress Charts */}
              <div className="grid md:grid-cols-2 gap-8">
                <div
                  className={`p-6 md:p-8 rounded-3xl shadow-2xl border ${
                    theme === "dark"
                      ? "bg-gray-800/50 border-gray-700/20"
                      : "bg-white/50 border-gray-200/20"
                  } backdrop-blur-xl`}
                >
                  <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">
                    साप्ताहिक प्रगति
                  </h3>
                  <div className="flex justify-around items-end h-48 md:h-64 px-4">
                    {["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"].map(
                      (day, index) => {
                        const dayRecords = [
                          ...records.sounds,
                          ...records.varnmala,
                          ...records.stories,
                        ].filter((record) => {
                          const recordDate = new Date(record.timestamp);
                          return recordDate.getDay() === (index + 1) % 7;
                        });
                        const dayProgress = Math.min(
                          dayRecords.length * 15,
                          100
                        );

                        return (
                          <div
                            key={day}
                            className="flex flex-col items-center group cursor-pointer"
                          >
                            <div
                              className="bg-gradient-to-t from-blue-500 via-purple-500 to-pink-500 rounded-t-xl transition-all duration-500 hover:scale-110 hover:shadow-lg min-h-[8px] group-hover:shadow-purple-500/50"
                              style={{
                                height: `${Math.max(dayProgress, 8)}%`,
                                width: "32px",
                                minHeight: "8px",
                              }}
                              title={`${dayRecords.length} अभ्यास सत्र`}
                            ></div>
                            <span className="text-xs md:text-sm font-bold mt-2 md:mt-3 group-hover:text-blue-500 transition-colors">
                              {day}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {dayRecords.length}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                <div
                  className={`p-6 md:p-8 rounded-3xl shadow-2xl border ${
                    theme === "dark"
                      ? "bg-gray-800/50 border-gray-700/20"
                      : "bg-white/50 border-gray-200/20"
                  } backdrop-blur-xl`}
                >
                  <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">
                    साप्ताहिक लक्ष्य प्रगति
                  </h3>
                  <div className="space-y-6">
                    <div className="relative h-8 md:h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 relative overflow-hidden"
                        style={{
                          width: `${Math.min(
                            (records.stories.reduce(
                              (sum, r) => sum + r.time / 600,
                              0
                            ) /
                              weeklyGoal) *
                              100,
                            100
                          )}%`,
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-lg md:text-xl font-bold">
                      <span className="text-green-600 dark:text-green-400">
                        {Math.round(
                          records.stories.reduce(
                            (sum, r) => sum + r.time / 600,
                            0
                          )
                        )}{" "}
                        मिनट
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        / {weeklyGoal} मिनट
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                        {Math.round(
                          (records.stories.reduce(
                            (sum, r) => sum + r.time / 600,
                            0
                          ) /
                            weeklyGoal) *
                            100
                        )}
                        %
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        सप्ताह का लक्ष्य पूर्ण
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Varnmala Records Section */}
              <div
                className={`p-6 md:p-8 rounded-3xl shadow-2xl border-t-4 border-t-purple-500 ${
                  theme === "dark"
                    ? "bg-gray-800/50 border-b border-x border-gray-700/20"
                    : "bg-white/50 border-b border-x border-gray-200/20"
                } backdrop-blur-xl`}
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-4">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <i className="fas fa-list text-white text-lg md:text-xl"></i>
                  </div>
                  वर्णमाला अभ्यास रिकॉर्ड
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <tr>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold rounded-tl-2xl">
                          सत्र
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold">
                          समय
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold">
                          दिनांक
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold">
                          गुणवत्ता
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold">
                          लैप्स
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold rounded-tr-2xl">
                          कार्य
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        theme === "dark" ? "divide-gray-700" : "divide-gray-200"
                      }`}
                    >
                      {records.varnmala.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-12 text-center text-lg md:text-xl text-gray-500 dark:text-gray-400"
                          >
                            <div className="space-y-4">
                              <i className="fas fa-list text-3xl md:text-4xl opacity-30"></i>
                              <p>अभी तक कोई वर्णमाला रिकॉर्ड नहीं है</p>
                              <p className="text-sm">
                                अपना पहला वर्णमाला अभ्यास शुरू करें!
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        records.varnmala
                          .sort((a, b) => b.timestamp - a.timestamp)
                          .slice(0, 10)
                          .map((record, index) => (
                            <tr
                              key={record.timestamp}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                              <td className="px-4 md:px-6 py-4">
                                <div className="text-lg md:text-xl font-bold text-purple-600 dark:text-purple-400">
                                  सत्र #{record.session}
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-4">
                                <div className="text-lg md:text-xl font-mono font-bold">
                                  {record.formattedTime}
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-4 text-sm md:text-lg">
                                {record.date}
                              </td>
                              <td
                                className={`px-4 md:px-6 py-4 font-bold text-sm md:text-lg ${
                                  record.quality === "उत्कृष्ट"
                                    ? "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 md:px-3 py-1 rounded-full"
                                    : record.quality === "अच्छा"
                                    ? "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 md:px-3 py-1 rounded-full"
                                    : record.quality === "सामान्य"
                                    ? "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 md:px-3 py-1 rounded-full"
                                    : "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 md:px-3 py-1 rounded-full"
                                }`}
                              >
                                {record.quality}
                              </td>
                              <td className="px-4 md:px-6 py-4 text-sm md:text-lg">
                                {record.laps?.length || 0}
                              </td>
                              <td className="px-4 md:px-6 py-4">
                                <button
                                  className="w-10 md:w-12 h-10 md:h-12 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 hover:scale-110"
                                  onClick={() =>
                                    deleteRecord("varnmala", record.timestamp)
                                  }
                                  title="रिकॉर्ड हटाएं"
                                >
                                  <i className="fas fa-trash text-lg md:text-xl"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Story Records Section */}
              <div
                className={`p-6 md:p-8 rounded-3xl shadow-2xl border-t-4 border-t-green-500 ${
                  theme === "dark"
                    ? "bg-gray-800/50 border-b border-x border-gray-700/20"
                    : "bg-white/50 border-b border-x border-gray-200/20"
                } backdrop-blur-xl`}
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-4">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <i className="fas fa-book text-white text-lg md:text-xl"></i>
                  </div>
                  पठन अभ्यास रिकॉर्ड
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      <tr>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold rounded-tl-2xl">
                          कहानी प्रकार
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold">
                          समय
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold">
                          लक्ष्य
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold">
                          स्कोर
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold">
                          दिनांक
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-base md:text-lg font-bold rounded-tr-2xl">
                          कार्य
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        theme === "dark" ? "divide-gray-700" : "divide-gray-200"
                      }`}
                    >
                      {records.stories.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-12 text-center text-lg md:text-xl text-gray-500 dark:text-gray-400"
                          >
                            <div className="space-y-4">
                              <i className="fas fa-book text-3xl md:text-4xl opacity-30"></i>
                              <p>अभी तक कोई पठन रिकॉर्ड नहीं है</p>
                              <p className="text-sm">
                                अपना पहला पठन अभ्यास शुरू करें!
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        records.stories
                          .sort((a, b) => b.timestamp - a.timestamp)
                          .slice(0, 10)
                          .map((record) => (
                            <tr
                              key={record.timestamp}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                              <td className="px-4 md:px-6 py-4">
                                <div className="text-lg md:text-xl font-bold text-green-600 dark:text-green-400">
                                  {record.storyType}
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-4">
                                <div className="text-lg md:text-xl font-mono font-bold">
                                  {record.formattedTime}
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-4">
                                <div className="text-sm md:text-lg font-mono">
                                  {record.target}
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-4">
                                <div
                                  className={`text-sm md:text-lg font-bold ${
                                    record.percentage >= 100
                                      ? "text-green-600 dark:text-green-400"
                                      : record.percentage >= 80
                                      ? "text-blue-600 dark:text-blue-400"
                                      : record.percentage >= 60
                                      ? "text-yellow-600 dark:text-yellow-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {record.score}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {record.percentage}%
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-4 text-sm md:text-lg">
                                {record.date}
                              </td>
                              <td className="px-4 md:px-6 py-4">
                                <button
                                  className="w-10 md:w-12 h-10 md:h-12 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 hover:scale-110"
                                  onClick={() =>
                                    deleteRecord("stories", record.timestamp)
                                  }
                                  title="रिकॉर्ड हटाएं"
                                >
                                  <i className="fas fa-trash text-lg md:text-xl"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ CORRECTED HISTORY VIEW */}
        {currentView === "history" && (
          <div className="space-y-12 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-2xl p-4 md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                संपूर्ण अभ्यास इतिहास
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                आपके सभी अभ्यास सत्रों का विस्तृत रिकॉर्ड और प्रदर्शन विश्लेषण
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            {/* Overall Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  title: "कुल सत्र",
                  value:
                    records.sounds.length +
                    records.varnmala.length +
                    records.stories.length,
                  icon: "fas fa-calendar-check",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  title: "कुल समय",
                  value: formatTime(
                    [
                      ...records.sounds,
                      ...records.varnmala,
                      ...records.stories,
                    ].reduce((sum, r) => sum + r.time, 0)
                  ),
                  icon: "fas fa-clock",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  title: "सर्वश्रेष्ठ स्वर समय",
                  value:
                    records.sounds.length > 0
                      ? formatTime(
                          Math.max(...records.sounds.map((r) => r.time))
                        )
                      : "00.00",
                  icon: "fas fa-trophy",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  title: "इस सप्ताह",
                  value: [
                    ...records.sounds,
                    ...records.varnmala,
                    ...records.stories,
                  ].filter((r) => {
                    const recordDate = new Date(r.timestamp);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return recordDate >= weekAgo;
                  }).length,
                  icon: "fas fa-chart-line",
                  color: "from-orange-500 to-red-500",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-3xl backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20 shadow-xl hover:-translate-y-2 transition-all duration-300 ${
                    theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                    >
                      <i className={`${stat.icon} text-white text-2xl`}></i>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {stat.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ----------  Detailed Sound Records  ---------- */}

            <div className="space-y-6">
  <h3 className="text-2xl font-bold flex items-center gap-2">
    <i className="fas fa-microphone text-blue-500"></i>
    स्वर अभ्यास (सत्र अनुसार)
  </h3>

  {Object.keys(soundRoundsByDate)
    .sort((a, b) => new Date(b) - new Date(a)) // Latest date first
    .map((date) => {
      // Collect all sessions for this date
      const allSessionsForDate = records.sounds
        .filter((r) => {
          const recordDate = new Date(r.timestamp).toLocaleDateString("hi-IN");
          return recordDate === date;
        })
        .sort((a, b) => b.timestamp - a.timestamp); // Latest sessions first

      // Group sessions by sound, maintaining chronological order for each sound
      const sessionsBySound = {};
      allSessionsForDate.forEach((session) => {
        if (!sessionsBySound[session.sound]) {
          sessionsBySound[session.sound] = [];
        }
        sessionsBySound[session.sound].push(session);
      });

      // Reverse each sound's sessions so latest appears first
      Object.keys(sessionsBySound).forEach(sound => {
        sessionsBySound[sound].reverse();
      });

      // Find the maximum number of sessions for any sound on this date
      const maxSessions = Math.max(
        ...Object.values(sessionsBySound).map(sessions => sessions.length),
        0
      );

      if (maxSessions === 0) return null;

      return (
        <div
          key={date}
          className="p-4 rounded-xl shadow-lg border backdrop-blur-xl bg-white/50 dark:bg-gray-800/50"
        >
          <div className="mb-4 text-lg font-bold text-gray-700 dark:text-gray-300">
            {date}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold rounded-tl-2xl">
                    सत्र #
                  </th>
                  {allSounds.map((sound) => (
                    <th
                      key={sound}
                      className="px-4 py-3 text-center text-sm font-bold"
                    >
                      {sound}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-sm font-bold rounded-tr-2xl">
                    स्थिति
                  </th>
                </tr>
              </thead>

              <tbody
                className={`divide-y ${
                  theme === "dark" ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {Array.from({ length: maxSessions }, (_, rowIndex) => {
                  const sessionNum = rowIndex + 1;
                  const rowSessions = {};
                  let hasNewRecord = false;

                  // For each sound, get the session at this row position
                  allSounds.forEach(sound => {
                    if (sessionsBySound[sound] && sessionsBySound[sound][rowIndex]) {
                      const session = sessionsBySound[sound][rowIndex];
                      rowSessions[sound] = session;
                      if (session.isNewBest) hasNewRecord = true;
                    }
                  });

                  // Skip empty rows
                  if (Object.keys(rowSessions).length === 0) return null;

                  return (
                    <tr
                      key={sessionNum}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-purple-600 dark:text-purple-400">
                        #{sessionNum}
                      </td>

                      {allSounds.map((sound) => {
                        const session = rowSessions[sound];
                        return (
                          <td key={sound} className="px-4 py-3 text-center">
                            {session ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-lg font-mono font-bold">
                                  {(session.time / 10).toFixed(2)}
                                </span>
                                {session.isNewBest && (
                                  <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                    🏆
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">--</span>
                            )}
                          </td>
                        );
                      })}

                      <td className="px-4 py-3 text-center">
                        {hasNewRecord && (
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full text-xs font-bold">
                            रिकॉर्ड
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                }).filter(Boolean)}
              </tbody>
            </table>
          </div>
        </div>
      );
    })
    .filter(Boolean)}
</div>


            {/* Detailed Varnmala Records */}
            <div
              className={`p-8 rounded-3xl shadow-2xl border ${
                theme === "dark"
                  ? "bg-gray-800/50 border-gray-700/20"
                  : "bg-white/50 border-gray-200/20"
              } backdrop-blur-xl`}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <i className="fas fa-list text-purple-500"></i>
                वर्णमाला अभ्यास का पूरा इतिहास ({records.varnmala.length}{" "}
                रिकॉर्ड)
              </h3>

              {records.varnmala.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-bold rounded-tl-2xl">
                          सत्र
                        </th>
                        <th className="px-6 py-4 text-left font-bold">समय</th>
                        <th className="px-6 py-4 text-left font-bold">
                          दिनांक
                        </th>
                        <th className="px-6 py-4 text-left font-bold">
                          गुणवत्ता
                        </th>
                        <th className="px-6 py-4 text-left font-bold">लैप्स</th>
                        <th className="px-6 py-4 text-left font-bold rounded-tr-2xl">
                          लैप विवरण
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        theme === "dark" ? "divide-gray-700" : "divide-gray-200"
                      }`}
                    >
                      {records.varnmala
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .map((record, index) => (
                          <tr
                            key={record.timestamp}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                सत्र #{record.session}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xl font-mono font-bold">
                                {(record.time / 10).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium">
                                  {new Date(
                                    record.timestamp
                                  ).toLocaleDateString("hi-IN")}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(
                                    record.timestamp
                                  ).toLocaleTimeString("hi-IN")}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-bold ${
                                  record.quality === "उत्कृष्ट"
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                    : record.quality === "अच्छा"
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                    : record.quality === "सामान्य"
                                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                                    : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                }`}
                              >
                                {record.quality}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold">
                              {record.laps?.length || 0}
                            </td>
                            <td className="px-6 py-4">
                              {record.laps && record.laps.length > 0 && (
                                <div className="max-w-xs">
                                  <details className="cursor-pointer">
                                    <summary className="text-blue-500 hover:text-blue-600 font-medium">
                                      लैप समय देखें
                                    </summary>
                                    <div className="mt-2 space-y-1 text-sm">
                                      {record.laps.map((lap, lapIndex) => (
                                        <div
                                          key={lapIndex}
                                          className="flex justify-between"
                                        >
                                          <span>लैप {lap.lapNumber}:</span>
                                          <span className="font-mono">
                                            {(lap.time / 10).toFixed(2)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </details>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="fas fa-list text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
                  <p className="text-xl text-gray-500 dark:text-gray-400">
                    अभी तक कोई वर्णमाला अभ्यास रिकॉर्ड नहीं है
                  </p>
                </div>
              )}
            </div>

            {/* Detailed Story Records */}
            <div
              className={`p-8 rounded-3xl shadow-2xl border ${
                theme === "dark"
                  ? "bg-gray-800/50 border-gray-700/20"
                  : "bg-white/50 border-gray-200/20"
              } backdrop-blur-xl`}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <i className="fas fa-book text-green-500"></i>
                पठन अभ्यास का पूरा इतिहास ({records.stories.length} रिकॉर्ड)
              </h3>

              {records.stories.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-bold rounded-tl-2xl">
                          कहानी प्रकार
                        </th>
                        <th className="px-6 py-4 text-left font-bold">समय</th>
                        <th className="px-6 py-4 text-left font-bold">
                          लक्ष्य
                        </th>
                        <th className="px-6 py-4 text-left font-bold">स्कोर</th>
                        <th className="px-6 py-4 text-left font-bold">
                          प्रतिशत
                        </th>
                        <th className="px-6 py-4 text-left font-bold rounded-tr-2xl">
                          दिनांक
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        theme === "dark" ? "divide-gray-700" : "divide-gray-200"
                      }`}
                    >
                      {records.stories
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .map((record, index) => (
                          <tr
                            key={record.timestamp}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                {record.storyType}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xl font-mono font-bold">
                                {(record.time / 10).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-mono text-gray-600 dark:text-gray-400">
                                {record.target}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`text-lg ${
                                  record.percentage >= 100
                                    ? "text-green-600 dark:text-green-400"
                                    : record.percentage >= 80
                                    ? "text-blue-600 dark:text-blue-400"
                                    : record.percentage >= 60
                                    ? "text-yellow-600 dark:text-yellow-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {record.score}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      record.percentage >= 100
                                        ? "bg-green-500"
                                        : record.percentage >= 80
                                        ? "bg-blue-500"
                                        : record.percentage >= 60
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{
                                      width: `${Math.min(
                                        record.percentage,
                                        100
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="font-bold">
                                  {record.percentage}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium">
                                  {new Date(
                                    record.timestamp
                                  ).toLocaleDateString("hi-IN")}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(
                                    record.timestamp
                                  ).toLocaleTimeString("hi-IN")}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="fas fa-book text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
                  <p className="text-xl text-gray-500 dark:text-gray-400">
                    अभी तक कोई पठन अभ्यास रिकॉर्ड नहीं है
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="relative mt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center text-white space-y-8">
            <div className="space-y-4">
              <div className="w-12 md:w-16 h-12 md:h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center">
                <i className="fas fa-stopwatch text-2xl md:text-3xl"></i>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold">Speech Good</h3>
              <p className="text-lg md:text-2xl opacity-90">
                Professional Speech Therapy Platform
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <div className="w-12 md:w-16 h-12 md:h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center">
                  <i className="fas fa-users text-xl md:text-2xl"></i>
                </div>
                <h4 className="text-lg md:text-xl font-bold">
                  Community Support
                </h4>
                <p className="opacity-75">
                  Join thousands improving their speech
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-12 md:w-16 h-12 md:h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center">
                  <i className="fas fa-certificate text-xl md:text-2xl"></i>
                </div>
                <h4 className="text-lg md:text-xl font-bold">
                  Certified Methods
                </h4>
                <p className="opacity-75">Evidence-based therapy techniques</p>
              </div>

              <div className="space-y-4">
                <div className="w-12 md:w-16 h-12 md:h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center">
                  <i className="fas fa-mobile-alt text-xl md:text-2xl"></i>
                </div>
                <h4 className="text-lg md:text-xl font-bold">
                  Always Available
                </h4>
                <p className="opacity-75">Practice anytime, anywhere</p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/20">
              <p className="text-lg md:text-xl mb-4">
                &copy; 2025 Speech Good - Transform your speech, transform your
                life.
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-base md:text-lg opacity-75">
                <span>Version 2.0</span>
                <span className="hidden md:inline">•</span>
                <span>
                  Total Sessions:{" "}
                  {Object.values(soundTimers).reduce(
                    (sum, timer) => sum + timer.sessions,
                    0
                  )}
                </span>
                <span className="hidden md:inline">•</span>
                <span>
                  Records:{" "}
                  {records.sounds.length +
                    records.varnmala.length +
                    records.stories.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hindi;
