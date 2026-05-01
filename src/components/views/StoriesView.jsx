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
import StoryFilters from "./stories/StoryFilters";
import Mascot from "../ui/Mascot";
import { fetchRandomStory } from "../../lib/storyApi";

// Components Extracted to: src/components/views/stories/

// ✅ THE FIX IS HERE: Added default functions to prevent crashes
const StoriesView = ({
  storyTimer,
  stories = [],
  storyBookmarks = [],
  lineBookmarks = {},
  userSettings,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
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
      setIsLoadingStory(false);
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
    let result = stories;

    // Apply bookmarked filter
    if (filter === "bookmarked") {
      result = result.filter((story) => storyBookmarks.includes(story.id));
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(
        (story) => (story.category || "Other") === selectedCategory,
      );
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (story) =>
          story.title?.toLowerCase().includes(query) ||
          story.author?.toLowerCase().includes(query),
      );
    }

    // Apply difficulty filter
    if (selectedDifficulty) {
      result = result.filter(
        (story) => story.difficulty === selectedDifficulty,
      );
    }

    return result;
  }, [
    filter,
    stories,
    storyBookmarks,
    selectedCategory,
    searchQuery,
    selectedDifficulty,
  ]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleNextStory = () => {
    if (filteredStories.length === 0) return;

    const currentIndex = filteredStories.findIndex(
      (s) => s.id === currentStory?.id,
    );
    const nextIndex = (currentIndex + 1) % filteredStories.length;
    setCurrentStory(filteredStories[nextIndex]);
  };

  return (
    <div className="space-y-12">
      {/* Header - Your Story Library */}
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📚 Your Story Library
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          Browse and read from your collection of stories
        </p>
      </div>

      {/* SECTION 1: Story Library AT TOP */}
      {stories.length > 0 && (
        <div className="space-y-6">
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

          <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-sm text-blue-800 dark:text-blue-200">
            Your audio will be saved in the Records section after you tap
            Record.
          </div>

          {/* Story Filters */}
          <StoryFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
            categories={categories}
          />

          {/* Story Selection */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                {selectedCategory && filter === "all"
                  ? selectedCategory
                  : "Browse Stories"}
              </h3>
              <div className="flex items-center gap-3">
                {selectedCategory && filter === "all" && (
                  <button
                    onClick={handleBackToCategories}
                    className="text-sm px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-semibold"
                  >
                    ← Back
                  </button>
                )}
                <div className="flex items-center p-0.5 bg-slate-200 dark:bg-slate-800 rounded">
                  <button
                    onClick={() => {
                      setFilter("all");
                      setSelectedCategory(null);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${filter === "all" ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-300"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("bookmarked")}
                    className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${filter === "bookmarked" ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-300"}`}
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
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
              <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                <Mascot mood="sleepy" size={100} className="mb-3 opacity-70" />
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No Bookmarked Stories
                </h4>
              </div>
            )}
          </div>

          <AnimatePresence>
            {showStory && currentStory && (
              <StoryDisplayModal
                story={currentStory}
                onClose={handleCloseModal}
                onNextStory={handleNextStory}
                onToggleBookmark={() => onToggleStoryBookmark(currentStory.id)}
                isBookmarked={storyBookmarks.includes(currentStory.id)}
                lineBookmarks={lineBookmarks[currentStory.id] || []}
                onToggleLineBookmark={onToggleLineBookmark}
                userSettings={userSettings}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* SECTION 2: Story Reading Interface */}
      {currentStory && showStory && (
        <div className="border-t-2 border-slate-300 dark:border-slate-700 pt-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {currentStory.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {currentStory.duration} • {currentStory.language}
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentStory(null);
                setShowStory(false);
              }}
              className="text-sm px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded font-semibold transition-colors"
            >
              Back
            </button>
          </div>

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

          <AnimatePresence>
            {currentStory && (
              <StoryDisplayModal
                story={currentStory}
                onClose={handleCloseModal}
                onNextStory={handleNextStory}
                onToggleBookmark={() => onToggleStoryBookmark(currentStory.id)}
                isBookmarked={storyBookmarks.includes(currentStory.id)}
                lineBookmarks={lineBookmarks[currentStory.id] || []}
                onToggleLineBookmark={onToggleLineBookmark}
                userSettings={userSettings}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* SECTION 3: Random 15-Minute Stories */}
      <div className="border-t-2 border-slate-300 dark:border-slate-700 pt-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          🎲 Random 15-Minute Stories
        </h2>
        <LanguageSelector
          onSelectLanguage={handleLanguageSelect}
          isLoading={isLoadingStory}
        />

        {storyError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-200"
          >
            <p>❌ {storyError}</p>
            <button
              onClick={() => {
                setStoryError(null);
                setCurrentStory(null);
              }}
              className="mt-2 text-xs font-semibold underline"
            >
              Try Another Language
            </button>
          </motion.div>
        )}
      </div>
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
