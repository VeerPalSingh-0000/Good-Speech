import { randomStories } from "../data/stories/randomStories.js";
import {
  fetchRandomStory as fetchFromFirestore,
  fetchStoriesByLanguage as fetchStoriesByLanguageFirestore,
} from "./firestoreStoryApi.js";

// Fetch a random 15-minute story by language
export const fetchRandomStory = async (languageCode) => {
  const languageStories = randomStories[languageCode];

  // Prefer local story data so editor changes are reflected immediately.
  if (languageStories && languageStories.length > 0) {
    const randomIndex = Math.floor(Math.random() * languageStories.length);
    return languageStories[randomIndex];
  }

  try {
    // Try Firebase first
    try {
      const story = await fetchFromFirestore(languageCode);
      return story;
    } catch (firebaseError) {
      console.warn(
        "Firebase fetch failed, falling back to local stories:",
        firebaseError.message,
      );
      // Fall back to local stories if Firebase unavailable
      throw firebaseError;
    }
  } catch (error) {
    console.error("Error fetching story:", error);
    throw new Error(
      `Could not load story for language: ${languageCode}. No local stories available.`,
    );
  }
};

// Optional: Fetch multiple stories for a language
export const fetchStoriesByLanguage = async (languageCode, count = 5) => {
  const languageStories = randomStories[languageCode];

  // Prefer local stories so source file edits show up immediately.
  if (languageStories && languageStories.length > 0) {
    return languageStories.slice(0, count);
  }

  try {
    // Try Firebase first
    try {
      const { stories } = await fetchStoriesByLanguageFirestore(
        languageCode,
        count,
      );
      return stories;
    } catch (firebaseError) {
      console.warn(
        "Firebase fetch failed, using local stories:",
        firebaseError,
      );
      // Fall back to local stories if Firebase unavailable
      throw firebaseError;
    }
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    return [];
  }
};
