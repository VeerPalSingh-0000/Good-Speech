import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookmark, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the PDF.js worker from CDN - must match exactly with the pdfjs-dist version in the API
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs`;

const StoryDisplayModal = ({
  story,
  onClose,
  lineBookmarks,
  onToggleLineBookmark,
}) => {
  const [pageInput, setPageInput] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(600);

  // Measure container width for responsive PDF rendering
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 16); // 8px padding each side
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const storyLines = useMemo(
    () =>
      story.content
        ? story.content.split("\n").filter((line) => line.trim() !== "")
        : [],
    [story.content],
  );

  const handleAddPageBookmark = () => {
    const page = parseInt(pageInput);
    if (page && page > 0 && (!numPages || page <= numPages)) {
      onToggleLineBookmark(story.id, page);
      setPageInput("");
    }
  };

  const handleJumpToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages: total }) => {
    setNumPages(total);
    setPdfLoading(false);
    setPdfError(false);
  }, []);

  const onDocumentLoadError = useCallback(() => {
    setPdfLoading(false);
    setPdfError(true);
  }, []);

  const goToPrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const goToNextPage = () => setCurrentPage(p => Math.min(numPages || p, p + 1));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4"
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
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white truncate pr-4">
            {story.title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-red-500 transition-colors shrink-0"
          >
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-slate-900 flex flex-col min-h-0">
          {story.pdfUrl ? (
            <>
              {/* PDF Toolbar */}
              <div className="flex items-center gap-2 p-2 sm:p-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 overflow-x-auto shrink-0">
                <span className="text-xs sm:text-sm font-semibold whitespace-nowrap dark:text-slate-300">
                  Bookmarks:
                </span>
                <input
                  type="number"
                  min="1"
                  max={numPages || undefined}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  placeholder="pg"
                  className="w-14 sm:w-20 px-1 py-1 text-sm border rounded bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleAddPageBookmark}
                  className="px-2 sm:px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 whitespace-nowrap font-medium"
                >
                  Add
                </button>
                <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                <div className="flex gap-1 sm:gap-2">
                  {lineBookmarks.length === 0 && (
                    <span className="text-xs text-slate-400 italic py-1">No pages saved</span>
                  )}
                  {lineBookmarks.map((page) => {
                    if (typeof page !== "number") return null;
                    return (
                      <button
                        key={page}
                        onClick={() => handleJumpToPage(page)}
                        className="group flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-sm hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                      >
                        <FaBookmark className="text-purple-500 text-xs" />
                        <span className="dark:text-slate-200">{page}</span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLineBookmark(story.id, page);
                          }}
                          className="ml-0.5 text-slate-400 hover:text-red-500"
                        >
                          ×
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Page Navigation Bar */}
              <div className="flex items-center justify-center gap-3 p-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage <= 1}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft size={14} />
                </button>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[80px] text-center">
                  Page {currentPage} {numPages ? `/ ${numPages}` : ''}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={numPages && currentPage >= numPages}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronRight size={14} />
                </button>
              </div>

              {/* PDF Renderer */}
              <div ref={containerRef} className="flex-1 overflow-y-auto flex justify-center p-2 bg-slate-200 dark:bg-slate-950">
                {pdfLoading && (
                  <div className="flex flex-col items-center justify-center gap-3 py-16">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Loading PDF...</p>
                  </div>
                )}
                {pdfError && (
                  <div className="flex flex-col items-center justify-center gap-3 py-16">
                    <i className="fas fa-exclamation-triangle text-3xl text-red-400" />
                    <p className="text-red-400 text-sm">Failed to load PDF</p>
                    <button
                      onClick={() => window.open(story.pdfUrl, '_blank')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                    >
                      Open in new tab
                    </button>
                  </div>
                )}
                <Document
                  file={story.pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading=""
                >
                  <Page
                    pageNumber={currentPage}
                    width={Math.min(containerWidth, 800)}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </Document>
              </div>
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
                      title={isLineBookmarked ? "Remove bookmark" : "Add bookmark"}
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
