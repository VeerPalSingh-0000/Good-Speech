// src/features/hindi/components/views/StoriesView.jsx

import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay,
  FaPause,
  FaSave,
  FaRedo,
  FaBookmark,
  FaRegBookmark,
  FaBookOpen,
  FaFlag,
  FaFolder,
  FaArrowLeft,
  FaHatWizard,
  FaScroll,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import harryPotterImg from "../../assets/hp.jpg";

// A utility to format time from deciseconds to MM:SS.ss format
const formatTime = (deciseconds) => {
  const totalSeconds = deciseconds / 10;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toFixed(2);
  return `${minutes.toString().padStart(2, "0")}:${seconds.padStart(5, "0")}`;
};

// A stylish, reusable button component
const AnimatedButton = ({ children, icon, className = "", ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {icon}
    <span>{children}</span>
  </motion.button>
);

AnimatedButton.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.element,
  className: PropTypes.string,
};

const CategoryCard = ({ category, count, onSelect }) => {
  const getIcon = () => {
    if (category === "Harry Potter") {
      return (
        <img
          src={harryPotterImg}
          alt="Harry Potter"
          className="w-24 h-24 object-cover rounded-full border-2 border-purple-200"
        />
      );
    }
    if (category === "Hindi Folktales") {
      return (
        <FaScroll size={64} className="text-orange-500 dark:text-orange-400" />
      );
    }
    return <FaFolder size={64} className="text-yellow-400" />;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(category)}
      className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-purple-100 dark:border-slate-700 cursor-pointer group p-8 flex flex-col items-center justify-center gap-4"
    >
      <div
        className={`p-4 bg-white dark:bg-slate-700 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300 ${category === "Harry Potter" ? "p-1" : ""}`}
      >
        {getIcon()}
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {category}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {count} Stories
        </p>
      </div>
    </motion.div>
  );
};

CategoryCard.propTypes = {
  category: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};

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

