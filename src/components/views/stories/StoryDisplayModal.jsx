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
  FaPlay,
} from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import kru2uni from "@anthro-ai/krutidev-unicode";
import { useSpeechRecognition } from "../../../hooks/useSpeechRecognition";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up the PDF.js worker from CDN - must match exactly with the installed pdfjs-dist version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const pdfOptions = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
};

const StoryDisplayModal = ({
  story,
  onClose,
  onNextStory,
  onToggleBookmark,
  isBookmarked,
  lineBookmarks,
  onToggleLineBookmark,
  userSettings,
}) => {
  const getRecommendedWPM = (day) => {
    if (day >= 1 && day <= 3) return 40;
    if (day >= 4 && day <= 6) return 45;
    if (day >= 7 && day <= 9) return 50;
    if (day >= 10 && day <= 12) return 55;
    if (day >= 13 && day <= 15) return 60;
    if (day >= 16 && day <= 20) return 65 + (day - 16); // 65-69 WPM
    if (day >= 21 && day <= 25) return 75 + (day - 21); // 75-79 WPM
    if (day >= 26 && day <= 30) return 85 + (day - 26) * 3; // 85-97 WPM
    if (day > 30) return 100;
    return 40;
  };
  const currentDay = userSettings?.programProgress?.currentDay || 1;
  const recommendedWPM = getRecommendedWPM(currentDay);
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
  const [showMobileBookmarks, setShowMobileBookmarks] = useState(false);

  // Guided Reading State
  const [isGuidedReading, setIsGuidedReading] = useState(false);
  const [targetWPM, setTargetWPM] = useState(recommendedWPM);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [pdfPageText, setPdfPageText] = useState("");

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

  const parsedText = useMemo(() => {
    const textToParse = story.pdfUrl ? pdfPageText : textContent;
    if (!textToParse) return [];
    let globalWordIdx = 0;
    return textToParse
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line, lineIdx) => {
        const words = line.split(" ");
        const wordObjects = words.map((word) => ({
          word,
          globalWordIdx: globalWordIdx++,
        }));
        return { line, wordObjects, lineIdx };
      });
  }, [textContent, pdfPageText, story.pdfUrl]);

  const totalWords = useMemo(() => {
    return parsedText.reduce((acc, line) => acc + line.wordObjects.length, 0);
  }, [parsedText]);

  // Guided Reading Timer Logic
  useEffect(() => {
    let intervalId;
    if (isGuidedReading && activeWordIndex < totalWords) {
      const msPerWord = 60000 / targetWPM;
      intervalId = setInterval(() => {
        setActiveWordIndex((prev) => {
          // If we reach the end, stop
          if (prev + 1 >= totalWords) {
            setIsGuidedReading(false);
            return prev + 1;
          }
          return prev + 1;
        });
      }, msPerWord);
    }
    return () => clearInterval(intervalId);
  }, [isGuidedReading, activeWordIndex, targetWPM, totalWords]);

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

  const onPageLoadSuccess = useCallback(async (page) => {
    try {
      const textContentObj = await page.getTextContent();
      const textItems = textContentObj.items;
      let text = "";
      let lastY = null;
      let lastX = null;
      let lastWidth = null;

      for (const item of textItems) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          text += "\n"; // New line if Y coordinate changes significantly
        } else if (lastX !== null && lastWidth !== null) {
          // Check for horizontal gap (space)
          const expectedNextX = lastX + lastWidth;
          const actualNextX = item.transform[4];
          if (actualNextX - expectedNextX > 2) {
            text += " ";
          }
        }
        text += item.str;
        lastY = item.transform[5];
        lastX = item.transform[4];
        lastWidth = item.width;
      }

      // Auto-detect and convert Kruti Dev to Unicode
      // Common Kruti Dev strings: gS (है), vjs (अरे), ikWVj (पॉटर)
      if (
        text.includes("gS") ||
        text.includes("vjs") ||
        text.includes("ikWVj") ||
        text.includes("ghjks")
      ) {
        try {
          // Kruti Dev PDFs often lack spaces after punctuation or between words.
          // Let's add artificial spaces after common Kruti Dev punctuation to ensure Guided Reading works.
          let paddedText = text
            .replace(/]/g, "] ") // comma
            .replace(/A/g, "A ") // purnaviram (full stop)
            .replace(/\^/g, "^ ") // right quote
            .replace(/\*/g, " *") // left quote
            .replace(/-/g, " - ") // hyphen
            .replace(/\s+/g, " "); // remove double spaces

          text = kru2uni(paddedText);
        } catch (e) {
          console.error("KrutiDev conversion failed", e);
        }
      }

      setPdfPageText(text);
    } catch (err) {
      console.error("Failed to extract text from PDF page", err);
    }
  }, []);

  const goToPrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNextPage = () =>
    setCurrentPage((p) => Math.min(numPages || p, p + 1));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white dark:bg-slate-950 flex flex-col z-[100]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full h-full flex flex-col relative"
      >
        {/* Header - Sleek and modern */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shrink-0 sticky top-0 z-20 shadow-sm flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white truncate">
              {story.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 sm:hidden">
              {story.author && <span>✍️ {story.author}</span>}
              {story.wordCount && <span>📖 {story.wordCount} words</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {story.difficulty && (
              <span
                className={`hidden sm:inline-flex px-3 py-1 rounded-full font-semibold text-xs ${
                  story.difficulty === "Easy"
                    ? "bg-green-100/50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : story.difficulty === "Medium"
                      ? "bg-yellow-100/50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-red-100/50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {story.difficulty}
              </span>
            )}
            {onToggleBookmark && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark();
                }}
                className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                {isBookmarked ? (
                  <FaBookmark
                    size={18}
                    className="text-purple-600 dark:text-purple-400"
                  />
                ) : (
                  <FaRegBookmark size={18} />
                )}
              </button>
            )}
            {onNextStory && (
              <button
                onClick={onNextStory}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold text-xs sm:text-sm shadow-sm transition-all hover:shadow-md"
              >
                ⏭️ <span className="hidden sm:inline">Next</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
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

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-[#0a0a0a] flex flex-col min-h-0">
          {story.pdfUrl && !isGuidedReading ? (
            <>
              {/* Floating Modern PDF PDF Toolbar & Page Navigation */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 w-[90%] sm:w-auto max-w-2xl transition-all duration-300 opacity-40 hover:opacity-100 focus-within:opacity-100 hover:translate-y-[-4px]">
                {/* Bookmarks Menu */}
                <AnimatePresence>
                  {(showMobileBookmarks || window.innerWidth >= 640) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="flex sm:flex items-center flex-wrap sm:flex-nowrap justify-center gap-3 p-3 sm:p-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl rounded-2xl sm:rounded-full border border-white/20 dark:border-slate-700/50 w-full sm:w-auto overflow-hidden sm:overflow-x-auto scrollbar-hide mb-1"
                    >
                      <div className="flex items-center gap-2 flex-1 sm:flex-none justify-center">
                        <span className="text-xs font-semibold px-2 dark:text-slate-300 whitespace-nowrap">
                          Bookmarks:
                        </span>
                        <input
                          type="number"
                          min="1"
                          max={numPages || undefined}
                          value={pageInput}
                          onChange={(e) => setPageInput(e.target.value)}
                          placeholder="pg"
                          className="w-16 px-3 py-1.5 text-xs text-center border border-slate-200 dark:border-slate-600 rounded-full bg-slate-50 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          onClick={handleAddPageBookmark}
                          className="px-4 py-1.5 text-xs bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 shadow-sm transition-colors"
                        >
                          Add
                        </button>
                      </div>

                      <div className="hidden sm:block w-px h-5 bg-slate-200 dark:bg-slate-600 mx-1 shrink-0"></div>
                      <div className="sm:hidden w-full h-px bg-slate-200 dark:bg-slate-600/50 opacity-50 my-1"></div>

                      <div className="flex flex-wrap items-center justify-center gap-2 px-1 w-full sm:w-auto max-h-24 sm:max-h-none overflow-y-auto sm:overflow-visible">
                        {lineBookmarks.length === 0 && (
                          <span className="text-xs text-slate-400 italic px-2 py-1">
                            No saved pages
                          </span>
                        )}
                        {lineBookmarks.map((page) => {
                          if (typeof page !== "number") return null;
                          return (
                            <button
                              key={page}
                              onClick={() => handleJumpToPage(page)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-full text-xs hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all shadow-sm"
                            >
                              <FaBookmark className="text-purple-500 text-[10px]" />
                              <span className="dark:text-slate-200 font-medium">
                                {page}
                              </span>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleLineBookmark(story.id, page);
                                }}
                                className="ml-1 text-slate-400 hover:text-red-500 text-sm font-bold"
                              >
                                &times;
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Page Navigation */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 px-3 sm:px-6 py-2.5 bg-black/80 dark:bg-black/90 backdrop-blur-xl shadow-2xl rounded-full border border-white/10 text-white w-fit mx-auto">
                  {/* Mobile Menu Toggle */}
                  <button
                    onClick={() => setShowMobileBookmarks(!showMobileBookmarks)}
                    className={`sm:hidden p-2 rounded-full transition-all ${
                      showMobileBookmarks
                        ? "bg-purple-600/40 text-purple-300"
                        : "hover:bg-white/20 text-white/80"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={
                          showMobileBookmarks
                            ? "M6 18L18 6M6 6l12 12"
                            : "M4 6h16M4 12h16M4 18h16"
                        }
                      />
                    </svg>
                  </button>
                  <div className="sm:hidden w-px h-5 bg-white/20 shrink-0 mx-1"></div>

                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <FaChevronLeft size={14} />
                  </button>
                  <span className="text-sm font-medium tracking-wide flex items-center justify-center gap-2 min-w-[100px] text-center">
                    <span className="hidden sm:inline text-white/80">Page</span>
                    <input
                      type="number"
                      min="1"
                      max={numPages || undefined}
                      value={currentPage}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (
                          !isNaN(val) &&
                          val >= 1 &&
                          (!numPages || val <= numPages)
                        ) {
                          handleJumpToPage(val);
                        }
                      }}
                      className="w-12 text-center bg-white/10 border border-white/10 rounded px-1 py-1 focus:outline-none focus:bg-white/20 focus:border-white/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {numPages && (
                      <span className="text-white/60">/ {numPages}</span>
                    )}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={numPages && currentPage >= numPages}
                    className="p-2 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <FaChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* PDF Renderer */}
              <div
                ref={containerRef}
                className="flex-1 h-full w-full overflow-y-auto flex justify-center bg-slate-50 dark:bg-[#0a0a0a] pb-32"
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
                    width={Math.min(containerWidth, 1400)}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    onLoadSuccess={onPageLoadSuccess}
                  />
                </Document>
              </div>
            </>
          ) : (
            <div className="overflow-y-auto h-full p-4 sm:p-6 md:p-8 lg:p-10 w-full">
              <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
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
                  parsedText.map((lineObj) => {
                    const { line, wordObjects, lineIdx } = lineObj;
                    const isLineBookmarked = lineBookmarks.includes(lineIdx);
                    const lineResults = showPronunciation
                      ? compareToTarget(line)
                      : [];

                    return (
                      <div
                        key={lineIdx}
                        className="flex items-stretch gap-3 sm:gap-5 group relative"
                      >
                        <div
                          role="button"
                          onClick={() =>
                            onToggleLineBookmark(story.id, lineIdx)
                          }
                          className={`w-1.5 sm:w-2 rounded-full flex-shrink-0 cursor-pointer transition-all duration-300 ${
                            isLineBookmarked
                              ? "bg-purple-600"
                              : "bg-slate-300 dark:bg-slate-600 hover:bg-purple-300"
                          }`}
                          title={
                            isLineBookmarked
                              ? "Remove bookmark"
                              : "Add bookmark"
                          }
                        />
                        <div className="flex-1 text-xl sm:text-2xl md:text-3xl font-medium leading-relaxed sm:leading-loose text-slate-800 dark:text-slate-200 py-1 flex flex-wrap gap-x-1.5 gap-y-1 sm:gap-x-2 sm:gap-y-1.5">
                          {!showPronunciation
                            ? wordObjects.map((w, i) => {
                                const isActive =
                                  activeWordIndex === w.globalWordIdx;
                                const isPast =
                                  activeWordIndex > w.globalWordIdx;
                                return (
                                  <span
                                    key={i}
                                    className={`transition-all duration-200 rounded ${
                                      isActive
                                        ? "bg-indigo-200 dark:bg-indigo-600 text-indigo-900 dark:text-white px-1 -mx-1 scale-105 shadow-sm z-10 font-bold"
                                        : isPast && isGuidedReading
                                          ? "text-slate-400 dark:text-slate-600"
                                          : ""
                                    }`}
                                  >
                                    {w.word}
                                  </span>
                                );
                              })
                            : lineResults.map((result, i) => (
                                <span
                                  key={i}
                                  className={`transition-colors duration-300 ${result.isCorrect ? "text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/40 rounded px-1" : ""}`}
                                >
                                  {result.word}
                                </span>
                              ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col border-t border-slate-200 dark:border-slate-700 shrink-0">
          {/* Guided Reading Controls */}
          <div className="px-4 py-3 bg-slate-100 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Speed (WPM):
                </label>
                <input
                  type="number"
                  value={targetWPM}
                  onChange={(e) =>
                    setTargetWPM(Math.max(10, parseInt(e.target.value) || recommendedWPM))
                  }
                  className="w-16 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-bold text-indigo-700 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={() => {
                  if (!isGuidedReading) {
                    if (
                      activeWordIndex >= totalWords ||
                      activeWordIndex === -1
                    ) {
                      setActiveWordIndex(0);
                      setTargetWPM(recommendedWPM);
                    }
                    setIsGuidedReading(true);
                    setShowPronunciation(false); // Turn off mic if using guided reading
                  } else {
                    setIsGuidedReading(false);
                  }
                }}
                className={`px-4 py-1.5 font-bold rounded-lg transition-all flex items-center gap-2 text-sm shadow-sm ${isGuidedReading ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-400" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
              >
                {isGuidedReading ? <FaStop size={12} /> : <FaPlay size={12} />}
                {isGuidedReading ? "Stop Guide" : "Start Guided Reading"}
              </button>

              {activeWordIndex > -1 && (
                <button
                  onClick={() => {
                    setIsGuidedReading(false);
                    setActiveWordIndex(-1);
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Standard Actions */}
          <div className="p-4 flex gap-4">
            {supported && !story.pdfUrl && (
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
        </div>
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
