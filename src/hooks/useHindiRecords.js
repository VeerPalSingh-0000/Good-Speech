// src/features/hindi/hooks/useHindiRecords.js

import { useState, useEffect, useCallback } from 'react';
import { addResult, subscribeToResults, deleteResult } from '../../firestore'; // Adjust path if needed

export const useHindiRecords = (user, showNotification) => {
  const [records, setRecords] = useState({ sounds: [], varnmala: [], stories: [] });
  const [isLoading, setIsLoading] = useState(true);

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
      // Handle guest user data from local storage if needed
      setIsLoading(false);
    }
  }, [user]);

  return { records, isLoading, saveToFirebase, deleteRecord: deleteRecordFromFirebase };
};