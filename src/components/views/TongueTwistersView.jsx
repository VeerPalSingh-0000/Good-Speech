// src/components/views/TongueTwistersView.jsx - Ultra-Aesthetic Speech Therapy Tongue Twisters

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay,
  FaStop,
  FaArrowLeft,
  FaMicrophone,
  FaCheckCircle,
  FaLightbulb,
  FaClock,
  FaFeatherAlt,
  FaVolumeUp,
  FaCalendarAlt,
  FaStar,
  FaGlobe
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";

// Exact 5 English and 5 Hindi Tongue Twisters as recommended for speech therapy
const TONGUE_TWISTERS = {
  en: [
    {
      id: "e1",
      text: "Red lorry, yellow lorry.",
      title: "1. Red Lorry",
      difficulty: "Easy",
      focus: "R & L Coordination",
      tip: "Focus on smooth transitions between 'R' and 'L' without rushing."
    },
    {
      id: "e2",
      text: "She sells seashells by the seashore.",
      title: "2. Seashells",
      difficulty: "Medium",
      focus: "S & Sh Alternation",
      tip: "Relax lip and jaw movements when switching between 'S' and 'Sh'."
    },
    {
      id: "e3",
      text: "Peter Piper picked a peck of pickled peppers.",
      title: "3. Peter Piper",
      difficulty: "Medium",
      focus: "P Sound Light Contact",
      tip: "Use light articulatory contact on 'P' sounds to prevent hard vocal blocks."
    },
    {
      id: "e4",
      text: "A proper copper coffee pot.",
      title: "4. Coffee Pot",
      difficulty: "Hard",
      focus: "P, K & C Articulation",
      tip: "Keep airflow continuous across all words."
    },
    {
      id: "e5",
      text: "Unique New York, unique New York.",
      title: "5. Unique New York",
      difficulty: "Hard",
      focus: "N & Y Sound Precision",
      tip: "Start very slowly, focusing on low throat tension."
    },
  ],
  hi: [
    {
      id: "h1",
      text: "खड़क सिंह के खड़कने से खड़कती हैं खिड़कियाँ।",
      title: "1. खड़क सिंह",
      difficulty: "Medium",
      focus: "Kh & Khd Sounds",
      tip: "ख और ड़ ध्वनियों का अभ्यास बिना गले पर ज़ोर दिए करें।"
    },
    {
      id: "h2",
      text: "चंदू के चाचा ने चंदू की चाची को चाँदी के चम्मच से चटनी चटाई।",
      title: "2. चंदू के चाचा",
      difficulty: "Medium",
      focus: "Ch Sound Continuity",
      tip: "च ध्वनि पर हल्का स्पर्श रखें, झटके से न बोलें।"
    },
    {
      id: "h3",
      text: "ऊँट ऊँचा, ऊँट की पीठ ऊँची।",
      title: "3. ऊँट ऊँचा",
      difficulty: "Easy",
      focus: "Vowel & Ch Sound Flow",
      tip: "आसान ऑनसेट के साथ 'ऊँट' से शुरुआत करें।"
    },
    {
      id: "h4",
      text: "नंदू ने नंदिनी के नन्हे नन्हे नाखून नोंचे।",
      title: "4. नंदू ने नंदिनी",
      difficulty: "Hard",
      focus: "N Sound Agility",
      tip: "न ध्वनि का निकास सहज सांस के साथ करें।"
    },
    {
      id: "h5",
      text: "कच्चा पापड़, पक्का पापड़।",
      title: "5. कच्चा पापड़",
      difficulty: "Easy",
      focus: "K & P Alternation",
      tip: "धीमी, शांत और स्पष्ट गति से अभ्यास करें।"
    },
  ],
};

