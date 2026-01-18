// src/hooks/useHindiRecords.js

import { useState, useEffect, useCallback } from 'react';
// ✅ Import the new functions
import { addResult, subscribeToResults, deleteResult, subscribeToBookmarks, saveBookmarks } from '../../firestore'; 

export const useHindiRecords = (user, showNotification) => {
  const [records, setRecords] = useState({ sounds: [], varnmala: [], stories: [] });
  const [isLoading, setIsLoading] = useState(true);

  // State for bookmarks
  const [storyBookmarks, setStoryBookmarks] = useState([]);
  const [lineBookmarks, setLineBookmarks] = useState({});

  // 1. SYNC: Fetch/Subscribe to RECORDS (Existing)
  useEffect(() => {
    if (user?.uid) {
      setIsLoading(true);
      const unsubscribe = subscribeToResults(user.uid, (data) => {
        setRecords(data);
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // 2. SYNC: Fetch/Subscribe to BOOKMARKS (New)
  useEffect(() => {
    if (user?.uid) {
      // This listener connects to the "users/{uid}" document
      // It will fire whenever ANY device updates the bookmarks
      const unsubscribe = subscribeToBookmarks(user.uid, (data) => {
        setStoryBookmarks(data.storyBookmarks);
        setLineBookmarks(data.lineBookmarks);
      });
      return () => unsubscribe();
    } else {
      // Reset if no user
      setStoryBookmarks([]);
      setLineBookmarks({});
    }
  }, [user]);

  // ACTION: Toggle Story Bookmark
  const toggleStoryBookmark = useCallback(async (storyId) => {
    if (!user?.uid) return;

    // Calculate new state based on current state
    let newBookmarks;
    if (storyBookmarks.includes(storyId)) {
      newBookmarks = storyBookmarks.filter(id => id !== storyId);
      showNotification("Story bookmark removed.", "info");
    } else {
      newBookmarks = [...storyBookmarks, storyId];
      showNotification("Story bookmarked!", "success");
    }

    // 1. Optimistic Update (Immediate UI change)
    setStoryBookmarks(newBookmarks);

    // 2. Persist to Cloud
    try {
      await saveBookmarks(user.uid, { storyBookmarks: newBookmarks });
    } catch (error) {
      console.error("Failed to save bookmark to cloud", error);
      // Optional: Revert state here if save fails
      showNotification("Failed to sync bookmark.", "error");
    }
  }, [storyBookmarks, user, showNotification]);

  // ACTION: Toggle Line Bookmark
  const toggleLineBookmark = useCallback(async (storyId, lineIndex) => {
    if (!user?.uid) return;

    const currentStoryLines = lineBookmarks[storyId] || [];
    let updatedStoryLines;

    if (currentStoryLines.includes(lineIndex)) {
      updatedStoryLines = currentStoryLines.filter(idx => idx !== lineIndex);
    } else {
      updatedStoryLines = [...currentStoryLines, lineIndex].sort((a, b) => a - b);
    }

    const newLineBookmarks = {
      ...lineBookmarks,
      [storyId]: updatedStoryLines
    };

    // 1. Optimistic Update
    setLineBookmarks(newLineBookmarks);

    // 2. Persist to Cloud
    try {
      await saveBookmarks(user.uid, { lineBookmarks: newLineBookmarks });
    } catch (error) {
      console.error("Failed to save line bookmark to cloud", error);
    }
  }, [lineBookmarks, user]);

  const saveToFirebase = useCallback(async (type, data) => {
    if (user?.uid) {
      try {
        await addResult(user.uid, type, data);
      } catch (error) {
        showNotification(`Failed to save ${type} data to cloud.`, "error");
        console.error("Firebase save error:", error);
      }
    }
  }, [user, showNotification]);

  const deleteRecordFromFirebase = useCallback(async (recordId) => {
      if (user?.uid && recordId) {
        try {
          await deleteResult(recordId);
          showNotification("रिकॉर्ड हटा दिया गया", "success");
        } catch(error) {
          showNotification("रिकॉर्ड हटाने में त्रुटि", "error");
          console.error("Error deleting record:", error);
        }
      }
  }, [user, showNotification]);

  return { 
    records, 
    isLoading, 
    saveToFirebase, 
    deleteRecord: deleteRecordFromFirebase,
    storyBookmarks,
    lineBookmarks,
    toggleStoryBookmark,
    toggleLineBookmark
  };
};