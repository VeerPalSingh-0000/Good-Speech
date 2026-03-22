// src/lib/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the SDK. 
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateQuickStory = async (language = "Hindi") => {
  try {
    // We use gemini-2.5-flash as it is the fastest and best for standard text generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `Write a creative, engaging, and easy-to-read short story in ${language}. 
    The story should take about 15 minutes to read aloud (roughly 1500 to 2000 words). 
    Do not include a title or markdown formatting, just return the plain text of the story. 
    Make the vocabulary suitable for someone practicing their speaking and pronunciation skills.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Failed to generate story. Please try again.");
  }
};