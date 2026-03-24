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
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 space-y-4"
    >
      {/* Search Box */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          🔍 Search Stories
        </label>
        <div className="relative">
          <FaSearch
            className="absolute left-3 top-3 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <FaTimes size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          📂 Category
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              selectedCategory === null
                ? "bg-purple-600 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onCategoryChange(cat.name)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                selectedCategory === cat.name
                  ? "bg-purple-600 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          ⭐ Difficulty
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onDifficultyChange(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              selectedDifficulty === null
                ? "bg-purple-600 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            All
          </button>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                selectedDifficulty === diff
                  ? getDifficultyColor(diff) + " ring-2 ring-purple-600"
                  : getDifficultyColor(diff) + " opacity-60 hover:opacity-100"
              }`}
            >
              {diff}
            </button>
          ))}
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