const StoryDisplayModal = ({
  story,
  onClose,
  lineBookmarks,
  onToggleLineBookmark,
}) => {
  const [pageInput, setPageInput] = useState("");
  // Determine initial PDF source
  const [pdfSrc, setPdfSrc] = useState(story.pdfUrl);

  // Sync pdfSrc if story changes
  React.useEffect(() => {
    setPdfSrc(story.pdfUrl);
  }, [story.pdfUrl]);

  const storyLines = useMemo(
    () =>
      story.content
        ? story.content.split("\n").filter((line) => line.trim() !== "")
        : [],
    [story.content],
  );

  const handleAddPageBookmark = () => {
    const page = parseInt(pageInput);
    if (page && page > 0) {
      onToggleLineBookmark(story.id, page);
      setPageInput("");
    }
  };

  const handleJumpToPage = (page) => {
    // Force iframe reload or hash update by setting src
    setPdfSrc(`${story.pdfUrl}#page=${page}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-700 h-[85vh]"
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white truncate pr-4">
            {story.title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-red-500 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-slate-900 flex flex-col">
          {story.pdfUrl ? (
            <>
              {/* PDF Toolbar */}
              <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                <span className="text-sm font-semibold whitespace-nowrap dark:text-slate-300">
                  Page Bookmarks:
                </span>
                <input
                  type="number"
                  min="1"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  placeholder="page no."
                  className="w-20 px-1 py-1 text-sm border rounded bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleAddPageBookmark}
                  className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 whitespace-nowrap font-medium"
                >
                  Add
                </button>
                <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2"></div>
                <div className="flex gap-2">
                  {lineBookmarks.length === 0 && (
                    <span className="text-xs text-slate-400 italic py-1">
                      No pages saved
                    </span>
                  )}
                  {lineBookmarks.map((page) => {
                    // Filter out any complex react-pdf bookmarks if any remain somehow
                    if (typeof page !== "number") return null;
                    return (
                      <button
                        key={page}
                        onClick={() => handleJumpToPage(page)}
                        className="group flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-sm hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                      >
                        <FaBookmark className="text-purple-500 text-xs" />
                        <span className="dark:text-slate-200">Pg {page}</span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLineBookmark(story.id, page);
                          }}
                          className="ml-1 text-slate-400 hover:text-red-500"
                        >
                          ×
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <iframe
                key={pdfSrc} // <--- Key prop forces re-render when source changes (including hash)
                src={pdfSrc}
                className="w-full flex-1 border-0"
                title={story.title}
              />
            </>
          ) : (
            <div className="overflow-y-auto h-full p-8 space-y-4">
              {storyLines.map((line, index) => {
                const isLineBookmarked = lineBookmarks.includes(index);
                return (
                  <div key={index} className="flex items-stretch gap-4 group">
                    <div
                      role="button"
                      onClick={() => onToggleLineBookmark(story.id, index)}
                      className={`w-2 rounded-full flex-shrink-0 cursor-pointer transition-all duration-300 ${
                        isLineBookmarked
                          ? "bg-purple-600"
                          : "bg-slate-300 dark:bg-slate-600 hover:bg-purple-300"
                      }`}
                      title={
                        isLineBookmarked ? "Remove bookmark" : "Add bookmark"
                      }
                    />
                    <p className="flex-1 text-lg leading-relaxed text-slate-700 dark:text-slate-300 py-1">
                      {line}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!story.pdfUrl && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 shrink-0">
            <button
              onClick={onClose}
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-4 focus:ring-purple-500/50"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

StoryDisplayModal.propTypes = {
  story: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  lineBookmarks: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ).isRequired,
  onToggleLineBookmark: PropTypes.func.isRequired,
};

// ✅ THE FIX IS HERE: Added default functions to prevent crashes
const StoriesView = ({
  storyTimer,
  stories = [],
  storyBookmarks = [],
  lineBookmarks = {},
  onSelectStory = () => {},
  onToggleStoryBookmark = () =>
    console.error(
      "onToggleStoryBookmark function was not passed to StoriesView.",
    ),
  onToggleLineBookmark = () =>
    console.error(
      "onToggleLineBookmark function was not passed to StoriesView.",
    ),
  startStoryTimer,
  pauseStoryTimer,
  resetStoryTimer,
  stopStoryTimer,
}) => {
  const [showStory, setShowStory] = useState(false);
  const [currentStory, setCurrentStory] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelectStory = (story) => {
    setCurrentStory(story);
    setShowStory(true);
    if (onSelectStory) onSelectStory(story.id); // Pass story ID to parent if needed
  };

  const handleCloseModal = () => {
    setShowStory(false);
  };

  const categories = useMemo(() => {
    const cats = {};
    stories.forEach((story) => {
      const cat = story.category || "Other";
      if (!cats[cat]) cats[cat] = 0;
      cats[cat]++;
    });
    return Object.entries(cats).map(([name, count]) => ({ name, count }));
  }, [stories]);

  const filteredStories = useMemo(() => {
    if (filter === "bookmarked") {
      return stories.filter((story) => storyBookmarks.includes(story.id));
    }
    if (selectedCategory) {
      return stories.filter(
        (story) => (story.category || "Other") === selectedCategory,
      );
    }
    return stories;
  }, [filter, stories, storyBookmarks, selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
          पठन अभ्यास
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg max-w-2xl mx-auto">
          Improve fluency and confidence with open-ended, timed reading
          sessions.
        </p>
      </div>

      {/* Timer Display */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="p-8 md:p-12 bg-white dark:bg-slate-800/50 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 space-y-8"
      >
        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-xl font-semibold">
            Open Practice Session
          </p>
          <motion.div
            animate={{ scale: storyTimer.isRunning ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className="text-6xl md:text-7xl font-mono font-bold text-center bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
          >
            {formatTime(storyTimer.time)}
          </motion.div>

          {storyTimer.isRunning && (
            <div className="flex items-center gap-2 text-green-500 dark:text-green-400 font-semibold animate-pulse">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Timer is active</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
          <AnimatedButton
            onClick={startStoryTimer}
            disabled={storyTimer.isRunning}
            className="bg-green-500 hover:bg-green-600 text-white focus:ring-green-500/50"
            icon={<FaPlay />}
          >
            {storyTimer.isPaused ? "Resume" : "Start"}
          </AnimatedButton>
          <AnimatedButton
            onClick={pauseStoryTimer}
            disabled={!storyTimer.isRunning}
            className="bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500/50"
            icon={<FaPause />}
          >
            Pause
          </AnimatedButton>
          <AnimatedButton
            onClick={resetStoryTimer}
            disabled={storyTimer.time === 0}
            className="bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/50"
            icon={<FaRedo />}
          >
            Reset
          </AnimatedButton>
          <AnimatedButton
            onClick={() => stopStoryTimer(currentStory)}
            disabled={storyTimer.time === 0 || !currentStory}
            className="bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500/50"
            icon={<FaSave />}
            title={
              !currentStory
                ? "Select a story first to record your time"
                : "Record session"
            }
          >
            Record
          </AnimatedButton>
        </div>
      </motion.div>

      {/* Story Selection */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <FaBookOpen className="text-blue-500" />
            {selectedCategory && filter === "all"
              ? selectedCategory
              : "Choose a Story"}
          </h3>
          <div className="flex items-center gap-4">
            {selectedCategory && filter === "all" && (
              <button
                onClick={handleBackToCategories}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-semibold"
              >
                <FaArrowLeft /> Back
              </button>
            )}
            <div className="flex items-center p-1 bg-slate-200 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => {
                  setFilter("all");
                  setSelectedCategory(null);
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === "all" ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-white shadow" : "text-slate-600 dark:text-slate-300"}`}
              >
                All Stories
              </button>
              <button
                onClick={() => setFilter("bookmarked")}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === "bookmarked" ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-white shadow" : "text-slate-600 dark:text-slate-300"}`}
              >
                Bookmarked
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filter === "all" && !selectedCategory ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.name}
                  category={cat.name}
                  count={cat.count}
                  onSelect={handleCategorySelect}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="stories"
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onSelect={handleSelectStory}
                  onToggleStoryBookmark={onToggleStoryBookmark}
                  isBookmarked={storyBookmarks.includes(story.id)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {filteredStories.length === 0 && filter === "bookmarked" && (
          <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
            <FaBookmark className="mx-auto text-4xl text-slate-400 dark:text-slate-500 mb-4" />
            <h4 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
              No Bookmarked Stories
            </h4>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Click the bookmark icon on a story to save it here.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showStory && currentStory && (
          <StoryDisplayModal
            story={currentStory}
            onClose={handleCloseModal}
            lineBookmarks={lineBookmarks[currentStory.id] || []}
            onToggleLineBookmark={onToggleLineBookmark}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Update PropTypes to not require the functions with defaults
StoriesView.propTypes = {
  storyTimer: PropTypes.shape({
    time: PropTypes.number.isRequired,
    isRunning: PropTypes.bool.isRequired,
    isPaused: PropTypes.bool.isRequired,
  }).isRequired,
  stories: PropTypes.array,
  storyBookmarks: PropTypes.array,
  lineBookmarks: PropTypes.object,
  onSelectStory: PropTypes.func,
  onToggleStoryBookmark: PropTypes.func,
  onToggleLineBookmark: PropTypes.func,
  startStoryTimer: PropTypes.func.isRequired,
  pauseStoryTimer: PropTypes.func.isRequired,
  resetStoryTimer: PropTypes.func.isRequired,
  stopStoryTimer: PropTypes.func.isRequired,
};

export default StoriesView;
