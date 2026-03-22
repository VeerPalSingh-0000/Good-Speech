import React, { useState, useEffect } from 'react';
import { generateQuickStory } from '../../../lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const loadingMessages = [
  "Consulting the AI muses...",
  "Building fascinating characters...",
  "Crafting the perfect plot...",
  "Choosing the best vocabulary...",
  "Weaving it all together...",
  "Polishing the final draft...",
];

export default function AIGenerator() {
  const [language, setLanguage] = useState('Hindi');
  const [story, setStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  // Cycle loading messages
  useEffect(() => {
    let msgInterval;
    if (isGenerating) {
      msgInterval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setLoadingMsgIdx(0);
    }
    return () => clearInterval(msgInterval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStory('');
    
    try {
      const newStory = await generateQuickStory(language);
      setStory(newStory);
      toast.success("Story generated successfully!");
    } catch (error) {
      toast.error("Oops! Couldn't generate the story.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Story Studio
        </h2>
        
        <div className="flex gap-3 items-center w-full sm:w-auto">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isGenerating}
            className="p-3 w-full sm:w-40 border-2 border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:opacity-50"
          >
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
            <option value="Marwari">Marwari</option>
            <option value="Tamil">Tamil</option>
            <option value="Telugu">Telugu</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Kannada">Kannada</option>
            <option value="Marathi">Marathi</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Bengali">Bengali</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
          
          <button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all active:scale-95 hover:shadow-xl hover:shadow-purple-500/40 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              '✨ Generate Magic'
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-sm font-semibold text-purple-600 dark:text-purple-400">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={loadingMsgIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {loadingMessages[loadingMsgIdx]}
                  </motion.span>
                </AnimatePresence>
                <div className="flex gap-1">
                  <span className="animate-bounce delay-75">✨</span>
                  <span className="animate-bounce delay-150">✨</span>
                  <span className="animate-bounce delay-300">✨</span>
                </div>
              </div>
              <div className="space-y-3 relative overflow-hidden animate-pulse mt-4">
                {/* Skeleton Paragraphs */}
                <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded-full w-3/4"></div>
                <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded-full w-full"></div>
                <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded-full w-5/6"></div>
                <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded-full w-full"></div>
                <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded-full w-2/3"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {story && !isGenerating && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-8 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner"
        >
          <p className="whitespace-pre-wrap leading-loose text-lg text-slate-700 dark:text-slate-300 font-medium">
            {story}
          </p>
        </motion.div>
      )}
    </div>
  );
}
