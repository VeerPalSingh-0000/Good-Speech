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

import { getFilteredItems, generateRandomProceduralItem } from '../../data/easyOnsetData';

// Progressive Practice Data (Level Info)
const PRACTICE_DATA = [
  {
    level: 1,
    title: "Single Words",
    subtitle: "Single word onset practice",
    badge: "Words",
    icon: "💬"
  },
  {
    level: 2,
    title: "Sentences",
    subtitle: "Sentence & phrase onset mastery",
    badge: "Sentences",
    icon: "🏆"
  }
];

const EasyOnsetView = ({ user, records, showNotification, saveToFirebase }) => {
  // Setup Config state (Default English 'en')
  const [selectedLang, setSelectedLang] = useState('en'); // 'en' | 'hi'
  const [selectedLevelIdx, setSelectedLevelIdx] = useState(0);
  
  // App screen flow state: 'setup' | 'practice' | 'complete'
  const [screen, setScreen] = useState('setup');
  
  // Session practice state (Infinite Deck)
  const [activeDeck, setActiveDeck] = useState([]);
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedItems, setCompletedItems] = useState({});
  const [breathPhase, setBreathPhase] = useState('inhale'); // 'inhale' | 'exhale' | 'speak'
  const [activeWordIdx, setActiveWordIdx] = useState(null);
  
  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);



  // Stopwatch Timer Effect (Counts UP from 0:00)
  useEffect(() => {
    let interval;
    if (screen === 'practice' && isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, isTimerRunning]);

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

  // Start Practice Action for a given level
  const startPracticeForLevel = (levelIdx) => {
    setSelectedLevelIdx(levelIdx);
    const initialPool = getFilteredItems(levelIdx, selectedLang);
    if (!initialPool || initialPool.length === 0) {
      if (showNotification) showNotification("No items available for this language selection.", "error");
      return;
    }
    // Shuffle initial dataset pool randomly
    const shuffled = [...initialPool].sort(() => Math.random() - 0.5);
    setActiveDeck(shuffled);
    setCurrentItemIdx(0);
    setCompletedItems({});
    setTimerSeconds(0);
    setAudioUrl(null);
    setActiveWordIdx(null);
    setScreen('practice');
    setIsTimerRunning(true);
  };

  // Live language toggle inside practice card
  const handleToggleLanguage = (targetLang) => {
    setSelectedLang(targetLang);
    const newPool = getFilteredItems(selectedLevelIdx, targetLang);
    if (newPool && newPool.length > 0) {
      const shuffled = [...newPool].sort(() => Math.random() - 0.5);
      setActiveDeck(shuffled);
      setCurrentItemIdx(0);
      setActiveWordIdx(null);
    }
  };

  const currentLevel = PRACTICE_DATA[selectedLevelIdx];
  const currentItem = activeDeck[currentItemIdx] || activeDeck[0];

  // Full text string of current item
  const fullItemText = useMemo(() => {
    if (!currentItem || !currentItem.words) return '';
    return currentItem.words.map(w => w.text).join(' ');
  }, [currentItem]);

  // Flashcard Navigation (Infinite Deck)
  const handleNext = () => {
    if (currentItem) {
      setCompletedItems(prev => ({ ...prev, [currentItem.id]: true }));
    }
    setAudioUrl(null);
    setActiveWordIdx(null);
    if (currentItemIdx < activeDeck.length - 1) {
      setCurrentItemIdx(prev => prev + 1);
    } else {
      // Append a fresh procedural item to make deck infinite!
      const newItem = generateRandomProceduralItem(selectedLevelIdx, selectedLang);
      setActiveDeck(prev => [...prev, newItem]);
      setCurrentItemIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setAudioUrl(null);
    setActiveWordIdx(null);
    if (currentItemIdx > 0) {
      setCurrentItemIdx(prev => prev - 1);
    }
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

  const totalCompletedCount = Object.keys(completedItems).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-3 sm:px-6 pb-16">
      {/* ==============================================
          SCREEN 1: SETUP SCREEN (PREMIUM GLASS & LIGHT/DARK SYSTEM)
      ============================================== */}
      {screen === 'setup' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-indigo-900 to-slate-900 dark:from-violet-950 dark:via-slate-950 dark:to-indigo-950 text-white p-7 sm:p-10 shadow-2xl border border-purple-500/20">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-sky-500/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[11px] font-extrabold tracking-wider text-purple-200 uppercase shadow-sm">
                <FaFeatherAlt className="text-amber-300" />
                <span>Speech Therapy</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white drop-shadow-sm">
                Easy Onset Studio
              </h1>
              
              <p className="text-purple-100 dark:text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                Master smooth, confident speech through gentle initial syllable stretching.
              </p>
            </div>
          </div>

          {/* Setup Options Box */}
          <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl dark:shadow-2xl space-y-6 text-slate-900 dark:text-white transition-colors duration-200">
            
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest block">
                Select Level to Start
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRACTICE_DATA.map((lvl, idx) => (
                  <button
                    key={lvl.level}
                    onClick={() => startPracticeForLevel(idx)}
                    className="p-6 rounded-2xl text-left transition-all duration-300 border border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-gradient-to-br hover:from-purple-600 hover:to-indigo-600 dark:hover:from-purple-900/90 dark:hover:to-indigo-900/90 hover:border-purple-500 hover:text-white text-slate-800 dark:text-slate-200 shadow-md hover:shadow-2xl hover:shadow-purple-500/20 flex items-center justify-between group active:scale-[0.98] transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 group-hover:scale-110 transition-transform">
                        {lvl.icon}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-black text-base text-slate-900 dark:text-white group-hover:text-white transition-colors">
                            {lvl.title}
                          </h4>
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/20 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30">
                            {lvl.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium group-hover:text-purple-100 transition-colors mt-1">
                          {lvl.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-purple-600/10 dark:bg-white/10 group-hover:bg-white text-purple-600 dark:text-slate-200 group-hover:text-purple-700 flex items-center justify-center transition-all shrink-0 ml-3 shadow-sm">
                      <FaPlay size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==============================================
          SCREEN 2: PRACTICE FLOW (INFINITE DECK)
      ============================================== */}
      {screen === 'practice' && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          {/* Top Session Control Bar */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl text-slate-900 dark:text-white p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl dark:shadow-2xl flex items-center justify-between transition-colors">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScreen('setup')}
                className="text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 px-3.5 py-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800"
              >
                <FaArrowLeft /> Exit
              </button>
              <button
                onClick={() => {
                  setScreen('complete');
                  setIsTimerRunning(false);
                }}
                className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-white bg-amber-500/10 dark:bg-amber-950/60 hover:bg-amber-500/20 dark:hover:bg-amber-900/80 px-3.5 py-2 rounded-2xl transition-all border border-amber-500/20 dark:border-amber-800/60 flex items-center gap-1.5"
              >
                <FaTrophy size={11} /> Finish
              </button>
            </div>

            {/* Stopwatch Badge */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/90 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/80 font-mono text-sm font-black text-purple-600 dark:text-sky-400 shadow-inner">
              <FaClock className="text-purple-500 dark:text-sky-400 animate-pulse" />
              <span>{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</span>
            </div>

            {/* Progress Count (Infinite Deck) */}
            <div className="text-xs font-black text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 px-4 py-2 rounded-2xl border border-purple-200 dark:border-purple-800/60 shadow-sm flex items-center gap-1.5">
              <span>{currentItemIdx + 1}</span>
            </div>
          </div>

          {/* Main Practice Flashcard Container */}
          <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/90 rounded-[2.5rem] p-6 sm:p-12 shadow-2xl relative overflow-hidden text-slate-900 dark:text-white space-y-8 transition-colors">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Level Badge & In-Card Mini Language Toggle */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                  {currentLevel.badge}
                </span>

                {/* Mini Language Toggle Pill */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-full border border-slate-200 dark:border-slate-800 text-[10px] font-bold">
                  <button
                    onClick={() => handleToggleLanguage('en')}
                    className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                      selectedLang === 'en'
                        ? 'bg-purple-600 text-white shadow-sm font-black'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                  <button
                    onClick={() => handleToggleLanguage('hi')}
                    className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                      selectedLang === 'hi'
                        ? 'bg-purple-600 text-white shadow-sm font-black'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    🇮🇳 HI
                  </button>
                </div>
              </div>

              <button
                onClick={() => speakText(fullItemText, currentItem?.lang)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-900 transition-all border border-purple-200 dark:border-purple-700/60 shadow-sm"
              >
                <FaVolumeUp size={11} /> Listen
              </button>
            </div>

            {/* Syllable Stretching Display */}
            {currentItem && (
              <div className="py-4 flex flex-col items-center justify-center text-center space-y-4 relative z-10">
                
                <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                  {currentItem.words.map((w, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveWordIdx(idx);
                        speakText(w.stretched, currentItem.lang);
                      }}
                      className={`px-6 py-5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center text-center shadow-lg active:scale-95 min-w-[130px] ${
                        activeWordIdx === idx
                          ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 border-purple-400 text-white scale-105 shadow-2xl shadow-purple-600/40 ring-4 ring-purple-500/30'
                          : 'bg-slate-50 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-purple-400 dark:hover:border-purple-400'
                      }`}
                    >
                      {/* Main original word */}
                      <span className={`text-2xl sm:text-4xl font-display font-black tracking-tight ${activeWordIdx === idx ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {w.text}
                      </span>
                      {/* Stretched onset subtext below */}
                      <span className={`text-xs sm:text-sm font-mono font-bold tracking-wide mt-1.5 ${activeWordIdx === idx ? 'text-purple-100' : 'text-purple-600 dark:text-sky-300'}`}>
                        {w.stretched}
                      </span>
                    </button>
                  ))}
                </div>

                {currentItem.translation && (
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium italic">
                    "{currentItem.translation}"
                  </p>
                )}

                {/* Hint */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-medium max-w-md shadow-sm">
                  <FaLightbulb className="shrink-0 text-amber-500 dark:text-amber-400" size={12} />
                  <span>{currentItem.hint}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 relative z-10">
              <button
                onClick={handlePrev}
                disabled={currentItemIdx === 0}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <FaChevronLeft size={10} /> Prev
              </button>

              <button
                onClick={handleNext}
                className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-black text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all active:scale-95"
              >
                Next <FaChevronRight size={10} />
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
          <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-10 shadow-2xl space-y-5 max-w-lg mx-auto transition-colors">
            <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-amber-600 text-white rounded-full flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 mx-auto">
              <FaTrophy />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
                Session Complete!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Great job practicing easy onset speech therapy.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70">
              <div className="p-2">
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400 font-display block">
                  {totalCompletedCount}
                </span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Cards Practiced</span>
              </div>
              <div className="p-2">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-display block">
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Time Elapsed</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                onClick={() => startPracticeForLevel(selectedLevelIdx)}
                className="flex-1 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-display font-bold text-xs shadow-lg shadow-purple-600/25 transition-all"
              >
                Practice Again
              </button>
              <button
                onClick={() => setScreen('setup')}
                className="flex-1 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-display font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
              >
                Change Level
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EasyOnsetView;
