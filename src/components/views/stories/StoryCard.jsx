import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const StoryCard = ({
  story,
  onSelect,
  onToggleStoryBookmark,
  isBookmarked,
}) => {
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      adventure: "🚀",
      drama: "🎭",
      inspiring: "✨",
      cultural: "🏛️",
      educational: "📚",
    };
    return emojiMap[category?.toLowerCase()] || "📖";
  };

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
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="relative bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer group"
      onClick={() => onSelect(story)}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-3 gap-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
              {story.title}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getDifficultyColor(
                story.difficulty,
              )}`}
            >
              {story.difficulty}
            </span>
          </div>

          {/* Category Badge */}
          {story.category && (
            <div className="mb-2">
              <span className="inline-block px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full">
                {getCategoryEmoji(story.category)} {story.category}
              </span>
            </div>
          )}

          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-3">
            {story.content?.substring(0, 150) ||
              story.excerpt ||
              "No preview available"}
            ...
          </p>
        </div>

        {/* Story Metadata */}
        <div className="mb-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
          {story.author && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">✍️</span>
              <span className="line-clamp-1">{story.author}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>📖 {story.wordCount || "N/A"} words</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⏱️ {story.duration || "15 mins"}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStoryBookmark(story.id);
            }}
            className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors z-10 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isBookmarked ? (
              <FaBookmark
                size={20}
                className="text-purple-600 dark:text-purple-400"
              />
            ) : (
              <FaRegBookmark size={20} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

StoryCard.propTypes = {
  story: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    difficulty: PropTypes.oneOf(["Easy", "Medium", "Hard"]).isRequired,
    excerpt: PropTypes.string.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  onToggleStoryBookmark: PropTypes.func.isRequired,
  isBookmarked: PropTypes.bool.isRequired,
};

export default StoryCard;
