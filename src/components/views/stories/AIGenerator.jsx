import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMagic, FaBookOpen } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { generateAIStory } from "../../../lib/gemini";

const AIGenerator = ({ onStoryGenerated }) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const storyText = await generateAIStory(prompt);
      const newStory = {
        id: `ai-${Date.now()}`,
        title: prompt.length > 20 ? prompt.substring(0, 20) + "..." : prompt,
        content: storyText,
        category: "AI Generated",
        isAI: true,
        date: new Date().toLocaleDateString(),
      };

      onStoryGenerated(newStory);
      setPrompt("");
    } catch (err) {
      setError(
        err?.message ||
          "Kahani generate nahi ho paayi. Thodi der baad fir try karo.",
      );
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-purple-100 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-200 dark:shadow-none">
          <FaMagic />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            AI Story Maker
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Kuch bhi likho, AI uski kahani bana dega
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: Ek sher aur chuhe ki dosti..."
          className="w-full h-32 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-purple-500 outline-none transition-all resize-none text-slate-700 dark:text-slate-200"
          disabled={isGenerating}
        />

        {error && <p className="text-red-500 text-sm px-2">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
            isGenerating || !prompt.trim()
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-200 dark:shadow-none"
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Kahani Ban rahi hai...
            </>
          ) : (
            <>
              <HiSparkles />
              Generate Magic Story
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AIGenerator;
