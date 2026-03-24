import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBookmark,
  FaRegBookmark,
  FaChevronLeft,
  FaChevronRight,
  FaMicrophone,
  FaStop,
} from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import { useSpeechRecognition } from "../../../hooks/useSpeechRecognition";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up the PDF.js worker from CDN - must match exactly with the pdfjs-dist version in the API
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs`;

const StoryDisplayModal = ({
  story,
  onClose,
  onNextStory,
  onToggleBookmark,
  isBookmarked,
  lineBookmarks,
  onToggleLineBookmark,
}) => {
  const [pageInput, setPageInput] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [textContent, setTextContent] = useState(story.content || "");
  const [textLoading, setTextLoading] = useState(!!story.dataUrl);
  const [textError, setTextError] = useState(false);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(600);

  const {
    isListening,
    startListening,
    stopListening,
    compareToTarget,
    supported,
    resetTranscript,
  } = useSpeechRecognition("hi-IN");
  const [showPronunciation, setShowPronunciation] = useState(false);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  // Fetch story content dynamically if dataUrl is provided
  useEffect(() => {
    if (story.dataUrl && !story.content) {
      setTextLoading(true);
      setTextError(false);
      fetch(story.dataUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch story data");
          return res.json();
        })
        .then((data) => {
          // data could be an array of stories (like harryPotter.json) or a single object
          if (Array.isArray(data)) {
            const foundStory = data.find((s) => s.id === story.id);
            if (foundStory) {
              setTextContent(foundStory.content || "");
            } else {
              throw new Error("Story not found in fetched data");
            }
          } else {
            setTextContent(data.content || "");
          }
        })
        .catch((err) => {
          console.error("Error fetching story content:", err);
          setTextError(true);
        })
        .finally(() => {
          setTextLoading(false);
        });
    } else {
      setTextContent(story.content || "");
      setTextLoading(false);
    }
  }, [story]);

  // Measure container width for responsive PDF rendering
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 16); // 8px padding each side
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const storyLines = useMemo(
    () =>
      textContent
        ? textContent.split("\n").filter((line) => line.trim() !== "")
        : [],
    [textContent],
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

  const goToPrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNextPage = () =>
    setCurrentPage((p) => Math.min(numPages || p, p + 1));

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
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-3">
                {story.title}
              </h2>

              {/* Story Metadata */}
              <div className="space-y-2 text-sm">
                {/* Author and Difficulty */}
                <div className="flex flex-wrap items-center gap-3">
                  {story.author && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span>✍️ {story.author}</span>
                    </div>
                  )}
                  {story.difficulty && (
                    <span
                      className={`px-3 py-1 rounded-full font-semibold text-xs ${
                        story.difficulty === "Easy"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                          : story.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                      }`}
                    >
                      {story.difficulty}
                    </span>
                  )}
                </div>

                {/* Story Details */}
                <div className="flex flex-wrap gap-4 text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                  {story.wordCount && <div>📖 {story.wordCount} words</div>}
                  {story.duration && <div>⏱️ {story.duration}</div>}
                  {story.category && <div>📂 {story.category}</div>}
                </div>
              </div>
            </div>

            {/* Close and Next Buttons */}
            <div className="flex gap-2 shrink-0">
              {onToggleBookmark && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark();
                  }}
                  className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
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
              )}
              {onNextStory && (
                <button
                  onClick={onNextStory}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm transition-colors"
                  title="Load next story"
                >
                  ⏭️ Next
                </button>
              )}
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
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
                  />
                </svg>
              </button>
            </div>
          </div>
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
                    <span className="text-xs text-slate-400 italic py-1">
                      No pages saved
                    </span>
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
                  Page {currentPage} {numPages ? `/ ${numPages}` : ""}
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
              <div
                ref={containerRef}
                className="flex-1 overflow-y-auto flex justify-center p-2 bg-slate-200 dark:bg-slate-950"
              >
                {pdfLoading && (
                  <div className="flex flex-col items-center justify-center gap-3 py-16">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Loading PDF...
                    </p>
                  </div>
                )}
                {pdfError && (
                  <div className="flex flex-col items-center justify-center gap-3 py-16">
                    <i className="fas fa-exclamation-triangle text-3xl text-red-400" />
                    <p className="text-red-400 text-sm">Failed to load PDF</p>
                    <button
                      onClick={() => window.open(story.pdfUrl, "_blank")}
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
              {textLoading && (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Loading story content...
                  </p>
                </div>
              )}
              {textError && (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <i className="fas fa-exclamation-triangle text-3xl text-red-400" />
                  <p className="text-red-400 text-sm">
                    Failed to load story content.
                  </p>
                </div>
              )}
              {!textLoading &&
                !textError &&
                storyLines.map((line, index) => {
                  const isLineBookmarked = lineBookmarks.includes(index);
                  const lineResults = showPronunciation
                    ? compareToTarget(line)
                    : [];

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
                      <div className="flex-1 text-lg leading-relaxed text-slate-700 dark:text-slate-300 py-1 flex flex-wrap gap-[0.25rem]">
                        {!showPronunciation ? (
                          <span>{line}</span>
                        ) : (
                          lineResults.map((result, i) => (
                            <span
                              key={i}
                              className={`transition-colors duration-300 ${result.isCorrect ? "text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-900/40 rounded px-1" : ""}`}
                            >
                              {result.word}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {!story.pdfUrl && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 shrink-0 flex gap-4">
            {supported && (
              <button
                onClick={() => {
                  if (isListening) {
                    stopListening();
                    setShowPronunciation(false);
                  } else {
                    resetTranscript();
                    startListening();
                    setShowPronunciation(true);
                  }
                }}
                className={`flex-1 py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${isListening ? "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/50 dark:text-rose-300" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300"}`}
              >
                {isListening ? (
                  <>
                    <FaStop /> Stop Reading
                  </>
                ) : (
                  <>
                    <FaMicrophone /> Practice Reading aloud
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-4 focus:ring-purple-500/50"
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
    content: PropTypes.string,
    dataUrl: PropTypes.string,
    pdfUrl: PropTypes.string,
    author: PropTypes.string,
    difficulty: PropTypes.string,
    duration: PropTypes.string,
    wordCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    category: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onNextStory: PropTypes.func,
  onToggleBookmark: PropTypes.func,
  isBookmarked: PropTypes.bool,
  lineBookmarks: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ).isRequired,
  onToggleLineBookmark: PropTypes.func.isRequired,
};

export default StoryDisplayModal;