const TongueTwistersView = () => {
  const [language, setLanguage] = useState("en"); // 'en' or 'hi'
  const [selectedTwister, setSelectedTwister] = useState(TONGUE_TWISTERS.en[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false);
  const navigate = useNavigate();

  const words = selectedTwister.text.split(" ");
  const timerRef = useRef(null);

  const {
    isListening,
    stopListening,
    startListening,
    supported,
  } = useSpeechRecognition(language === "en" ? "en-US" : "hi-IN");

  useEffect(() => {
    stopPlayback();
    if (isListening) stopListening();
  }, [selectedTwister, language]);

  const handleLanguageSwitch = (lang) => {
    setLanguage(lang);
    setSelectedTwister(TONGUE_TWISTERS[lang][0]);
  };

  const startPlayback = () => {
    setIsPlaying(true);
    setCurrentWordIndex(0);
    // Slow & relaxed pace (~600ms per word) for stammering therapy
    const msPerWord = 600;

    timerRef.current = setInterval(() => {
      setCurrentWordIndex((prev) => {
        if (prev >= words.length - 1) {
          clearInterval(timerRef.current);
          setIsPlaying(false);
          return -1;
        }
        return prev + 1;
      });
    }, msPerWord);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentWordIndex(-1);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Text to speech audio playback
  const speakTwisterText = (text, lang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7; // Slow and clear pace
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto px-3 sm:px-6 pt-4 text-white">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-2 border border-slate-700/80 backdrop-blur-xl transition-all"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-400 text-xs font-black uppercase tracking-wider shadow-lg">
          <FaClock className="text-sky-400 animate-pulse" />
          <span>5 Mins / Day Agility Practice</span>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl border border-white/10 text-center space-y-4">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-xs font-black uppercase tracking-wider text-purple-300">
            <FaFeatherAlt className="text-amber-300 animate-bounce" />
            <span>Articulation & Speech Coordination</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-blue-200">
            Tongue Twisters
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            Practice 1–2 twisters for <span className="font-bold text-sky-400">5 minutes a day</span>. Focus strictly on <span className="font-bold text-emerald-400 underline decoration-emerald-500">slow, relaxed, and clear</span> speech.
          </p>
        </div>
      </div>

      {/* Clinical Golden Rules Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/40 rounded-[2rem] p-6 text-amber-200 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5 font-black text-sm uppercase tracking-wider text-amber-300">
            <FaLightbulb className="text-amber-400 text-lg shrink-0 animate-pulse" />
            <span>Golden Rule: Slow, Relaxed & Clear</span>
          </div>

          <button
            onClick={() => setShowWeeklyPlan(!showWeeklyPlan)}
            className="text-xs font-extrabold text-amber-300 hover:text-white underline flex items-center gap-1.5 transition-colors"
          >
            <FaCalendarAlt /> {showWeeklyPlan ? "Hide Weekly Plan" : "View Weekly Plan"}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          Tongue twisters help with articulation and coordination, but <span className="font-extrabold text-white underline decoration-amber-400">never try to say them as fast as possible</span>. If you feel tension or start forcing words, slow down immediately.
        </p>

        {/* Expandable Weekly Recommendation */}
        <AnimatePresence>
          {showWeeklyPlan && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-4 border-t border-amber-500/30 space-y-3 text-xs"
            >
              <span className="font-black text-amber-300 block uppercase tracking-wider text-[11px]">
                Recommended Weekly Progression (5 Mins/Day):
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-amber-500/30 space-y-1">
                  <span className="font-bold text-amber-400 block text-xs">Week 1:</span>
                  <p className="text-slate-300 text-[11px]">Say 1-2 twisters slowly 3 times each.</p>
                </div>
                <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-amber-500/30 space-y-1">
                  <span className="font-bold text-amber-400 block text-xs">Week 2:</span>
                  <p className="text-slate-300 text-[11px]">Repeat 5 times with relaxed, easy speech.</p>
                </div>
                <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-amber-500/30 space-y-1">
                  <span className="font-bold text-amber-400 block text-xs">Week 3+:</span>
                  <p className="text-slate-300 text-[11px]">Gradually increase speed while maintaining clarity & low tension.</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-200 text-[11px] font-semibold flex items-center gap-2">
                <span>💡</span>
                <span><strong className="text-white">Core Priority:</strong> Always prioritize <u>Easy Onset + Gentle Speech + Slow Reading + Real Conversation Practice</u> over tongue twisters.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Language Switcher */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleLanguageSwitch("en")}
          className={`px-7 py-3 rounded-2xl font-display font-black text-sm transition-all duration-300 border-2 flex items-center gap-2.5 ${
            language === "en"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400 text-white shadow-xl shadow-blue-600/40 scale-105"
              : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <span className="text-lg">🇬🇧</span>
          <span>English</span>
        </button>
        <button
          onClick={() => handleLanguageSwitch("hi")}
          className={`px-7 py-3 rounded-2xl font-display font-black text-sm transition-all duration-300 border-2 flex items-center gap-2.5 ${
            language === "hi"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400 text-white shadow-xl shadow-purple-600/40 scale-105"
              : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <span className="text-lg">🇮🇳</span>
          <span>हिंदी (Hindi)</span>
        </button>
      </div>

      {/* Twister Card Pills Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {TONGUE_TWISTERS[language].map((t) => {
          const isSelected = selectedTwister.id === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTwister(t)}
              className={`p-4 rounded-3xl border-2 text-left transition-all duration-300 flex flex-col justify-between space-y-3 ${
                isSelected
                  ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 border-blue-300 text-white shadow-xl shadow-blue-600/40 scale-[1.03]"
                  : "bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800/90 hover:border-slate-700"
              }`}
            >
              <div className="space-y-1">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}>
                  {t.difficulty}
                </span>
                
                {/* Fixed text colors so card title is always 100% visible */}
                <p className={`font-display font-extrabold text-sm leading-snug ${
                  isSelected ? "text-white" : "text-slate-100"
                }`}>
                  {t.title}
                </p>
              </div>

              <p className={`text-[10px] font-bold ${
                isSelected ? "text-blue-100" : "text-slate-400"
              }`}>
                {t.focus}
              </p>
            </button>
          );
        })}
      </div>

      {/* MAIN FLASHCARD PRACTICE DISPLAY */}
      <div className="bg-slate-900/95 border border-slate-800/90 rounded-[2.5rem] p-6 sm:p-12 shadow-2xl relative overflow-hidden text-white space-y-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Focus & Audio Button */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-sky-400">
              Focus: {selectedTwister.focus}
            </span>
          </div>

          <button
            onClick={() => speakTwisterText(selectedTwister.text, language)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/80 text-blue-300 text-xs font-extrabold hover:bg-blue-900 transition-all border border-blue-700/60 shadow-lg"
          >
            <FaVolumeUp /> Listen Audio
          </button>
        </div>

        {/* Practice Word Display */}
        <div className="text-center min-h-[180px] flex flex-col items-center justify-center py-4 relative z-10 space-y-6">
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-4 text-3xl sm:text-5xl font-extrabold font-display leading-tight text-white max-w-3xl">
            {words.map((word, index) => (
              <span
                key={index}
                className={`transition-all duration-200 rounded-2xl px-3 py-1 ${
                  currentWordIndex === index
                    ? "text-sky-300 scale-110 bg-sky-500/20 border-2 border-sky-400 shadow-xl shadow-sky-500/30"
                    : currentWordIndex > index || (!isPlaying && currentWordIndex === -1)
                    ? "text-white"
                    : "text-slate-600"
                }`}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Clinical Tip */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold max-w-xl shadow-md">
            <FaLightbulb className="shrink-0 text-amber-400" />
            <span>{selectedTwister.tip}</span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex justify-center gap-4 flex-wrap pt-6 border-t border-slate-800 relative z-10">
          {!isPlaying ? (
            <button
              onClick={startPlayback}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-display font-black text-base rounded-2xl shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-3"
            >
              <FaPlay /> Pace Reader
            </button>
          ) : (
            <button
              onClick={stopPlayback}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white font-display font-black text-base rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-3"
            >
              <FaStop /> Stop
            </button>
          )}

          {!isListening ? (
            <button
              onClick={startListening}
              disabled={!supported}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white font-display font-black text-base rounded-2xl shadow-xl shadow-purple-600/30 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
            >
              <FaMicrophone /> Practice Speaking
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-display font-black text-base rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-3"
            >
              <FaStop /> Stop Microphone
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TongueTwistersView;
