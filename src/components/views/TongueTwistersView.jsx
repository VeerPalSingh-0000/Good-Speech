import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaStop, FaTachometerAlt, FaLayerGroup, FaInfoCircle, FaMicrophone, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

const TONGUE_TWISTERS = [
  {
    id: 1,
    text: "कच्चा पापड़ पक्का पापड़",
    difficulty: "Easy",
    syllables: ["कच्-चा", "पा-पड़", "पक्-का", "पा-पड़"]
  },
  {
    id: 2,
    text: "समझ समझ के समझ को समझो , समझ समझना भी एक समझ है",
    difficulty: "Medium",
    syllables: ["स-मझ", "स-मझ", "के", "स-मझ", "को", "सम-झो", ",", "स-मझ", "स-मझ-ना", "भी", "एक", "स-मझ", "है"]
  },
  {
    id: 3,
    text: "खड़क सिंह के खड़कने से खड़कती हैं खिड़कियां",
    difficulty: "Hard",
    syllables: ["ख-ड़क", "सिंह", "के", "ख-ड़क-ने", "से", "ख-ड़क-ती", "हैं", "खिड़-कि-यां"]
  },
  {
    id: 4,
    text: "पीतल के पतीले में पपीता पीला पीला",
    difficulty: "Expert",
    syllables: ["पी-तल", "के", "प-ती-ले", "में", "प-पी-ता", "पी-ला", "पी-ला"]
  },
  {
    id: 5,
    text: "चंदू के चाचा ने चंदू की चाची को चांदनी चौक में चांदी के चम्मच से चटनी चटाई",
    difficulty: "Expert",
    syllables: ["चं-दू", "के", "चा-चा", "ने", "चं-दू", "की", "चा-ची", "को", "चांद-नी", "चौक", "में", "चां-दी", "के", "चम्-मच", "से", "चट-नी", "च-टा-ई"]
  }
];

const DIFFICULTY_COLORS = {
  Easy: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
  Medium: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
  Hard: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700',
  Expert: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700'
};

