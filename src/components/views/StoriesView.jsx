// src/features/hindi/components/views/StoriesView.jsx

import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookmark, FaBookOpen, FaArrowLeft } from "react-icons/fa";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";
import CategoryCard from "./stories/CategoryCard";
import StoryCard from "./stories/StoryCard";
import StoryDisplayModal from "./stories/StoryDisplayModal";
import StoryTimer from "./stories/StoryTimer";
import LanguageSelector from "./stories/LanguageSelector";
import Mascot from "../ui/Mascot";
import { fetchRandomStory } from "../../lib/storyApi";

// Components Extracted to: src/components/views/stories/

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
  const [showLanguageSelector, setShowLanguageSelector] = useState(true);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [storyError, setStoryError] = useState(null);

  const {
    isRecording,
    recorderState,
    audioUrl,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
    analyser,
  } = useAudioRecorder();

  const handleStart = async () => {
    try {
      if (recorderState === "idle") {
        if (audioUrl) clearRecording();
        await startRecording();
      } else if (recorderState === "paused") {
        resumeRecording();
      }
      startStoryTimer();
    } catch (err) {
      console.error(err);
      startStoryTimer();
    }
  };

  const handlePause = () => {
    pauseRecording();
    pauseStoryTimer();
  };

  const handleReset = () => {
    stopRecording();
    clearRecording();
    resetStoryTimer();
  };

  const handleStop = async (story) => {
    const audioBlob = await stopRecording();
    stopStoryTimer(story, audioBlob);
  };

  const handleSelectStory = (story) => {
    setCurrentStory(story);
    setShowStory(true);
    if (onSelectStory) onSelectStory(story.id); // Pass story ID to parent if needed
  };

  const handleCloseModal = () => {
    setShowStory(false);
  };

  const handleLanguageSelect = async (languageCode) => {
    setIsLoadingStory(true);
    setStoryError(null);
    try {
      const story = await fetchRandomStory(languageCode);
      setCurrentStory(story);
      setShowStory(true);
      setShowLanguageSelector(false);
    } catch (error) {
      console.error("Error fetching story:", error);
      setStoryError(error.message);
      setIsLoadingStory(false);
    }
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
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
          पठन अभ्यास
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg max-w-2xl mx-auto">
          Improve fluency and confidence with open-ended, timed reading
          sessions.
        </p>
      </div>

      {/* SECTION 1: Random 15-Min Stories */}
      <div className="border-t-2 border-slate-300 dark:border-slate-700 pt-12">
        <LanguageSelector
          onSelectLanguage={handleLanguageSelect}
          isLoading={isLoadingStory}
        />

        {storyError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-200"
          >
            <p>❌ {storyError}</p>
            <button
              onClick={() => {
                setStoryError(null);
                setCurrentStory(null);
              }}
              className="mt-2 text-sm font-semibold underline hover:no-underline"
            >
              Try Another Language
            </button>
          </motion.div>
        )}
      </div>

      {/* SECTION 2: Story Reading Interface (if story selected) */}
      {currentStory && showStory && (
        <div className="border-t-2 border-slate-300 dark:border-slate-700 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                {currentStory.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                ~{currentStory.duration} • {currentStory.language}
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentStory(null);
                setShowStory(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-semibold transition-colors"
            >
              <FaArrowLeft /> Back
            </button>
          </div>

          {/* Timer Display */}
          <StoryTimer
            storyTimer={storyTimer}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onStop={handleStop}
            currentStory={currentStory}
            analyser={analyser}
            audioUrl={audioUrl}
          />

          {/* Story Content Display */}
          <AnimatePresence>
            {currentStory && (
              <StoryDisplayModal
                story={currentStory}
                onClose={handleCloseModal}
                lineBookmarks={lineBookmarks[currentStory.id] || []}
                onToggleLineBookmark={onToggleLineBookmark}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* SECTION 3: Browse Your Stories (PDF Library) */}
      {stories.length > 0 && (
        <div className="border-t-2 border-slate-300 dark:border-slate-700 pt-12 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              📚 Your Story Library
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Browse and read from your collection of stories
            </p>
          </div>

          {/* Timer Display */}
          <StoryTimer
            storyTimer={storyTimer}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onStop={handleStop}
            currentStory={currentStory}
            analyser={analyser}
            audioUrl={audioUrl}
          />

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
              <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                <Mascot
                  mood="sleepy"
                  size={120}
                  className="mb-4 opacity-70 drop-shadow-lg"
                />
                <h4 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                  No Bookmarked Stories
                </h4>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm text-center">
                  Click the bookmark icon on a story to save it here!
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
      )}
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
