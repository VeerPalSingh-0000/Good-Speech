// Firestore Story API - Queries and functions for story data
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
  startAfter,
  updateDoc,
  increment,
  writeBatch,
  collectionGroup,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// Cache configuration
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const storyCache = new Map();

// Utility: Check if cache is valid
const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

/**
 * Fetch a random 15-minute story by language code
 * Falls back to local data if Firestore is unavailable
 */
export const fetchRandomStory = async (languageCode) => {
  try {
    const storiesRef = collection(db, "stories");
    // Query stories by language only - accept any duration
    const q = query(storiesRef, where("language", "==", languageCode));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error(`No stories found for language: ${languageCode}`);
    }

    // Get random story from results
    const stories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const randomIndex = Math.floor(Math.random() * stories.length);
    return stories[randomIndex];
  } catch (error) {
    console.error("Error fetching story from Firestore:", error);
    throw new Error(
      `Could not load story for language ${languageCode}: ${error.message}`,
    );
  }
};

/**
 * Fetch multiple stories for a language with pagination
 */
export const fetchStoriesByLanguage = async (
  languageCode,
  limit_count = 20,
  lastDoc = null,
) => {
  try {
    const storiesRef = collection(db, "stories");
    let q;

    if (lastDoc) {
      q = query(
        storiesRef,
        where("language", "==", languageCode),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(limit_count),
      );
    } else {
      q = query(
        storiesRef,
        where("language", "==", languageCode),
        orderBy("createdAt", "desc"),
        limit(limit_count),
      );
    }

    const querySnapshot = await getDocs(q);
    const stories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return stories and last document for pagination
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { stories, lastVisible };
  } catch (error) {
    console.error("Error fetching stories by language from Firestore:", error);
    throw error;
  }
};

/**
 * Fetch stories by category and language
 */
export const fetchStoriesByCategory = async (
  category,
  languageCode,
  limit_count = 20,
) => {
  try {
    const storiesRef = collection(db, "stories");
    const q = query(
      storiesRef,
      where("category", "==", category),
      where("language", "==", languageCode),
      orderBy("createdAt", "desc"),
      limit(limit_count),
    );

    const querySnapshot = await getDocs(q);
    const stories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return stories;
  } catch (error) {
    console.error("Error fetching stories by category from Firestore:", error);
    throw error;
  }
};

/**
 * Search stories by title or keywords
 */
export const searchStories = async (searchQuery, languageCode = null) => {
  try {
    // Note: Full-text search requires Firestore extensions or algolia
    // For now, fetch and filter on client-side (suitable for 1000s of stories)
    const storiesRef = collection(db, "stories");

    let q;
    if (languageCode) {
      q = query(
        storiesRef,
        where("language", "==", languageCode),
        limit(100), // Limit results for performance
      );
    } else {
      q = query(storiesRef, limit(500));
    }

    const querySnapshot = await getDocs(q);
    const allStories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Client-side filtering and search
    const searchLower = searchQuery.toLowerCase();
    const results = allStories.filter(
      (story) =>
        story.title?.toLowerCase().includes(searchLower) ||
        story.author?.toLowerCase().includes(searchLower) ||
        story.category?.toLowerCase().includes(searchLower) ||
        story.metadata?.keywords?.some((kw) =>
          kw.toLowerCase().includes(searchLower),
        ),
    );

    return results;
  } catch (error) {
    console.error("Error searching stories:", error);
    throw error;
  }
};

/**
 * Fetch all available languages with story count
 */
export const fetchLanguages = async () => {
  try {
    // Check cache first
    const cacheKey = "languages";
    if (
      storyCache.has(cacheKey) &&
      isCacheValid(storyCache.get(cacheKey).timestamp)
    ) {
      return storyCache.get(cacheKey).data;
    }

    const languagesRef = collection(db, "languages");
    const querySnapshot = await getDocs(languagesRef);

    const languages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Cache the result
    storyCache.set(cacheKey, { data: languages, timestamp: Date.now() });

    return languages;
  } catch (error) {
    console.error("Error fetching languages:", error);
    throw error;
  }
};

/**
 * Fetch all available categories
 */
export const fetchCategories = async () => {
  try {
    // Check cache first
    const cacheKey = "categories";
    if (
      storyCache.has(cacheKey) &&
      isCacheValid(storyCache.get(cacheKey).timestamp)
    ) {
      return storyCache.get(cacheKey).data;
    }

    const categoriesRef = collection(db, "categories");
    const querySnapshot = await getDocs(categoriesRef);

    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Cache the result
    storyCache.set(cacheKey, { data: categories, timestamp: Date.now() });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Rate a story (0-5 stars)
 */
export const rateStory = async (storyId, rating) => {
  try {
    if (rating < 0 || rating > 5) {
      throw new Error("Rating must be between 0 and 5");
    }

    const storyRef = doc(db, "stories", storyId);
    await updateDoc(storyRef, {
      rating: rating,
      updatedAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error("Error rating story:", error);
    throw error;
  }
};

/**
 * Get story statistics (for analytics)
 */
export const getStoryStats = async () => {
  try {
    const storiesRef = collection(db, "stories");
    const querySnapshot = await getDocs(storiesRef);

    const stats = {
      totalStories: querySnapshot.size,
      byLanguage: {},
      byCategory: {},
    };

    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();

      // Count by language
      const lang = data.language || "unknown";
      stats.byLanguage[lang] = (stats.byLanguage[lang] || 0) + 1;

      // Count by category
      const cat = data.category || "unknown";
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error("Error getting story statistics:", error);
    throw error;
  }
};

/**
 * Batch upload stories to Firestore
 * Useful for importing large collections
 */
export const batchUploadStories = async (storiesArray) => {
  try {
    const batch = writeBatch(db);
    const storiesRef = collection(db, "stories");

    storiesArray.forEach((story) => {
      const docRef = doc(
        storiesRef,
        story.id || `story_${Date.now()}_${Math.random()}`,
      );
      batch.set(docRef, {
        ...story,
        createdAt: story.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rating: story.rating || 0,
      });
    });

    await batch.commit();
    console.log(`Successfully uploaded ${storiesArray.length} stories`);
    return true;
  } catch (error) {
    console.error("Error batch uploading stories:", error);
    throw error;
  }
};

/**
 * Clear cache (useful for refreshing data)
 */
export const clearCache = () => {
  storyCache.clear();
  console.log("Story cache cleared");
};
