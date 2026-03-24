import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

// Primary languages shown initially
const PRIMARY_LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "hi", label: "हिंदी (Hindi)", flag: "🇮🇳" },
];

// All available languages (for future expansion)
const ALL_LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "hi", label: "हिंदी (Hindi)", flag: "🇮🇳" },
  { code: "es", label: "Español (Spanish)", flag: "🇪🇸" },
  { code: "fr", label: "Français (French)", flag: "🇫🇷" },
  { code: "de", label: "Deutsch (German)", flag: "🇩🇪" },
  { code: "it", label: "Italiano (Italian)", flag: "🇮🇹" },
  { code: "pt", label: "Português (Portuguese)", flag: "🇵🇹" },
  { code: "ja", label: "日本語 (Japanese)", flag: "🇯🇵" },
  { code: "zh", label: "中文 (Chinese)", flag: "🇨🇳" },
  { code: "ko", label: "한국어 (Korean)", flag: "🇰🇷" },
  { code: "ru", label: "Русский (Russian)", flag: "🇷🇺" },
  { code: "ar", label: "العربية (Arabic)", flag: "🇸🇦" },
  { code: "ta", label: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు (Telugu)", flag: "🇮🇳" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)", flag: "🇮🇳" },
  { code: "ml", label: "മലയാളം (Malayalam)", flag: "🇮🇳" },
  { code: "bn", label: "বাংলা (Bengali)", flag: "🇧🇩" },
  { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)", flag: "🇮🇳" },
  { code: "gu", label: "ગુજરાતી (Gujarati)", flag: "🇮🇳" },
  { code: "mr", label: "मराठी (Marathi)", flag: "🇮🇳" },
  { code: "th", label: "ไทย (Thai)", flag: "🇹🇭" },
  { code: "vi", label: "Tiếng Việt (Vietnamese)", flag: "🇻🇳" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "pl", label: "Polski (Polish)", flag: "🇵🇱" },
  { code: "tr", label: "Türkçe (Turkish)", flag: "🇹🇷" },
  { code: "nl", label: "Nederlands (Dutch)", flag: "🇳🇱" },
  { code: "sv", label: "Svenska (Swedish)", flag: "🇸🇪" },
  { code: "da", label: "Dansk (Danish)", flag: "🇩🇰" },
  { code: "fi", label: "Suomi (Finnish)", flag: "🇫🇮" },
  { code: "no", label: "Norsk (Norwegian)", flag: "🇳🇴" },
];

const LanguageSelector = ({ onSelectLanguage, isLoading = false }) => {
  const [selectedLang, setSelectedLang] = useState("");

  const handleSelect = async (langCode) => {
    setSelectedLang(langCode);
    await onSelectLanguage(langCode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          15-Minute Stories
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Select your language to get started
        </p>
      </div>

      <div className="flex gap-3">
        <select
          value={selectedLang}
          onChange={(e) => handleSelect(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select a language...</option>
          {PRIMARY_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.label}
            </option>
          ))}
        </select>

        {selectedLang && isLoading && (
          <FaSpinner className="animate-spin text-slate-400 text-2xl" />
        )}
      </div>
    </motion.div>
  );
};

export default LanguageSelector;
