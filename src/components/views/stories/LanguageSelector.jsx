import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

const LANGUAGES = [
  { code: "hi", label: "हिंदी (Hindi)", flag: "🇮🇳" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ta", label: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు (Telugu)", flag: "🇮🇳" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)", flag: "🇮🇳" },
  { code: "ml", label: "മലയാളം (Malayalam)", flag: "🇮🇳" },
];

const LanguageSelector = ({ onSelectLanguage, isLoading = false }) => {
  const [selectedLang, setSelectedLang] = useState(null);

  const handleSelect = async (langCode) => {
    setSelectedLang(langCode);
    await onSelectLanguage(langCode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Random 15-Minute Stories
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          Select your language
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {LANGUAGES.map((lang) => (
          <motion.button
            key={lang.code}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(lang.code)}
            disabled={isLoading || (selectedLang && selectedLang !== lang.code)}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
              selectedLang === lang.code
                ? "border-purple-600 bg-purple-50 dark:bg-purple-900/40 shadow-md"
                : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-500"
            } ${
              isLoading || (selectedLang && selectedLang !== lang.code)
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <span className="text-3xl">{lang.flag}</span>
            <span className="text-sm font-semibold">{lang.label}</span>
            {selectedLang === lang.code && isLoading && (
              <FaSpinner className="animate-spin text-purple-600 text-xs mt-1" />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default LanguageSelector;
