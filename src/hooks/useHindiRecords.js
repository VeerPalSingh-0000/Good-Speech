// src/features/hindi/hooks/useHindiRecords.js

import { useState, useEffect, useCallback } from 'react';
import { addResult, subscribeToResults, deleteResult } from '../../firestore'; // Adjust path if needed

export const useHindiRecords = (user, showNotification) => {
  const [records, setRecords] = useState({ sounds: [], varnmala: [], stories: [] });
  const [isLoading, setIsLoading] = useState(true);

  // ✅ NEW: State for managing bookmarks
  const [storyBookmarks, setStoryBookmarks] = useState([]);
  const [lineBookmarks, setLineBookmarks] = useState({});

  // ✅ NEW: Effect to load bookmarks from Local Storage when the hook loads
  useEffect(() => {
    try {
      const savedStoryBookmarks = JSON.parse(localStorage.getItem('storyBookmarks')) || [];
      const savedLineBookmarks = JSON.parse(localStorage.getItem('lineBookmarks')) || {};
      setStoryBookmarks(savedStoryBookmarks);
      setLineBookmarks(savedLineBookmarks);
    } catch (error) {
      console.error("Failed to load bookmarks from local storage", error);
    }
  }, []);

  // ✅ NEW: Effect to save bookmarks to Local Storage whenever they change
  useEffect(() => {
    localStorage.setItem('storyBookmarks', JSON.stringify(storyBookmarks));
  }, [storyBookmarks]);

  useEffect(() => {
    localStorage.setItem('lineBookmarks', JSON.stringify(lineBookmarks));
  }, [lineBookmarks]);


  // ✅ NEW: Function to toggle a story bookmark
  const toggleStoryBookmark = useCallback((storyId) => {
    setStoryBookmarks(prev => {
      const isBookmarked = prev.includes(storyId);
      if (isBookmarked) {
        showNotification("Story bookmark removed.", "info");
        return prev.filter(id => id !== storyId);
      } else {
        showNotification("Story bookmarked!", "success");
        return [...prev, storyId];
      }
    });
  }, [showNotification]);

  // ✅ NEW: Function to toggle a line bookmark within a story
  const toggleLineBookmark = useCallback((storyId, lineIndex) => {
    setLineBookmarks(prev => {
      const storyLineBookmarks = prev[storyId] || [];
      const isLineBookmarked = storyLineBookmarks.includes(lineIndex);
      let updatedLineBookmarks;

      if (isLineBookmarked) {
        updatedLineBookmarks = storyLineBookmarks.filter(idx => idx !== lineIndex);
      } else {
        updatedLineBookmarks = [...storyLineBookmarks, lineIndex].sort((a, b) => a - b);
      }

      return {
        ...prev,
        [storyId]: updatedLineBookmarks,
      };
    });
  }, []);


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

  // ✅ NEW: Update the return statement to include all new state and functions
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