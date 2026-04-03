import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaStop, 
  FaTachometerAlt, 
  FaWaveSquare, 
  FaInfoCircle, 
  FaMicrophone, 
  FaCheckCircle,
  FaLungs
} from 'react-icons/fa';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

// Highly advanced therapeutic twisters focusing on specific phonetic blocks
const TONGUE_TWISTERS = [
  {
    id: 1,
    text: "पके पेड़ पर पका पपीता, पका पेड़ या पका पपीता। पके पेड़ को पकड़े पिंकू, पिंकू पकड़े पका पपीता।",
    difficulty: "Advanced",
    focus: "Bilabial Plosives (प, ब) - Lip control",
    syllables: ["प-के", "पे-ड़", "पर", "प-का", "प-पी-ता", "।", "प-का", "पे-ड़", "या", "प-का", "प-पी-ता", "।", "प-के", "पे-ड़", "को", "पक-ड़े", "पिं-कू", "।", "पिं-कू", "पक-ड़े", "प-का", "प-पी-ता", "।"]
  },
  {
    id: 2,
    text: "चार कचरी कच्चे चाचा, चार कचरी पक्के। पक्की कचरी कच्चे चाचा, कच्ची कचरी पक्के।",
    difficulty: "Advanced",
    focus: "Palatal Affricates (च, छ, ज) - Tongue placement",
    syllables: ["चार", "कच-री", "कच्-चे", "चा-चा", "।", "चार", "कच-री", "पक्-के", "।", "पक्-की", "कच-री", "कच्-चे", "चा-चा", "।", "कच्-ची", "कच-री", "पक्-के", "।"]
  },
  {
    id: 3,
    text: "खड़क सिंह के खड़कने से खड़कती हैं खिड़कियां, खिड़कियों के खड़कने से खड़कता है खड़क सिंह।",
    difficulty: "Expert",
    focus: "Velar Aspirates & Flaps (ख, ड़) - Throat and breath flow",
    syllables: ["ख-ड़क", "सिंह", "के", "ख-ड़क-ने", "से", "ख-ड़क-ती", "हैं", "खिड़-कि-यां", "।", "खिड़-कि-यों", "के", "ख-ड़क-ने", "से", "ख-ड़क-ता", "है", "ख-ड़क", "सिंह", "।"]
  },
  {
    id: 4,
    text: "मरहम की मरहम-पट्टी पर मरहम लगा है, पर मरहम की पट्टी पर मरहम नहीं।",
    difficulty: "Expert",
    focus: "Bilabial Nasals & Trills (म, र) - Continuous vocalization",
    syllables: ["मर-हम", "की", "मर-हम-पट्-टी", "पर", "मर-हम", "ल-गा", "है", "।", "पर", "मर-हम", "की", "पट्-टी", "पर", "मर-हम", "न-हीं", "।"]
  },
  {
    id: 5,
    text: "ऊँट ऊँचा, ऊँट की पीठ ऊँची, ऊँची पूँछ ऊँट की।",
    difficulty: "Master",
    focus: "Nasalized Vowels (ँ) - Velopharyngeal control",
    syllables: ["ऊँट", "ऊँ-चा", "।", "ऊँट", "की", "पीठ", "ऊँ-ची", "।", "ऊँ-ची", "पूँछ", "ऊँट", "की", "।"]
  }
];

const DIFFICULTY_COLORS = {
  Advanced: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700',
  Expert: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700',
  Master: 'bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-700'
};

