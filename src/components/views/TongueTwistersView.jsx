import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay,
  FaStop,
  FaTachometerAlt,
  FaWaveSquare,
  FaMicrophone,
  FaCheckCircle,
  FaLungs,
} from "react-icons/fa";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";

/* =========================
   THERAPEUTIC TWISTERS
========================= */
const TONGUE_TWISTERS = [
  {
    id: 1,
    text: "हमने नया नमक नमकीन में नम्रता से मिलाया।",
    difficulty: "Beginner",
    focus: "Breath Flow (ह, म, न)",
    syllables: [
      "Inhale",
      "हम-ने",
      "न-या",
      "न-मक",
      "न-म-कीन",
      "में",
      "न-म्र-ता",
      "से",
      "मि-ला-या",
      "Pause",
    ],
  },
  {
    id: 2,
    text: "बबलू ने बड़े बर्तन में पानी भरकर बाहर रखा।",
    difficulty: "Intermediate",
    focus: "Lip Control (प, ब)",
    syllables: [
      "Inhale",
      "ब-ब-लू",
      "ने",
      "ब-ड़े",
      "बर-तन",
      "में",
      "पा-नी",
      "भर-कर",
      "बा-हर",
      "र-खा",
      "Pause",
    ],
  },
  {
    id: 3,
    text: "टूटे ताले के पीछे ठंडी टोकरी टिकी थी।",
    difficulty: "Advanced",
    focus: "Tongue Curl (ट, ठ)",
    syllables: [
      "Inhale",
      "टू-टे",
      "ता-ले",
      "के",
      "पी-छे",
      "ठं-डी",
      "टो-क-री",
      "टि-की",
      "थी",
      "Pause",
    ],
  },
  {
    id: 4,
    text: "सात सुथरी सीपियाँ समुद्र से सुरक्षित संग लाई गईं।",
    difficulty: "Expert",
    focus: "Airflow Control (स, श)",
    syllables: [
      "Inhale",
      "सात",
      "सु-थ-री",
      "सी-पि-याँ",
      "स-मु-द्र",
      "से",
      "सु-र-क्षि-त",
      "संग",
      "ला-ई",
      "ग-ईं",
      "Pause",
    ],
  },
  {
    id: 5,
    text: "कच्चे केले के कटोरे में कड़क काजू करारे रखे हैं।",
    difficulty: "Master",
    focus: "Full Coordination",
    syllables: [
      "Inhale",
      "कच्-चे",
      "के-ले",
      "के",
      "क-टो-रे",
      "में",
      "क-ड़क",
      "का-जू",
      "क-रा-रे",
      "र-खे",
      "हैं",
      "Pause",
    ],
  },
];

const TongueTwistersView = () => {
  const [selectedTwister, setSelectedTwister] = useState(TONGUE_TWISTERS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [speedWPM, setSpeedWPM] = useState(60);
  const [showSyllables, setShowSyllables] = useState(true);

  const words = selectedTwister.text.split(" ");
  const timerRef = useRef(null);

  const {
    isListening,
    stopListening,
    startListening,
    compareToTarget,
    supported,
  } = useSpeechRecognition("hi-IN");

  const pronunciationResults = compareToTarget(selectedTwister.text);

  useEffect(() => {
    stopPlayback();
    if (isListening) stopListening();
  }, [selectedTwister]);

  const startPlayback = () => {
    setIsPlaying(true);
    setCurrentWordIndex(0);

    const msPerWord = Math.floor(60000 / speedWPM);

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 text-gray-100">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-4xl font-extrabold text-teal-400 flex justify-center items-center gap-2">
          <FaWaveSquare /> Speech Therapy
        </h2>
        <p className="text-sm text-gray-400">Slow. Controlled. Confident.</p>
      </div>

      {/* SELECTOR */}
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {TONGUE_TWISTERS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTwister(t)}
            className={`min-w-[220px] p-4 rounded-xl border text-left transition-colors ${
              selectedTwister.id === t.id
                ? "bg-teal-900/40 border-teal-500 text-teal-300"
                : "bg-gray-800/60 border-gray-700 hover:bg-gray-700/80"
            }`}
          >
            <p className="font-bold text-sm text-gray-100">{t.difficulty}</p>
            <p className="text-xs text-teal-400 mt-1">{t.focus}</p>
          </button>
        ))}
      </div>

      {/* MAIN PLAYER */}
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-xl p-6 space-y-6">
        {/* WORD DISPLAY */}
        <div className="text-center leading-[3.5rem] tracking-wide">
          <div className="flex flex-wrap justify-center gap-3 text-3xl md:text-5xl font-bold">
            {words.map((word, index) => (
              <motion.span
                key={index}
                className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                  currentWordIndex === index
                    ? "bg-teal-500 text-white scale-110 shadow-[0_0_15px_rgba(20,184,166,0.4)]"
                    : currentWordIndex > index
                      ? "text-gray-100"
                      : "text-gray-600"
                }`}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>

        {/* SYLLABLES */}
        <AnimatePresence>
          {showSyllables && !isPlaying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-900/50 border border-gray-700/50 p-4 rounded-xl overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 justify-center text-sm font-mono">
                {selectedTwister.syllables.map((s, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-lg border ${
                      s === "Inhale"
                        ? "bg-blue-900/30 border-blue-800/50 text-blue-300 focus:outline-none"
                        : s === "Pause"
                          ? "bg-red-900/30 border-red-800/50 text-red-300"
                          : "bg-gray-800 border-gray-700 text-gray-300"
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTROLS */}
        <div className="flex flex-col gap-5 pt-2">
          <div className="flex justify-center gap-3 flex-wrap">
            {!isPlaying ? (
              <button
                onClick={startPlayback}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-500 transition-colors text-white rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-teal-900/20"
              >
                <FaPlay /> Start
              </button>
            ) : (
              <button
                onClick={stopPlayback}
                className="px-6 py-3 bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors rounded-xl flex items-center gap-2 font-medium"
              >
                <FaStop /> Stop
              </button>
            )}

            {!isListening ? (
              <button
                onClick={startListening}
                disabled={!supported}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 transition-colors text-white rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaMicrophone /> Speak
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="px-6 py-3 bg-red-900/40 border border-red-800/50 text-red-400 hover:bg-red-900/60 transition-colors rounded-xl font-medium flex items-center gap-2"
              >
                <FaStop /> Stop
              </button>
            )}

            <button
              onClick={() => setShowSyllables(!showSyllables)}
              className="px-6 py-3 border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-xl font-medium"
            >
              Structure
            </button>
          </div>

          {/* SPEED */}
          <div className="flex items-center justify-center gap-4 bg-gray-900/30 p-4 rounded-xl border border-gray-700/30">
            <FaTachometerAlt className="text-teal-400 text-lg" />
            <input
              type="range"
              min="40"
              max="140"
              value={speedWPM}
              onChange={(e) => setSpeedWPM(e.target.value)}
              className="w-full max-w-xs accent-teal-500"
            />
            <span className="text-sm font-medium text-gray-300 w-16 text-right">
              {speedWPM} WPM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TongueTwistersView;
