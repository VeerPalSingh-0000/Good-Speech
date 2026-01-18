// firestore.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc, // <--- ✅ ADD THIS IMPORT
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
      if (value instanceof Date) {
        cleaned[key] = value;
      } else {
        cleaned[key] = value;
      }
    }
  });
  
  return cleaned;
};

/* ---------- BOOKMARKS (USER SETTINGS) ---------- */
// ✅ NEW: Save user-specific settings (bookmarks)
export const saveBookmarks = async (userId, data) => {
  try {
    if (!userId) throw new Error('User ID required');
    
    // We use a specific collection 'users' and the document ID is the userId
    const userRef = doc(db, 'users', userId);
    
    // merge: true ensures we don't overwrite other fields (like profile info if you add it later)
    await setDoc(userRef, data, { merge: true });
    
  } catch (error) {
    console.error('Error saving bookmarks:', error);
    throw error;
  }
};

// ✅ NEW: Real-time listener for user settings
export const subscribeToBookmarks = (userId, cb) => {
  if (!userId) return () => {};

  const userRef = doc(db, 'users', userId);

  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      cb({
        storyBookmarks: data.storyBookmarks || [],
        lineBookmarks: data.lineBookmarks || {}
      });
    } else {
      // If user doc doesn't exist yet, return empty defaults
      cb({ storyBookmarks: [], lineBookmarks: {} });
    }
  }, (error) => {
    console.error("Error syncing bookmarks:", error);
  });
};

/* ---------- CRUD (Existing) ---------- */

export const addResult = async (userId, type, data) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!type) throw new Error('Type is required');
    
    const validTypes = ['sounds', 'varnmala', 'stories'];
    if (!validTypes.includes(type)) throw new Error(`Invalid type '${type}'`);
    if (!db) throw new Error('Firebase database not initialized');
    
    const cleanedData = cleanData(data || {});
    
    const docData = {
      userId,
      type,
      ...cleanedData,
      timestamp: serverTimestamp(),
      createdAt: serverTimestamp(),
      clientTimestamp: new Date()
    };
    
    const ref = await addDoc(collection(db, 'results'), docData);
    return ref.id;
    
  } catch (error) {
    console.error('Error in addResult:', error);
    throw error;
  }
};

export const updateResult = async (id, data) => {
  try {
    if (!id) throw new Error('Document ID is required');
    const cleanedData = cleanData(data || {});
    const updateData = { ...cleanedData, updatedAt: serverTimestamp() };
    await updateDoc(doc(db, 'results', id), updateData);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteResult = async (id) => {
  try {
    if (!id) throw new Error('Document ID is required');
    await deleteDoc(doc(db, 'results', id));
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

/* ---------- read helpers ---------- */

const massageSnapshot = (snap) => {
  const results = { sounds: [], varnmala: [], stories: [] };

  snap.forEach((d) => {
    try {
      const raw = d.data();
      let dateObj = null;
      if (raw.timestamp) dateObj = toDate(raw.timestamp);
      else if (raw.clientTimestamp) dateObj = toDate(raw.clientTimestamp);
      else if (raw.createdAt) dateObj = toDate(raw.createdAt);
      else if (raw.date) dateObj = toDate(raw.date);

      if (!dateObj || isNaN(dateObj.getTime())) {
        dateObj = new Date();
      }

      const record = {
        id: d.id,
        ...raw,
        timestampMs: dateObj.getTime(),
        formattedTime: formatTime(dateObj),
        date: formatDate(dateObj),
      };

      if (record.type && results[record.type]) {
        results[record.type].push(record);
      }
    } catch (error) {
      console.error('Error processing document:', d.id, error);
    }
  });

  return results;
};

export const getResults = async (userId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    const q = query(
      collection(db, 'results'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const snap = await getDocs(q);
    return massageSnapshot(snap);
  } catch (error) {
    console.error('Error getting results:', error);
    throw error;
  }
};

export const subscribeToResults = (userId, cb) => {
  if (typeof cb !== 'function') return () => {};
  if (!userId) {
    cb({ sounds: [], varnmala: [], stories: [] });
    return () => {};
  }

  try {
    const q = query(
      collection(db, 'results'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, (snap) => {
      cb(massageSnapshot(snap));
    }, (err) => {
      console.error('Firestore listener error:', err);
      cb({ sounds: [], varnmala: [], stories: [] });
    });
  } catch (error) {
    console.error('Error setting up listener:', error);
    cb({ sounds: [], varnmala: [], stories: [] });
    return () => {};
  }
};