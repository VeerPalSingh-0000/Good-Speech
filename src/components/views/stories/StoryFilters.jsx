import React from "react";
import PropTypes from "prop-types";
import { FaSearch, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const StoryFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  categories,
}) => {
  const difficulties = ["Easy", "Medium", "Hard"];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/60";
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60";
      case "Hard":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/60";
      default:
        return "";
    }
  };

  const getDifficultyActiveColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900";
      case "Medium": return "bg-amber-500 text-white shadow-md shadow-amber-500/20 ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-slate-900";
      case "Hard": return "bg-rose-500 text-white shadow-md shadow-rose-500/20 ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-slate-900";
      default: return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/60 dark:border-slate-700/60 space-y-6"
    >
      {/* Search Box */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <FaSearch className="text-purple-500" /> Search Stories
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-slate-400 group-focus-within:text-purple-500 transition-colors" size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by title, author, or keywords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <FaTimes size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          📁 Category
        </label>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              selectedCategory === null
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 scale-105"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onCategoryChange(cat.name)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedCategory === cat.name
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 scale-105"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat.name} <span className="opacity-70 ml-1">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          ⭐ Difficulty
        </label>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onDifficultyChange(null)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              selectedDifficulty === null
                ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md scale-105"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All Levels
          </button>
          {difficulties.map((diff) => {
            const isSelected = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => onDifficultyChange(diff)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isSelected ? getDifficultyActiveColor(diff) + " scale-105" : getDifficultyColor(diff) + " border border-transparent"
                }`}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

StoryFilters.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func.isRequired,
  selectedDifficulty: PropTypes.string,
  onDifficultyChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default StoryFilters;
