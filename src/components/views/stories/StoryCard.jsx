import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const StoryCard = ({
  story,
  onSelect,
  onToggleStoryBookmark,
  isBookmarked,
}) => (
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
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {story.title}
          </h3>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              story.difficulty === "Easy"
                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                : story.difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
            }`}
          >
            {story.difficulty}
          </span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-4">
          {story.excerpt}
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end items-center">
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
