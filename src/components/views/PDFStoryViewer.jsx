import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Document, Page, pdfjs } from "react-pdf";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Essential styles for react-pdf
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure worker (Robust local load)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

// Helper for Text Layer Interaction with "Fragmented Line" Style
const TextLayerHandler = ({ pageNumber, onTextClick, bookmarkedItems }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      const textLayer = document.querySelector(".react-pdf__Page__textLayer");
      if (!textLayer) return;

      const spans = textLayer.querySelectorAll("span");
      spans.forEach((span, index) => {
        // ID format: p{pageNumber}_i{index}
        const itemId = `p${pageNumber}_i${index}`;
        const isBookmarked = bookmarkedItems.includes(itemId);

        // Click Handler
        span.onclick = (e) => {
          e.stopPropagation();
          onTextClick(index, span.textContent);
        };

        // --- VISUAL STYLING ("Fragmented Line") ---
        // Ensure the span has box-sizing so border doesn't mess up layout
        span.style.boxSizing = "border-box";
        span.style.cursor = "pointer";

        // The "Line": Left border
        span.style.borderLeftWidth = "4px";
        span.style.paddingLeft = "4px"; // Spacing from the line

        // Colors
        if (isBookmarked) {
          span.style.borderLeftColor = "#9333ea"; // Purple-600
          span.style.backgroundColor = "rgba(147, 51, 234, 0.15)"; // Light purple bg
        } else {
          span.style.borderLeftColor = "#cbd5e1"; // Slate-300 (Visible gray line)
          span.style.backgroundColor = "transparent";
        }

        // Hover effects
        span.onmouseenter = () => {
          if (!isBookmarked) {
            span.style.borderLeftColor = "#d8b4fe"; // Light purple
            span.style.backgroundColor = "rgba(147, 51, 234, 0.05)";
          }
        };
        span.onmouseleave = () => {
          if (!isBookmarked) {
            span.style.borderLeftColor = "#cbd5e1"; // Revert to Gray
            span.style.backgroundColor = "transparent";
          }
        };
      });
    }, 500); // Wait for render
    return () => clearTimeout(timeout);
  }, [pageNumber, bookmarkedItems, onTextClick]);

  return null;
};

const PDFStoryViewer = ({ story, lineBookmarks, onToggleLineBookmark }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  // Reset page on new story
  useEffect(() => {
    setPageNumber(1);
    setLoading(true);
  }, [story.id]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const handleTextClick = (index, text) => {
    const itemId = `p${pageNumber}_i${index}`;
    onToggleLineBookmark(story.id, itemId);
  };

  // Filter bookmarks for current page
  const pageBookmarks = lineBookmarks.filter(
    (bm) => typeof bm === "string" && bm.startsWith(`p${pageNumber}_`),
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative">
      {/* Controls Toolbar */}
      <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
              className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-md disabled:opacity-30 transition-all"
            >
              <FaChevronLeft className="dark:text-white" />
            </button>
            <span className="px-3 font-mono text-sm dark:text-white">
              {loading ? "..." : `${pageNumber} / ${numPages || "--"}`}
            </span>
            <button
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
              className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-md disabled:opacity-30 transition-all"
            >
              <FaChevronRight className="dark:text-white" />
            </button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Click text strips to bookmark
          </div>
        </div>
      </div>

      {/* PDF Container */}
      <div className="flex-1 overflow-auto flex justify-center p-4 bg-slate-200/50 dark:bg-slate-900">
        <Document
          file={story.pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error("PDF Load Error:", error)}
          className="shadow-2xl"
          loading={
            <div className="mt-10 text-slate-500">Loading PDF Document...</div>
          }
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={false}
            className="bg-white"
            width={Math.min(800, window.innerWidth - 40)}
          />
        </Document>

        {/* Interaction Handler */}
        {!loading && (
          <TextLayerHandler
            pageNumber={pageNumber}
            onTextClick={handleTextClick}
            bookmarkedItems={lineBookmarks}
          />
        )}
      </div>
    </div>
  );
};

PDFStoryViewer.propTypes = {
  story: PropTypes.object.isRequired,
  lineBookmarks: PropTypes.array.isRequired,
  onToggleLineBookmark: PropTypes.func.isRequired,
};

export default PDFStoryViewer;
