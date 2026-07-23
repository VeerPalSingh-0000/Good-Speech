// src/components/views/EasyOnsetView.jsx - Stamurai Easy Onset Studio (First Syllable Stretching For Every Word)

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlay,
  FaPause,
  FaRedo,
  FaVolumeUp,
  FaMicrophone,
  FaStop,
  FaCheckCircle,
  FaClock,
  FaFeatherAlt,
  FaWind,
  FaInfoCircle,
  FaChevronRight,
  FaChevronLeft,
  FaArrowLeft,
  FaCheck,
  FaTrophy,
  FaLightbulb,
  FaGlobe
} from 'react-icons/fa';

// Progressive Practice Data
// Each word in every sentence has its FIRST SYLLABLE stretched (e.g., "iii... I", "aaa... am", "eee... eating", "aaa... apple")
const PRACTICE_DATA = [
  // LEVEL 1: Isolated Sounds
  {
    level: 1,
    title: "Level 1: Isolated Sounds",
    subtitle: "Master starting isolated sounds with first-syllable stretching (अ..अ.. / a..a..)",
    badge: "Basic Onset",
    icon: "🔤",
    items: [
      // Hindi Swar
      { id: "hi-l1-1", words: [{ text: "अनार", stretched: "अ..अ.. अनार" }], hint: "Stretch the first syllable gently: 'अ..अ.. अनार'", lang: "hi" },
      { id: "hi-l1-2", words: [{ text: "आम", stretched: "आ..आ.. आम" }], hint: "Keep throat relaxed: 'आ..आ.. आम'", lang: "hi" },
      { id: "hi-l1-3", words: [{ text: "इमली", stretched: "इ..इ.. इमली" }], hint: "Start smoothly with soft breath: 'इ..इ.. इमली'", lang: "hi" },
      { id: "hi-l1-4", words: [{ text: "ईख", stretched: "ई..ई.. ईख" }], hint: "Let the sound flow naturally: 'ई..ई.. ईख'", lang: "hi" },
      { id: "hi-l1-5", words: [{ text: "उल्लू", stretched: "उ..उ.. उल्लू" }], hint: "Softly stretch initial sound: 'उ..उ.. उल्लू'", lang: "hi" },
      { id: "hi-l1-6", words: [{ text: "एक", stretched: "ए..ए.. एक" }], hint: "Glide into the vowel with zero tension: 'ए..ए.. एक'", lang: "hi" },
      { id: "hi-l1-7", words: [{ text: "ओस", stretched: "ओ..ओ.. ओस" }], hint: "Practice gentle sound release: 'ओ..ओ.. ओस'", lang: "hi" },
      // English Vowels
      { id: "en-l1-1", words: [{ text: "apple", stretched: "a..a.. apple" }], hint: "Softly stretch first syllable: 'a..a.. apple'", lang: "en" },
      { id: "en-l1-2", words: [{ text: "evening", stretched: "e..e.. evening" }], hint: "Keep vocal cords loose: 'e..e.. evening'", lang: "en" },
      { id: "en-l1-3", words: [{ text: "India", stretched: "i..i.. India" }], hint: "No hard vocal attack: 'i..i.. India'", lang: "en" },
      { id: "en-l1-4", words: [{ text: "open", stretched: "o..o.. open" }], hint: "Softly round lips: 'o..o.. open'", lang: "en" },
      { id: "en-l1-5", words: [{ text: "umbrella", stretched: "u..u.. umbrella" }], hint: "Glide softly into first syllable: 'u..u.. umbrella'", lang: "en" },
    ]
  },

  // LEVEL 2: Single Words
  {
    level: 2,
    title: "Level 2: Single Words",
    subtitle: "Practice easy onset & first-syllable stretching on single words.",
    badge: "Word Level",
    icon: "💬",
    items: [
      // Hindi Words
      { id: "hi-l2-1", words: [{ text: "अनार", stretched: "अ..अ.. अनार" }], translation: "Pomegranate", hint: "Exhale softly first, then stretch 1st syllable: 'अ..अ.. अनार'", lang: "hi" },
      { id: "hi-l2-2", words: [{ text: "आम", stretched: "आ..आ.. आम" }], translation: "Mango", hint: "Soft start on 1st syllable: 'आ..आ.. आम'", lang: "hi" },
      { id: "hi-l2-3", words: [{ text: "इमली", stretched: "इ..इ.. इमली" }], translation: "Tamarind", hint: "Gentle breath leads into 'इ..इ.. इमली'", lang: "hi" },
      { id: "hi-l2-4", words: [{ text: "ईश्वर", stretched: "ई..ई.. ईश्वर" }], translation: "God", hint: "Flow smoothly into 'ई..ई.. ईश्वर'", lang: "hi" },
      { id: "hi-l2-5", words: [{ text: "उजाला", stretched: "उ..उ.. उजाला" }], translation: "Light", hint: "Release quiet breath, then stretch 'उ..उ.. उजाला'", lang: "hi" },
      { id: "hi-l2-6", words: [{ text: "एकता", stretched: "ए..ए.. एकता" }], translation: "Unity", hint: "Glide effortlessly: 'ए..ए.. एकता'", lang: "hi" },
      // English Words
      { id: "en-l2-1", words: [{ text: "apple", stretched: "a..a.. apple" }], translation: "Apple", hint: "Soft 1st syllable stretch: 'a..a.. apple'", lang: "en" },
      { id: "en-l2-2", words: [{ text: "evening", stretched: "e..e.. evening" }], translation: "Evening", hint: "Soft start: 'e..e.. evening'", lang: "en" },
      { id: "en-l2-3", words: [{ text: "open", stretched: "o..o.. open" }], translation: "Open", hint: "Air leads into 'o..o.. open'", lang: "en" },
      { id: "en-l2-4", words: [{ text: "umbrella", stretched: "u..u.. umbrella" }], translation: "Umbrella", hint: "Glide smoothly into 'u..u.. umbrella'", lang: "en" },
    ]
  },

  // LEVEL 3: Short Phrases
  {
    level: 3,
    title: "Level 3: Short Phrases",
    subtitle: "Stretch the FIRST SYLLABLE of EACH WORD in short phrases.",
    badge: "Phrase Level",
    icon: "🗣️",
    items: [
      // Hindi Phrases
      { 
        id: "hi-l3-1", 
        words: [
          { text: "आज", stretched: "आ..आ.. आज" },
          { text: "अच्छा", stretched: "अ..अ.. अच्छा" },
          { text: "दिन", stretched: "दि..दि.. दिन" },
          { text: "है", stretched: "है..है.. है" }
        ],
        translation: "Today is a good day", 
        hint: "Stretch 1st syllable of EACH word: 'आ..आ.. आज' ➔ 'अ..अ.. अच्छा' ➔ 'दि..दि.. दिन' ➔ 'है..है.. है'", 
        lang: "hi" 
      },
      { 
        id: "hi-l3-2", 
        words: [
          { text: "एक", stretched: "ए..ए.. एक" },
          { text: "कदम", stretched: "क..क.. कदम" },
          { text: "रोज़", stretched: "रो..रो.. रोज़" },
          { text: "बढ़ाओ", stretched: "ब..ब.. बढ़ाओ" }
        ],
        translation: "Take one step daily", 
        hint: "Stretch 1st syllable of EACH word in sequence", 
        lang: "hi" 
      },
      { 
        id: "hi-l3-3", 
        words: [
          { text: "आप", stretched: "आ..आ.. आप" },
          { text: "कैसे", stretched: "कै..कै.. कैसे" },
          { text: "हैं", stretched: "हैं..हैं.. हैं" }
        ],
        translation: "How are you", 
        hint: "Gentle 1st syllable stretch on EVERY word", 
        lang: "hi" 
      },
      { 
        id: "hi-l3-4", 
        words: [
          { text: "सब", stretched: "स..स.. सब" },
          { text: "ठीक", stretched: "ठी..ठी.. ठीक" },
          { text: "है", stretched: "है..है.. है" }
        ],
        translation: "All is well", 
        hint: "Stretch 1st syllable of each word smoothly", 
        lang: "hi" 
      },
      // English Phrases
      { 
        id: "en-l3-1", 
        words: [
          { text: "I", stretched: "i..i.. I" },
          { text: "can", stretched: "c..c.. can" },
          { text: "do", stretched: "d..d.. do" },
          { text: "it", stretched: "i..i.. it" }
        ],
        translation: "I can do it", 
        hint: "Stretch 1st syllable of EACH word: 'i..i.. I' ➔ 'c..c.. can' ➔ 'd..d.. do' ➔ 'i..i.. it'", 
        lang: "en" 
      },
      { 
        id: "en-l3-2", 
        words: [
          { text: "Apples", stretched: "a..a.. Apples" },
          { text: "are", stretched: "a..a.. are" },
          { text: "sweet", stretched: "s..s.. sweet" }
        ],
        translation: "Apples are sweet", 
        hint: "Stretch 1st syllable of EVERY word in the phrase", 
        lang: "en" 
      },
      { 
        id: "en-l3-3", 
        words: [
          { text: "Open", stretched: "o..o.. Open" },
          { text: "the", stretched: "t..t.. the" },
          { text: "door", stretched: "d..d.. door" }
        ],
        translation: "Open the door", 
        hint: "Gentle 1st syllable stretch on each word", 
        lang: "en" 
      },
    ]
  },

  // LEVEL 4: Full Sentences
  {
    level: 4,
    title: "Level 4: Full Sentences",
    subtitle: "Stretch the FIRST SYLLABLE of EACH WORD in full sentences.",
    badge: "Sentence Mastery",
    icon: "🏆",
    items: [
      // Hindi Sentences
      { 
        id: "hi-l4-1", 
        words: [
          { text: "मैं", stretched: "म..म.. मैं" },
          { text: "शांत", stretched: "शा..शा.. शांत" },
          { text: "और", stretched: "औ..औ.. और" },
          { text: "सहजता", stretched: "स..स.. सहजता" },
          { text: "से", stretched: "से..से.. से" },
          { text: "बात", stretched: "बा..बा.. बात" },
          { text: "करता", stretched: "क..क.. करता" },
          { text: "हूँ।", stretched: "हूँ..हूँ.. हूँ।" }
        ],
        translation: "I speak calmly and smoothly", 
        hint: "Stretch the 1st syllable of EVERY word: 'म..म.. मैं' ➔ 'शा..शा.. शांत' ➔ 'औ..औ.. और'...", 
        lang: "hi" 
      },
      { 
        id: "hi-l4-2", 
        words: [
          { text: "हर", stretched: "ह..ह.. हर" },
          { text: "दिन", stretched: "दि..दि.. दिन" },
          { text: "एक", stretched: "ए..ए.. एक" },
          { text: "नया", stretched: "न..न.. नया" },
          { text: "अवसर", stretched: "अ..अ.. अवसर" },
          { text: "लाता", stretched: "ला..ला.. लाता" },
          { text: "है।", stretched: "है..है.. है।" }
        ],
        translation: "Every day brings a new opportunity", 
        hint: "Apply 1st syllable stretch across all words", 
        lang: "hi" 
      },
      // English Sentences
      { 
        id: "en-l4-1", 
        words: [
          { text: "I", stretched: "i..i.. I" },
          { text: "am", stretched: "a..a.. am" },
          { text: "eating", stretched: "e..e.. eating" },
          { text: "apple.", stretched: "a..a.. apple." }
        ],
        translation: "I am eating apple", 
        hint: "Stretch 1st syllable of EACH word: 'i..i.. I' ➔ 'a..a.. am' ➔ 'e..e.. eating' ➔ 'a..a.. apple'", 
        lang: "en" 
      },
      { 
        id: "en-l4-2", 
        words: [
          { text: "Every", stretched: "e..e.. Every" },
          { text: "morning", stretched: "m..m.. morning" },
          { text: "brings", stretched: "b..b.. brings" },
          { text: "a", stretched: "a..a.. a" },
          { text: "fresh", stretched: "f..f.. fresh" },
          { text: "start.", stretched: "s..s.. start." }
        ],
        translation: "Every morning brings a fresh start", 
        hint: "Stretch 1st syllable of EACH word in sequence", 
        lang: "en" 
      }
    ]
  }
];

