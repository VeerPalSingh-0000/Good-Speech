import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaBookmark, FaRegBookmark, FaClock, FaBookOpen, FaFeatherAlt } from "react-icons/fa";

const StoryCard = ({
  story,
  onSelect,
  onToggleStoryBookmark,
  isBookmarked,
}) => {
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "adventure": return "🚀";
      case "drama": return "🎭";
      case "inspiring": return "✨";
      case "cultural": return "🏛️";
      case "educational": return "📚";
      case "harry potter": return "⚡";
      case "hindi classics": return "👑";
      default: return "📖";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50";
      case "Medium": return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50";
      case "Hard": return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden border border-slate-200/60 dark:border-slate-700/60 cursor-pointer group flex flex-col h-full"
      onClick={() => onSelect(story)}
    >
      {/* Top Gradient Accents based on difficulty */}
      <div className={`h-1.5 w-full ${story.difficulty === 'Easy' ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : story.difficulty === 'Medium' ? 'bg-gradient-to-r from-amber-400 to-orange-400' : story.difficulty === 'Hard' ? 'bg-gradient-to-r from-rose-400 to-pink-400' : 'bg-gradient-to-r from-slate-400 to-slate-500'}`} />

      <div className="p-5 sm:p-7 flex flex-col flex-grow relative z-10">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-3 sm:mb-4 gap-3">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-500 dark:group-hover:from-purple-400 dark:group-hover:to-indigo-300 transition-all line-clamp-2 leading-tight">
              {story.title}
            </h3>
            <span
              className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold rounded-full border ${getDifficultyColor(story.difficulty)} whitespace-nowrap shadow-sm shrink-0 mt-1`}
            >
              {story.difficulty}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
            {story.category && (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700 shadow-inner">
                <span>{getCategoryIcon(story.category)}</span> {story.category}
              </span>
            )}
            {story.author && (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-[11px] sm:text-xs font-semibold rounded-full border border-purple-100 dark:border-purple-800/50">
                <FaFeatherAlt size={10} /> <span className="line-clamp-1 max-w-[100px] sm:max-w-[120px]">{story.author}</span>
              </span>
            )}
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4 sm:mb-6 relative">
            {story.content?.substring(0, 150) || story.excerpt || "No preview available"}...
          </p>
        </div>

        {/* Footer Meta & Actions */}
        <div className="pt-3 sm:pt-5 mt-auto border-t border-slate-200/80 dark:border-slate-700/80 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 -mx-5 sm:-mx-7 -mb-5 sm:-mb-7 px-5 sm:px-7 py-3 sm:py-4">
          <div className="flex items-center gap-5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              <FaBookOpen className="opacity-70" /> {story.wordCount || "---"} wds
            </div>
            <div className="flex items-center gap-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              <FaClock className="opacity-70" /> {story.duration || "--"}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStoryBookmark(story.id);
            }}
            className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all z-10 p-2.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:scale-110 active:scale-95"
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isBookmarked ? (
              <FaBookmark size={20} className="text-purple-600 dark:text-purple-400 drop-shadow-md" />
            ) : (
              <FaRegBookmark size={20} />
            )}
          </button>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors pointer-events-none"></div>
    </motion.div>
  );
};

StoryCard.propTypes = {
  story: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    difficulty: PropTypes.oneOf(["Easy", "Medium", "Hard"]).isRequired,
    excerpt: PropTypes.string,
    content: PropTypes.string,
    category: PropTypes.string,
    author: PropTypes.string,
    wordCount: PropTypes.number,
    duration: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  onToggleStoryBookmark: PropTypes.func.isRequired,
  isBookmarked: PropTypes.bool.isRequired,
};

export default StoryCard;