const TongueTwistersView = () => {
  const [selectedTwister, setSelectedTwister] = useState(TONGUE_TWISTERS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [speedWPM, setSpeedWPM] = useState(120); // Words Per Minute
  const [showSyllables, setShowSyllables] = useState(false);

  const words = selectedTwister.text.split(' ');
  const timerRef = useRef(null);

  const { isListening, stopListening, startListening, compareToTarget, supported } = useSpeechRecognition('hi-IN');
  const pronunciationResults = compareToTarget(selectedTwister.text);

  // Stop playback when unmounting or selecting a new twister
  useEffect(() => {
    stopPlayback();
    if (isListening) stopListening();
  }, [selectedTwister]);

  const startPlayback = () => {
    setIsPlaying(true);
    setCurrentWordIndex(0);
    
    // Calculate ms per word based on WPM
    // WPM = words / minute -> MS_PER_WORD = 60000 / WPM
    const msPerWord = Math.floor(60000 / speedWPM);

    timerRef.current = setInterval(() => {
      setCurrentWordIndex((prev) => {
        if (prev >= words.length - 1) {
          clearInterval(timerRef.current);
          setIsPlaying(false);
          return -1; // Reset
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
      // Restart interval with new speed
      stopPlayback();
      startPlayback();
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center">
        <h2 className="p-4 text-4xl font-bold bg-gradient-to-r from-orange-500 to-rose-600 bg-clip-text text-transparent flex justify-center items-center gap-3">
          <FaLayerGroup className="text-orange-500" />
          जीभ तोड़ वाक्य (Tongue Twisters)
        </h2>
        <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
          Improve articulation, pacing, and clear speech through word-by-word focused reading.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: List of Twisters */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">Select a Twister</h3>
          <div className="flex flex-col gap-3">
            {TONGUE_TWISTERS.map((twister) => (
              <button
                key={twister.id}
                onClick={() => setSelectedTwister(twister)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedTwister.id === twister.id
                    ? 'bg-orange-50 border-orange-400 shadow-md dark:bg-orange-900/20 dark:border-orange-500'
                    : 'bg-white border-slate-200 hover:border-orange-300 dark:bg-slate-800 dark:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${DIFFICULTY_COLORS[twister.difficulty]}`}>
                    {twister.difficulty}
                  </span>
                </div>
                <p className={`line-clamp-2 ${selectedTwister.id === twister.id ? 'text-slate-900 font-semibold dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                  {twister.text}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Player & Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 relative overflow-hidden min-h-[400px] flex flex-col justify-between">
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <FaLayerGroup text-9xl />
            </div>

            <div className="relative z-10 flex-grow flex flex-col items-center justify-center">
              {/* Display Words with Highlight */}
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-6 text-3xl md:text-5xl font-bold leading-normal">
                {pronunciationResults.length > 0 ? (
                   // Render Pronunciation check results (mapped from target text)
                   pronunciationResults.map((result, index) => (
                    <motion.span
                      key={`${index}-${result.word}`}
                      className={`transition-colors duration-200 px-2 py-1 rounded-lg ${
                        currentWordIndex === index 
                          ? 'text-white bg-gradient-to-r from-orange-500 to-rose-500 shadow-lg transform scale-110' 
                          : result.isCorrect 
                            ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 relative'
                            : isListening 
                              ? 'text-slate-400 dark:text-slate-500' // Pending
                              : 'text-slate-800 dark:text-slate-200' // Default
                       }`}
                    >
                      {result.word}
                      {result.isCorrect && !isPlaying && (
                         <div className="absolute -top-3 -right-3">
                           <FaCheckCircle className="text-emerald-500 text-lg bg-white rounded-full" />
                         </div>
                      )}
                    </motion.span>
                  ))
                ) : (
                  // Fallback if useSpeechRecognition targets fail
                  words.map((word, index) => (
                    <motion.span
                      key={`${index}-${word}`}
                      className={`transition-colors duration-200 px-2 py-1 rounded-lg ${
                        currentWordIndex === index 
                          ? 'text-white bg-gradient-to-r from-orange-500 to-rose-500 shadow-lg transform scale-110' 
                          : currentWordIndex > index 
                            ? 'text-slate-800 dark:text-slate-200' 
                            : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {word}
                    </motion.span>
                  ))
                )}
              </div>

              {/* Syllable Breakdown View */}
              <AnimatePresence>
                {showSyllables && !isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-12 bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800 w-full"
                  >
                    <h4 className="text-indigo-800 dark:text-indigo-300 font-bold mb-4 flex items-center gap-2">
                       <FaInfoCircle /> Syllable Breakdown (मात्राएँ)
                    </h4>
                    <div className="flex flex-wrap gap-3 text-lg font-mono">
                      {selectedTwister.syllables.map((syl, i) => (
                        <span key={i} className="px-3 py-1 bg-white dark:bg-slate-800 rounded shadow-sm text-indigo-700 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-700/50">
                          {syl}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls Section */}
            <div className="relative z-10 mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                
                {/* Play/Stop Button */}
                <div className="flex gap-4">
                  {!isPlaying ? (
                    <button
                      onClick={startPlayback}
                      className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-3 transform hover:scale-105"
                    >
                      <FaPlay /> Read Aloud
                    </button>
                  ) : (
                    <button
                      onClick={stopPlayback}
                      className="px-8 py-3 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/50 dark:text-rose-300 font-bold shadow transition-all flex items-center gap-3"
                    >
                      <FaStop /> Stop
                    </button>
                  )}

                  {!isListening ? (
                     <button
                       onClick={() => {
                         if (isPlaying) stopPlayback();
                         startListening();
                       }}
                       disabled={!supported}
                       className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-3 transform hover:scale-105 disabled:opacity-50"
                       title={!supported ? "Speech recognition not supported in this browser" : "Practice aloud!"}
                     >
                       <FaMicrophone /> Speak Now
                     </button>
                   ) : (
                     <button
                       onClick={stopListening}
                       className="px-6 py-3 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/50 dark:text-rose-300 font-bold shadow transition-all flex items-center gap-3"
                     >
                       <FaStop /> Stop Listening
                     </button>
                   )}

                  {/* Toggle Syllable Breakdown */}
                  <button
                    onClick={() => setShowSyllables(!showSyllables)}
                    disabled={isPlaying || isListening}
                    className={`px-6 py-3 rounded-full font-bold shadow transition-all text-sm border ${
                      showSyllables 
                        ? 'bg-indigo-500 text-white border-indigo-600' 
                        : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:bg-slate-800 dark:border-slate-700 dark:text-indigo-400'
                    } ${(isPlaying || isListening) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {showSyllables ? 'Hide Syllables' : 'Show Syllables'}
                  </button>
                </div>

                {/* Speed Control */}
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
                  <FaTachometerAlt className="text-slate-400" />
                  <div className="flex flex-col w-full sm:w-48">
                    <div className="flex justify-between text-xs text-slate-500 font-bold mb-1">
                      <span>Pace: {speedWPM} WPM</span>
                      <span>{speedWPM < 100 ? 'Slow' : speedWPM > 180 ? 'Fast' : 'Normal'}</span>
                    </div>
                    <input 
                      type="range" 
                      min="60" 
                      max="240" 
                      step="10"
                      value={speedWPM} 
                      onChange={handleSpeedChange}
                      className="w-full accent-orange-500"
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
