import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookmark } from 'react-icons/fa';

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

export default StoryDisplayModal;
