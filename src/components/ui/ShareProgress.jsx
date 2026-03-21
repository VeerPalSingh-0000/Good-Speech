import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { FaShareAlt, FaDownload, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ShareProgress = ({ targetRef, title = "Progress Report", fileName = "speechgood-progress" }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    if (!targetRef.current) return null;
    
    try {
      setIsGenerating(true);
      
      // We temporarily modify some styles to ensure the capture looks good
      const originalStyle = targetRef.current.style.cssText;
      targetRef.current.style.borderRadius = '0px';
      targetRef.current.style.boxShadow = 'none';

      const canvas = await html2canvas(targetRef.current, {
        scale: 2, // High resolution
        backgroundColor: '#ffffff', // Force white background
        logging: false,
        useCORS: true,
      });

      // Restore original style
      targetRef.current.style.cssText = originalStyle;

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 1.0);
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    const blob = await generateImage();
    if (!blob) return;

    const file = new File([blob], `${fileName}.png`, { type: 'image/png' });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'My SpeechGood Progress',
          text: `Check out my recent progress on SpeechGood: ${title}`,
          files: [file],
        });
        toast.success("Shared successfully!");
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error sharing sequence:", error);
          toast.error("Error sharing. Try downloading instead.");
        }
      }
    } else {
      // Fallback: download the image if sharing is not supported
      handleDownload(blob);
    }
  };

  const handleDownload = async (preGeneratedBlob) => {
    const blob = preGeneratedBlob || await generateImage();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Image downloaded!");
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleShare}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isGenerating ? <FaSpinner className="animate-spin" /> : <FaShareAlt />}
        <span>Share</span>
      </button>
      
      {!navigator.share && (
        <button
          onClick={() => handleDownload()}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg shadow transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? <FaSpinner className="animate-spin" /> : <FaDownload />}
          <span>Download</span>
        </button>
      )}
    </div>
  );
};

export default ShareProgress;