const TIMER_OPTIONS = [2, 3, 5, 10]; // Minutes

const EasyOnsetView = ({ user, records, showNotification, saveToFirebase }) => {
  // Setup Config state
  const [selectedLang, setSelectedLang] = useState('hi'); // 'hi' | 'en' | 'both'
  const [selectedLevelIdx, setSelectedLevelIdx] = useState(0);
  const [selectedTimerMins, setSelectedTimerMins] = useState(3);
  
  // App screen flow state: 'setup' | 'practice' | 'complete'
  const [screen, setScreen] = useState('setup');
  
  // Session practice state
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedItems, setCompletedItems] = useState({});
  const [breathPhase, setBreathPhase] = useState('inhale'); // 'inhale' | 'exhale' | 'speak'
  const [activeWordIdx, setActiveWordIdx] = useState(null);
  
  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Filter practice items based on selected language
  const availableItems = useMemo(() => {
    const rawLevel = PRACTICE_DATA[selectedLevelIdx];
    if (!rawLevel) return [];
    if (selectedLang === 'both') return rawLevel.items;
    return rawLevel.items.filter(item => item.lang === selectedLang);
  }, [selectedLevelIdx, selectedLang]);

  const currentLevel = PRACTICE_DATA[selectedLevelIdx];
  const currentItem = availableItems[currentItemIdx] || availableItems[0];

  // Full text string of current item
  const fullItemText = useMemo(() => {
    if (!currentItem || !currentItem.words) return '';
    return currentItem.words.map(w => w.text).join(' ');
  }, [currentItem]);

  // Timer Countdown Effect
  useEffect(() => {
    let interval;
    if (screen === 'practice' && isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            setScreen('complete');
            if (showNotification) showNotification("🎉 Time's up! Great session!", "success");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, isTimerRunning, showNotification]);

  // Breath rhythm animation cycle
  useEffect(() => {
    let breathTimer;
    if (screen === 'practice') {
      const cycleBreath = () => {
        setBreathPhase('inhale');
        breathTimer = setTimeout(() => {
          setBreathPhase('exhale');
          breathTimer = setTimeout(() => {
            setBreathPhase('speak');
            breathTimer = setTimeout(() => {
              cycleBreath();
            }, 3000);
          }, 3000);
        }, 3000);
      };
      cycleBreath();
    }
    return () => clearTimeout(breathTimer);
  }, [screen]);

  // Start Practice Action
  const startPractice = () => {
    if (availableItems.length === 0) {
      if (showNotification) showNotification("No items available for this language selection.", "error");
      return;
    }
    setTimerSeconds(selectedTimerMins * 60);
    setCurrentItemIdx(0);
    setCompletedItems({});
    setAudioUrl(null);
    setActiveWordIdx(null);
    setScreen('practice');
    setIsTimerRunning(true);
  };

  // Text-to-Speech playback
  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.75;
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Voice recording handlers using MediaRecorder API
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access failed", err);
      if (showNotification) showNotification("Microphone permission needed to record practice.", "error");
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Flashcard Navigation
  const handleNext = () => {
    if (currentItem) {
      setCompletedItems(prev => ({ ...prev, [currentItem.id]: true }));
    }
    setAudioUrl(null);
    setActiveWordIdx(null);
    if (currentItemIdx < availableItems.length - 1) {
      setCurrentItemIdx(prev => prev + 1);
    } else {
      setScreen('complete');
      setIsTimerRunning(false);
    }
  };

  const handlePrev = () => {
    setAudioUrl(null);
    setActiveWordIdx(null);
    if (currentItemIdx > 0) {
      setCurrentItemIdx(prev => prev - 1);
    }
  };

  const totalCompletedCount = Object.keys(completedItems).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-3 sm:px-6 pb-16">
      {/* ==============================================
          SCREEN 1: SETUP SCREEN (PROFESSIONAL UI)
      ============================================== */}
      {screen === 'setup' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl border border-white/10">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-500/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-xs font-black uppercase tracking-wider text-purple-300 shadow-inner">
                <FaFeatherAlt className="text-amber-300 animate-bounce" />
                <span>Stamurai Speech Therapy</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-purple-200">
                Easy Onset Studio
              </h1>
              
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
                Master smooth speech by stretching <span className="text-sky-300 font-bold underline decoration-sky-400">the FIRST SYLLABLE of EACH WORD</span> (e.g. <span className="text-purple-300 font-mono">i..i.. I  a..a.. am  e..e.. eating  a..a.. apple</span>).
              </p>
            </div>
          </div>

          {/* Setup Options Box */}
          <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-10 border border-slate-800/90 shadow-2xl space-y-8 text-white">
            
            {/* 1. Language Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FaGlobe className="text-purple-400" /> 1. Select Language:
                </label>
                <span className="text-[11px] font-bold text-slate-400">Target words language</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Hindi Option */}
                <button
                  onClick={() => setSelectedLang('hi')}
                  className={`relative p-5 rounded-3xl text-left transition-all duration-300 border-2 flex items-center gap-4 ${
                    selectedLang === 'hi'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400 text-white shadow-xl shadow-purple-600/30 scale-[1.02]'
                      : 'bg-slate-800/40 border-slate-700/80 text-slate-300 hover:bg-slate-800/80 hover:border-slate-600'
                  }`}
                >
                  <div className="text-3xl shrink-0 p-2.5 rounded-2xl bg-white/10 backdrop-blur-md">
                    🇮🇳
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-extrabold text-base truncate">Hindi (हिंदी)</h4>
                    <p className="text-xs text-slate-200/80 font-medium truncate">अ..अ.. अनार, आम</p>
                  </div>
                  {selectedLang === 'hi' && (
                    <div className="ml-auto w-6 h-6 rounded-full bg-white text-purple-700 flex items-center justify-center text-xs font-bold shadow shrink-0">
                      ✓
                    </div>
                  )}
                </button>

                {/* English Option */}
                <button
                  onClick={() => setSelectedLang('en')}
                  className={`relative p-5 rounded-3xl text-left transition-all duration-300 border-2 flex items-center gap-4 ${
                    selectedLang === 'en'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400 text-white shadow-xl shadow-purple-600/30 scale-[1.02]'
                      : 'bg-slate-800/40 border-slate-700/80 text-slate-300 hover:bg-slate-800/80 hover:border-slate-600'
                  }`}
                >
                  <div className="text-3xl shrink-0 p-2.5 rounded-2xl bg-white/10 backdrop-blur-md">
                    🇬🇧
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-extrabold text-base truncate">English</h4>
                    <p className="text-xs text-slate-200/80 font-medium truncate">i..i.. I, a..a.. am</p>
                  </div>
                  {selectedLang === 'en' && (
                    <div className="ml-auto w-6 h-6 rounded-full bg-white text-purple-700 flex items-center justify-center text-xs font-bold shadow shrink-0">
                      ✓
                    </div>
                  )}
                </button>

                {/* Both Option */}
                <button
                  onClick={() => setSelectedLang('both')}
                  className={`relative p-5 rounded-3xl text-left transition-all duration-300 border-2 flex items-center gap-4 ${
                    selectedLang === 'both'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400 text-white shadow-xl shadow-purple-600/30 scale-[1.02]'
                      : 'bg-slate-800/40 border-slate-700/80 text-slate-300 hover:bg-slate-800/80 hover:border-slate-600'
                  }`}
                >
                  <div className="text-3xl shrink-0 p-2.5 rounded-2xl bg-white/10 backdrop-blur-md">
                    🌐
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-extrabold text-base truncate">Both</h4>
                    <p className="text-xs text-slate-200/80 font-medium truncate">Mixed practice</p>
                  </div>
                  {selectedLang === 'both' && (
                    <div className="ml-auto w-6 h-6 rounded-full bg-white text-purple-700 flex items-center justify-center text-xs font-bold shadow shrink-0">
                      ✓
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* 2. Level Selector */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">
                2. Select Practice Level:
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {PRACTICE_DATA.map((lvl, idx) => (
                  <button
                    key={lvl.level}
                    onClick={() => setSelectedLevelIdx(idx)}
                    className={`p-5 rounded-3xl text-left transition-all duration-300 border-2 flex items-start gap-4 ${
                      selectedLevelIdx === idx
                        ? 'bg-gradient-to-br from-purple-950/90 via-slate-900 to-indigo-950/90 border-purple-500 text-white shadow-xl shadow-purple-950/50 scale-[1.01]'
                        : 'bg-slate-800/40 border-slate-700/80 text-slate-300 hover:bg-slate-800/80 hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                      selectedLevelIdx === idx ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {lvl.icon}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                        <h4 className="font-display font-extrabold text-sm sm:text-base text-white">
                          {lvl.title}
                        </h4>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                          selectedLevelIdx === idx ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {lvl.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        {lvl.subtitle}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Session Duration Selection */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">
                3. Select Session Duration:
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TIMER_OPTIONS.map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setSelectedTimerMins(mins)}
                    className={`py-3.5 px-4 rounded-2xl font-display font-black text-sm transition-all duration-300 border-2 flex items-center justify-center gap-2.5 ${
                      selectedTimerMins === mins
                        ? 'bg-gradient-to-r from-indigo-600 to-sky-600 border-sky-400 text-white shadow-xl shadow-indigo-600/30 scale-105'
                        : 'bg-slate-800/40 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <FaClock className={selectedTimerMins === mins ? 'text-sky-300' : 'text-slate-400'} />
                    <span>{mins} Minutes</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startPractice}
              className="w-full py-5 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-display font-black text-lg sm:text-xl shadow-2xl shadow-purple-600/40 hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] group"
            >
              <FaPlay className="group-hover:translate-x-1 transition-transform" />
              <span>Start {selectedLang === 'hi' ? 'Hindi' : selectedLang === 'en' ? 'English' : 'Combined'} Practice ({selectedTimerMins} mins)</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* ==============================================
          SCREEN 2: PRACTICE FLOW (FIRST SYLLABLE STRETCH FOR EACH WORD)
      ============================================== */}
      {screen === 'practice' && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          {/* Top Session Control Bar */}
          <div className="bg-slate-900/90 backdrop-blur-xl text-white p-4 rounded-3xl border border-slate-800 shadow-2xl flex items-center justify-between">
            <button
              onClick={() => setScreen('setup')}
              className="text-xs font-extrabold text-slate-400 hover:text-white flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-slate-800 transition-all border border-slate-800"
            >
              <FaArrowLeft /> Exit Session
            </button>

            {/* Countdown Timer Badge */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-2 rounded-2xl border border-slate-700/80 font-mono text-sm font-black text-sky-400 shadow-inner">
              <FaClock className="text-sky-400 animate-pulse" />
              <span>{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</span>
            </div>

            {/* Progress Count */}
            <div className="text-xs font-black text-purple-300 bg-purple-950/80 px-4 py-2 rounded-2xl border border-purple-800/60 shadow-lg">
              Card {currentItemIdx + 1} / {availableItems.length}
            </div>
          </div>

          {/* Main Practice Flashcard Container */}
          <div className="bg-slate-900/95 border border-slate-800/90 rounded-[2.5rem] p-6 sm:p-12 shadow-2xl relative overflow-hidden text-white space-y-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Level Badge & Listen Button */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black uppercase tracking-widest text-purple-400">
                  {currentLevel.badge}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {currentItem?.lang === 'hi' ? '🇮🇳 Hindi' : '🇬🇧 English'}
                </span>
              </div>

              <button
                onClick={() => speakText(fullItemText, currentItem?.lang)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/80 text-purple-300 text-xs font-extrabold hover:bg-purple-900 transition-all border border-purple-700/60 shadow-lg"
              >
                <FaVolumeUp /> Listen Full Phrase
              </button>
            </div>

            {/* First Syllable Stretching Display for EVERY WORD */}
            {currentItem && (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
                
                {/* Visual Cards Showing First Syllable Stretch for EACH Word */}
                <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 w-full">
                  {currentItem.words.map((w, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveWordIdx(idx);
                        speakText(w.stretched, currentItem.lang);
                      }}
                      className={`px-5 py-3.5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center text-center shadow-xl active:scale-95 ${
                        activeWordIdx === idx
                          ? 'bg-gradient-to-br from-purple-600 to-indigo-600 border-purple-300 text-white scale-105 shadow-purple-600/50'
                          : 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-purple-400'
                      }`}
                    >
                      <span className="text-2xl sm:text-4xl font-extrabold font-mono text-sky-300 tracking-tight">
                        {w.stretched}
                      </span>
                    </button>
                  ))}
                </div>

                {currentItem.translation && (
                  <p className="text-sm sm:text-base text-slate-400 font-medium italic">
                    "{currentItem.translation}"
                  </p>
                )}

                {/* Technique Hint Pill */}
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs sm:text-sm font-semibold max-w-xl shadow-md">
                  <FaLightbulb className="shrink-0 text-amber-400" />
                  <span>{currentItem.hint}</span>
                </div>
              </div>
            )}

            {/* Breath Rhythm Guide */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex items-center justify-between text-xs relative z-10">
              <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Rhythm Guide:</span>
              <div className="flex items-center gap-2 font-black">
                <span className={`px-3.5 py-1.5 rounded-xl transition-all ${breathPhase === 'inhale' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' : 'text-slate-500'}`}>
                  🌬️ Inhale
                </span>
                <span className="text-slate-600">➔</span>
                <span className={`px-3.5 py-1.5 rounded-xl transition-all ${breathPhase === 'exhale' ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30' : 'text-slate-500'}`}>
                  💨 Soft Airflow
                </span>
                <span className="text-slate-600">➔</span>
                <span className={`px-3.5 py-1.5 rounded-xl transition-all ${breathPhase === 'speak' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'text-slate-500'}`}>
                  🗣️ Stretch 1st Syllables
                </span>
              </div>
            </div>

            {/* Voice Record & Playback Box */}
            <div className="bg-slate-800/90 rounded-3xl p-5 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <button
                  onClick={isRecording ? stopAudioRecording : startAudioRecording}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-all shadow-xl active:scale-95 ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/50'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                  }`}
                >
                  {isRecording ? <FaStop /> : <FaMicrophone />}
                </button>
                <div>
                  <span className="text-sm font-extrabold text-white block">
                    {isRecording ? "Recording your speech..." : "Record & Assess Your Voice"}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {isRecording ? "Stretch 1st syllable of EACH word" : "Tap microphone to test easy onset"}
                  </span>
                </div>
              </div>

              {audioUrl && !isRecording && (
                <div className="flex items-center gap-2.5 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                    <FaCheckCircle /> Saved
                  </span>
                  <audio controls src={audioUrl} className="h-8 w-40 sm:w-52 accent-purple-500" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 relative z-10">
              <button
                onClick={handlePrev}
                disabled={currentItemIdx === 0}
                className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-2 transition-all"
              >
                <FaChevronLeft /> Previous
              </button>

              <button
                onClick={handleNext}
                className="px-9 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-black text-sm flex items-center gap-2 shadow-xl shadow-purple-600/40 transition-all active:scale-95"
              >
                Next Card <FaChevronRight />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==============================================
          SCREEN 3: COMPLETE / CELEBRATION SCREEN
      ============================================== */}
      {screen === 'complete' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
          <div className="bg-slate-900/95 border border-slate-800 text-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl space-y-6 max-w-xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 text-white rounded-full flex items-center justify-center text-5xl shadow-2xl shadow-amber-500/30 mx-auto animate-bounce">
              <FaTrophy />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
                Session Complete!
              </h2>
              <p className="text-sm text-slate-400 font-medium">
                Outstanding work practicing first-syllable stretching on every word!
              </p>
            </div>

            {/* Session Stats */}
            <div className="grid grid-cols-2 gap-4 p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80">
              <div className="p-3">
                <span className="text-3xl font-black text-purple-400 font-display block">
                  {totalCompletedCount}
                </span>
                <span className="text-xs font-bold text-slate-400">Cards Practiced</span>
              </div>
              <div className="p-3">
                <span className="text-3xl font-black text-indigo-400 font-display block">
                  {selectedTimerMins}m
                </span>
                <span className="text-xs font-bold text-slate-400">Duration</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={startPractice}
                className="flex-1 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-display font-bold text-sm shadow-xl shadow-purple-600/30 transition-all"
              >
                Practice Again
              </button>
              <button
                onClick={() => setScreen('setup')}
                className="flex-1 py-4 rounded-2xl bg-slate-800 text-slate-300 font-display font-bold text-sm hover:bg-slate-700 transition-all border border-slate-700"
              >
                Change Level / Language
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EasyOnsetView;
