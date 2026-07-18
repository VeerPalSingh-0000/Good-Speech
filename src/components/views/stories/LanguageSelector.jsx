import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

const LanguageSelector = ({ onSelectLanguage, isLoading = false }) => {
  const [selectedLang, setSelectedLang] = useState("");

  const handleSelect = async (langCode) => {
    if (isLoading) return;
    setSelectedLang(langCode);
    await onSelectLanguage(langCode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Discover a Random Story
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Select your language for a 15-minute guided reading experience
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* English Card */}
        <button
          onClick={() => handleSelect("en")}
          disabled={isLoading}
          className="relative overflow-hidden group flex flex-row sm:flex-col items-center justify-start sm:justify-center p-5 sm:p-8 gap-4 sm:gap-0 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-800 rounded-3xl text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed border border-white/10 text-left sm:text-center"
        >
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 sm:-mr-10 sm:-mt-10 group-hover:bg-white/20 transition-colors"></div>
          <span className="text-4xl sm:text-5xl sm:mb-4 group-hover:-translate-y-1 transition-transform duration-300 drop-shadow-md">🇺🇸</span>
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">English</h3>
            <p className="text-blue-100/90 text-xs sm:text-sm mt-1 sm:mt-2 font-medium">Random 15-min classic</p>
          </div>
          
          {isLoading && selectedLang === "en" && (
            <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[2px] flex items-center justify-center">
              <FaSpinner className="animate-spin text-3xl sm:text-4xl text-white drop-shadow-lg" />
            </div>
          )}
        </button>

        {/* Hindi Card */}
        <button
          onClick={() => handleSelect("hi")}
          disabled={isLoading}
          className="relative overflow-hidden group flex flex-row sm:flex-col items-center justify-start sm:justify-center p-5 sm:p-8 gap-4 sm:gap-0 bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-700 rounded-3xl text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/20 active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed border border-white/10 text-left sm:text-center"
        >
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 sm:-mr-10 sm:-mt-10 group-hover:bg-white/20 transition-colors"></div>
          <span className="text-4xl sm:text-5xl sm:mb-4 group-hover:-translate-y-1 transition-transform duration-300 drop-shadow-md">🇮🇳</span>
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">हिंदी (Hindi)</h3>
            <p className="text-orange-100/90 text-xs sm:text-sm mt-1 sm:mt-2 font-medium">१५ मिनट की कहानी</p>
          </div>
          
          {isLoading && selectedLang === "hi" && (
            <div className="absolute inset-0 bg-orange-900/40 backdrop-blur-[2px] flex items-center justify-center">
              <FaSpinner className="animate-spin text-3xl sm:text-4xl text-white drop-shadow-lg" />
            </div>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default LanguageSelector;