const TongueTwistersView = () => {
  const [selectedTwister, setSelectedTwister] = useState(TONGUE_TWISTERS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  
  // Stammering therapy relies on prolonged, slow speech. Defaulting to 60 WPM.
  const [speedWPM, setSpeedWPM] = useState(60); 
  const [showSyllables, setShowSyllables] = useState(true); // Default to true for therapy

  const words = selectedTwister.text.split(' ');
  const timerRef = useRef(null);

  const { isListening, stopListening, startListening, compareToTarget, supported } = useSpeechRecognition('hi-IN');
  const pronunciationResults = compareToTarget(selectedTwister.text);

  useEffect(() => {
    stopPlayback();
    if (isListening) stopListening();
  }, [selectedTwister]);

  const startPlayback = () => {
    setIsPlaying(true);
    setCurrentWordIndex(0);
    
    // Calculate ms per word based on WPM
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
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleSpeedChange = (e) => {
    setSpeedWPM(Number(e.target.value));
    if (isPlaying) {
      stopPlayback();
      startPlayback();
    }
  };

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto px-4 font-sans">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="p-4 text-4xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-700 bg-clip-text text-transparent flex justify-center items-center gap-3">
          <FaWaveSquare className="text-teal-600" />
          Speech Fluency & Articulation Therapy
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
          Practice deliberate, syllable-timed reading to improve motor control, reduce vocal tension, and build fluency confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Clinical Selection */}
        <div className="xl:col-span-1 space-y-4">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <FaLungs className="text-teal-600" /> Select Articulation Target
          </h3>
          <div className="flex flex-col gap-3">
            {TONGUE_TWISTERS.map((twister) => (
              <button
                key={twister.id}
                onClick={() => setSelectedTwister(twister)}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                  selectedTwister.id === twister.id
                    ? 'bg-teal-50/50 border-teal-500 shadow-lg dark:bg-teal-900/20 dark:border-teal-500'
                    : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-md dark:bg-slate-800 dark:border-slate-700'
                }`}
              >
                <div className="flex flex-col mb-3 space-y-2">
                  <span className={`self-start text-xs px-3 py-1 rounded-full border font-bold uppercase tracking-wider ${DIFFICULTY_COLORS[twister.difficulty]}`}>
                    {twister.difficulty}
                  </span>
                  <span className="text-sm font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-md inline-block">
                    Focus: {twister.focus}
                  </span>
                </div>
                <p className={`line-clamp-2 leading-relaxed ${selectedTwister.id === twister.id ? 'text-slate-900 font-bold dark:text-white' : 'text-slate-600 dark:text-slate-400 font-medium'}`}>
                  {twister.text}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Therapy Player */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 lg:p-10 shadow-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden min-h-[500px] flex flex-col justify-between">
            
            <div className="absolute -top-10 -right-10 opacity-[0.03] text-teal-900">
              <FaWaveSquare size={300} />
            </div>

            <div className="relative z-10 flex-grow flex flex-col items-center justify-center py-10">
              {/* Display Words with Clinical Highlight */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 text-4xl lg:text-5xl font-extrabold leading-loose text-center">
                {pronunciationResults.length > 0 ? (
                   pronunciationResults.map((result, index) => (
                    <motion.span
                      key={`${index}-${result.word}`}
                      className={`transition-all duration-300 px-3 py-2 rounded-xl ${
                        currentWordIndex === index 
                          ? 'text-white bg-teal-600 shadow-xl transform scale-105' 
                          : result.isCorrect 
                            ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40 relative'
                            : isListening 
                              ? 'text-slate-300 dark:text-slate-600' 
                              : 'text-slate-800 dark:text-slate-200'
                       }`}
                    >
                      {result.word}
                      {result.isCorrect && !isPlaying && (
                         <div className="absolute -top-3 -right-3">
                           <FaCheckCircle className="text-emerald-500 text-xl bg-white rounded-full shadow-sm" />
                         </div>
                      )}
                    </motion.span>
                  ))
                ) : (
                  words.map((word, index) => (
                    <motion.span
                      key={`${index}-${word}`}
                      className={`transition-all duration-300 px-3 py-2 rounded-xl ${
                        currentWordIndex === index 
                          ? 'text-white bg-teal-600 shadow-xl transform scale-105' 
                          : currentWordIndex > index 
                            ? 'text-slate-800 dark:text-slate-200' 
                            : 'text-slate-300 dark:text-slate-600'
                      }`}
                    >
                      {word}
                    </motion.span>
                  ))
                )}
              </div>

              {/* Therapeutic Syllable Breakdown */}
              <AnimatePresence>
                {showSyllables && !isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-16 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 w-full shadow-inner"
                  >
                    <h4 className="text-slate-700 dark:text-slate-300 font-bold mb-6 flex items-center gap-2 text-lg">
                       <FaInfoCircle className="text-teal-500" /> Syllable-Timed Breakdown (मात्राएँ)
                       <span className="text-sm font-normal text-slate-500 ml-2">- Read one block per breath cycle</span>
                    </h4>
                    <div className="flex flex-wrap gap-4 text-xl font-mono">
                      {selectedTwister.syllables.map((syl, i) => (
                        <span key={i} className={`px-4 py-2 rounded-lg shadow-sm border font-semibold ${
                          syl === '।' || syl === ',' 
                          ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:border-rose-800' 
                          : 'bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600'
                        }`}>
                          {syl === '।' ? 'Pause / Breath' : syl}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clinical Controls */}
            <div className="relative z-10 mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                
                {/* Actions */}
                <div className="flex flex-wrap justify-center gap-4">
                  {!isPlaying ? (
                    <button
                      onClick={startPlayback}
                      className="px-8 py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
                    >
                      <FaPlay /> Guided Reading
                    </button>
                  ) : (
                    <button
                      onClick={stopPlayback}
                      className="px-8 py-4 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-white font-bold shadow transition-all flex items-center gap-3"
                    >
                      <FaStop /> Stop Guide
                    </button>
                  )}

                  {!isListening ? (
                     <button
                       onClick={() => {
                         if (isPlaying) stopPlayback();
                         startListening();
                       }}
                       disabled={!supported}
                       className="px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       <FaMicrophone /> Speech Check
                     </button>
                   ) : (
                     <button
                       onClick={stopListening}
                       className="px-8 py-4 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/50 dark:text-rose-300 font-bold shadow transition-all flex items-center gap-3"
                     >
                       <FaStop /> Stop Recording
                     </button>
                   )}

                  <button
                    onClick={() => setShowSyllables(!showSyllables)}
                    disabled={isPlaying || isListening}
                    className={`px-6 py-4 rounded-xl font-bold shadow-sm transition-all text-sm border ${
                      showSyllables 
                        ? 'bg-slate-800 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900' 
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300'
                    } ${(isPlaying || isListening) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {showSyllables ? 'Hide Structure' : 'View Structure'}
                  </button>
                </div>

                {/* Therapeutic Pace Control */}
                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm w-full lg:w-72">
                  <FaTachometerAlt className="text-teal-500 text-xl" />
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 font-bold mb-2">
                      <span>Pace: {speedWPM} WPM</span>
                      <span className="text-teal-600 dark:text-teal-400">
                        {speedWPM <= 80 ? 'Therapeutic' : speedWPM > 120 ? 'Fluency' : 'Standard'}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="40" 
                      max="160" 
                      step="10"
                      value={speedWPM} 
                      onChange={handleSpeedChange}
                      className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      title="Keep pace low (40-80 WPM) for stammering therapy"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TongueTwistersView;