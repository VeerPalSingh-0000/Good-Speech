// firestoreService.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

/* ---------- helpers ---------- */

export const toDate = (ts) => {
  if (!ts) return null;
  if (ts instanceof Date) return ts;
  if (ts instanceof Timestamp) return ts.toDate();
  if (ts.seconds) return new Date(ts.seconds * 1000);
  if (typeof ts === 'string' || typeof ts === 'number') return new Date(ts);
  return null;
};

export const formatTime = (date) => {
  if (!date) return 'N/A';
  
  try {
    const validDate = date instanceof Date ? date : new Date(date);
    if (isNaN(validDate.getTime())) return 'N/A';
    
    return validDate.toLocaleTimeString('hi-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    console.error('Time formatting error:', error);
    return 'N/A';
  }
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  try {
    const validDate = date instanceof Date ? date : new Date(date);
    if (isNaN(validDate.getTime())) return 'N/A';
    
    return validDate.toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'N/A';
  }
};

// Clean data helper - removes undefined values and validates structure
const cleanData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Data must be a valid object');
  }
  
  // Remove undefined values (Firestore doesn't allow them)
  const cleaned = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // Convert Date objects to timestamps for Firestore
      if (value instanceof Date) {
        cleaned[key] = value;
      } else {
        cleaned[key] = value;
      }
    }
  });
  
  return cleaned;
};

/* ---------- CRUD ---------- */

export const addResult = async (userId, type, data) => {
  try {
    // Input validation
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (!type) {
      throw new Error('Type is required');
    }
    
    const validTypes = ['sounds', 'varnmala', 'stories'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid type '${type}'. Must be one of: ${validTypes.join(', ')}`);
    }
    
    // Check if Firebase is initialized
    if (!db) {
      throw new Error('Firebase database not initialized');
    }
    
    // Clean and validate data
    const cleanedData = cleanData(data || {});
    
    // Create document with current timestamp
    const docData = {
      userId,
      type,
      ...cleanedData,
      timestamp: serverTimestamp(),
      createdAt: serverTimestamp(),
      // Add a client-side timestamp as backup
      clientTimestamp: new Date()
    };
    
    console.log('Saving to Firestore:', docData);
    
    const ref = await addDoc(collection(db, 'results'), docData);
    
    console.log('Document saved with ID:', ref.id);
    return ref.id;
    
  } catch (error) {
    console.error('Error in addResult:', error);
    
    // Re-throw with more specific error messages
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied: Check Firestore security rules');
    } else if (error.code === 'unavailable') {
      throw new Error('Firebase service temporarily unavailable');
    } else if (error.code === 'unauthenticated') {
      throw new Error('User not authenticated');
    } else if (error.code === 'invalid-argument') {
      throw new Error('Invalid data provided to Firestore');
    } else {
      throw error;
    }
  }
};

export const updateResult = async (id, data) => {
  try {
    if (!id) {
      throw new Error('Document ID is required');
    }
    
    const cleanedData = cleanData(data || {});
    const updateData = {
      ...cleanedData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(doc(db, 'results', id), updateData);
    console.log('Document updated:', id);
    
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteResult = async (id) => {
  try {
    if (!id) {
      throw new Error('Document ID is required');
    }
    
    await deleteDoc(doc(db, 'results', id));
    console.log('Document deleted:', id);
    
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

/* ---------- read helpers (shared by get + realtime) ---------- */

const massageSnapshot = (snap) => {
  const results = { sounds: [], varnmala: [], stories: [] };

  snap.forEach((d) => {
    try {
      const raw = d.data();
      console.log('Raw document data:', { id: d.id, data: raw }); // Debug log
      
      // Try multiple timestamp sources
      let dateObj = null;
      if (raw.timestamp) {
        dateObj = toDate(raw.timestamp);
      } else if (raw.clientTimestamp) {
        dateObj = toDate(raw.clientTimestamp);
      } else if (raw.createdAt) {
        dateObj = toDate(raw.createdAt);
      } else if (raw.date) {
        dateObj = toDate(raw.date);
      }

      // Fallback to current date if no timestamp found
      if (!dateObj || isNaN(dateObj.getTime())) {
        console.warn('No valid timestamp found for document:', d.id);
        dateObj = new Date();
      }

      const record = {
        id: d.id,
        ...raw,
        // Ensure these fields are always populated with valid values
        timestampMs: dateObj.getTime(),
        formattedTime: formatTime(dateObj),
        date: formatDate(dateObj),
        // Add readable timestamp for debugging
        debugTimestamp: dateObj.toISOString(),
        // Keep original for reference
        originalTimestamp: raw.timestamp
      };

      console.log('Processed record:', { 
        id: record.id, 
        type: record.type, 
        date: record.date, 
        formattedTime: record.formattedTime 
      });

      if (record.type && results[record.type]) {
        results[record.type].push(record);
      } else {
        console.warn('Invalid record type or missing type:', record.type);
      }
    } catch (error) {
      console.error('Error processing document:', d.id, error);
    }
  });

  console.log('Final results:', results); // Debug log
  return results;
};

/* ---------- one-off read ---------- */

export const getResults = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    console.log('Getting results for user:', userId);
    
    const q = query(
      collection(db, 'results'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const snap = await getDocs(q);
    console.log('Query snapshot size:', snap.size);
    
    return massageSnapshot(snap);
    
  } catch (error) {
    console.error('Error getting results:', error);
    throw error;
  }
};

/* ---------- realtime listener ---------- */

export const subscribeToResults = (userId, cb) => {
  if (typeof cb !== 'function') {
    console.error('Callback must be a function');
    return () => {};
  }

  if (!userId) {
    console.error('User ID is required');
    cb({ sounds: [], varnmala: [], stories: [] });
    return () => {};
  }

  console.log('Setting up realtime listener for user:', userId);

  try {
    const q = query(
      collection(db, 'results'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(
      q,
      (snap) => {
        try {
          console.log('Realtime update - snapshot size:', snap.size);
          cb(massageSnapshot(snap));
        } catch (error) {
          console.error('Error processing snapshot:', error);
          cb({ sounds: [], varnmala: [], stories: [] });
        }
      },
      (err) => {
        console.error('Firestore listener error:', err);
        
        if (err.code === 'permission-denied') {
          console.error('Permission denied - check Firestore security rules');
        } else if (err.code === 'unavailable') {
          console.warn('Firestore temporarily unavailable');
        }
        
        cb({ sounds: [], varnmala: [], stories: [] });
      }
    );
  } catch (error) {
    console.error('Error setting up listener:', error);
    cb({ sounds: [], varnmala: [], stories: [] });
    return () => {};
  }
};

// Utility function for debugging
export const testFirebaseConnection = async () => {
  try {
    const testQuery = query(collection(db, 'results'), where('userId', '==', 'test'));
    await getDocs(testQuery);
    console.log('Firebase connection successful');
    return true;
  } catch (error) {
    console.error('Firebase connection failed:', error);
    return false;
  }
};

// Helper function to format timestamps for display
export const getDisplayDate = (timestamp) => {
  const date = toDate(timestamp);
  return formatDate(date);
};

export const getDisplayTime = (timestamp) => {
  const date = toDate(timestamp);
  return formatTime(date);
};
