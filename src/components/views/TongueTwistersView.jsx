import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay,
  FaStop,
  FaArrowLeft,
  FaMicrophone,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";

const TONGUE_TWISTERS = {
  hi: [
    {
      id: "h1",
      text: "कच्चा पापड़ पक्का पापड़",
      difficulty: "Easy",
      focus: "P/K Sounds",
    },
    {
      id: "h2",
      text: "चंदू के चाचा ने चंदू की चाची को चांदनी रात में चांदी की चम्मच से चटनी चटाई",
      difficulty: "Medium",
      focus: "Ch Sound",
    },
    {
      id: "h3",
      text: "चार कचरी कच्चे चाचा, चार कचरी पक्के",
      difficulty: "Medium",
      focus: "Ch/K Sounds",
    },
    {
      id: "h4",
      text: "टोला राम ताला तोल के तेल में तुल गया, तुला हुआ टोला ताले के तले हुए तेल में तला गया",
      difficulty: "Hard",
      focus: "T/L Alternation",
    },
    {
      id: "h5",
      text: "डाली डाली पे नज़र डाली, किसी ने अच्छी डाली, किसी ने बुरी डाली",
      difficulty: "Hard",
      focus: "D/L/Z Flow",
    },
  ],
  en: [
    {
      id: "e1",
      text: "I scream, you scream, we all scream for ice cream",
      difficulty: "Easy",
      focus: "S/Cr Sounds",
    },
    {
      id: "e2",
      text: "She sells seashells by the seashore",
      difficulty: "Medium",
      focus: "S/Sh Sounds",
    },
    {
      id: "e3",
      text: "Fuzzy Wuzzy was a bear, Fuzzy Wuzzy had no hair",
      difficulty: "Medium",
      focus: "F/Z/W Sounds",
    },
    {
      id: "e4",
      text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
      difficulty: "Hard",
      focus: "W/Ch Sounds",
    },
    {
      id: "e5",
      text: "Peter Piper picked a peck of pickled peppers",
      difficulty: "Hard",
      focus: "P Sounds",
    },
  ],
};

const TongueTwistersView = () => {
  const [language, setLanguage] = useState("en"); // 'en' or 'hi'
  const [selectedTwister, setSelectedTwister] = useState(TONGUE_TWISTERS.en[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
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
    // Standard reading speed (e.g. 150 WPM -> ~400ms per word)
    const msPerWord = 500;

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10 max-w-4xl mx-auto px-4 pt-6"
    >
      {/* HEADER */}
      <div className="w-full flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors btn-gamified"
        >
          <FaArrowLeft />
        </button>
      </div>

      <motion.div variants={itemVariants} className="text-center space-y-3 -mt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          Speech Therapy
        </div>
        <h2 className="text-4xl font-display font-extrabold text-slate-800 dark:text-white">
          Tongue Twisters
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-display">
          Improve your articulation, speed, and clarity.
        </p>
      </motion.div>

      {/* LANGUAGE SELECTOR */}
      <motion.div variants={itemVariants} className="flex justify-center gap-4">
        <button
          onClick={() => handleLanguageSwitch("en")}
          className={`px-6 py-2 rounded-full font-bold transition-all btn-gamified ${language === "en"
              ? "bg-blue-500 text-white"
              : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
            }`}
        >
          English
        </button>
        <button
          onClick={() => handleLanguageSwitch("hi")}
          className={`px-6 py-2 rounded-full font-bold transition-all btn-gamified ${language === "hi"
              ? "bg-purple-500 text-white"
              : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
            }`}
        >
          हिंदी (Hindi)
        </button>
      </motion.div>

      {/* SELECTOR */}
      <motion.div variants={itemVariants} className="flex overflow-x-auto gap-4 pb-4 px-1 snap-x scrollbar-hide">
        {TONGUE_TWISTERS[language].map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTwister(t)}
            className={`min-w-[160px] snap-center p-4 rounded-2xl border-b-4 text-left transition-all flex-shrink-0 ${selectedTwister.id === t.id
                ? "bg-white dark:bg-slate-800 border-blue-500 shadow-md"
                : "bg-slate-100 dark:bg-slate-800/60 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
          >
            <p className={`font-bold text-sm ${selectedTwister.id === t.id ? "text-blue-500" : "text-slate-500 dark:text-slate-400"
              }`}>
              {t.difficulty}
            </p>
            <p className="text-xs text-slate-400 mt-1">{t.focus}</p>
          </button>
        ))}
      </motion.div>

      {/* MAIN PLAYER */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-3xl border-b-4 border-slate-200 dark:border-slate-700 shadow-xl p-6 md:p-10 space-y-10">

        {/* WORD DISPLAY */}
        <div className="text-center min-h-[160px] flex items-center justify-center">
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-4 text-3xl md:text-5xl font-extrabold font-display leading-tight">
            {words.map((word, index) => (
              <span
                key={index}
                className={`transition-all duration-200 rounded-lg px-2 ${currentWordIndex === index
                    ? "text-blue-500 scale-110 bg-blue-50 dark:bg-blue-900/20"
                    : currentWordIndex > index || (!isPlaying && currentWordIndex === -1)
                      ? "text-slate-800 dark:text-white"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex justify-center gap-4 flex-wrap">
          {!isPlaying ? (
            <button
              onClick={startPlayback}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white rounded-2xl flex items-center gap-3 font-bold text-lg btn-gamified"
            >
              <FaPlay /> Read
            </button>
          ) : (
            <button
              onClick={stopPlayback}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white rounded-2xl flex items-center gap-3 font-bold text-lg btn-gamified"
            >
              <FaStop /> Stop
            </button>
          )}

          {!isListening ? (
            <button
              onClick={startListening}
              disabled={!supported}
              className="px-8 py-4 bg-purple-500 hover:bg-purple-400 active:bg-purple-600 text-white rounded-2xl flex items-center gap-3 font-bold text-lg btn-gamified disabled:opacity-50"
            >
              <FaMicrophone /> Speak
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="px-8 py-4 bg-rose-500 hover:bg-rose-400 active:bg-rose-600 text-white rounded-2xl flex items-center gap-3 font-bold text-lg btn-gamified"
            >
              <FaStop /> Stop
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TongueTwistersView;
