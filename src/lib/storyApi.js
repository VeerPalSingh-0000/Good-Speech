import { randomStories } from "../data/stories/randomStories.js";
import {
  fetchRandomStory as fetchFromFirestore,
  fetchStoriesByLanguage as fetchStoriesByLanguageFirestore,
} from "./firestoreStoryApi.js";
  // Project Gutenberg blocks cross-origin requests (CORS), so we rely on Firestore or local fallback

// Helper to get local story fallback
const getLocalStory = (languageCode) => {
  const languageStories = randomStories[languageCode];
  if (languageStories && languageStories.length > 0) {
    const randomIndex = Math.floor(Math.random() * languageStories.length);
    return languageStories[randomIndex];
  }
  return null;
};

// Fetch a random 15-minute story by language
export const fetchRandomStory = async (languageCode) => {

  // If Gutendex failed or not English, try Firestore
  try {
    const story = await fetchFromFirestore(languageCode);
    return story;
  } catch (firebaseError) {
    console.warn("Firebase fetch failed, falling back to local stories:", firebaseError.message);
    
    // Fallback to local hardcoded stories (randomStories.js)
    const localStory = getLocalStory(languageCode);
    if (localStory) return localStory;
    
    throw new Error(`Could not load story for language: ${languageCode}. No local stories available.`);
  }
};

// Optional: Fetch multiple stories for a language
export const fetchStoriesByLanguage = async (languageCode, count = 5) => {
  const languageStories = randomStories[languageCode];

  // Try Firestore first for multiple
  try {
    const { stories } = await fetchStoriesByLanguageFirestore(languageCode, count);
    return stories.length > 0 ? stories : (languageStories ? languageStories.slice(0, count) : []);
  } catch (firebaseError) {
    console.warn("Firebase fetch failed, using local stories:", firebaseError);
    return languageStories ? languageStories.slice(0, count) : [];
  }
};
