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
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

// Add data to Firestore with user ID
export const addResult = async (userId, type, data) => {
  try {
    const docRef = await addDoc(collection(db, 'results'), {
      userId,
      type, // 'sounds', 'varnmala', or 'stories'
      ...data,
      timestamp: new Date()
    });
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
};

// Get all results for a specific user
export const getResults = async (userId) => {
  try {
    const q = query(
      collection(db, 'results'), 
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const results = {
      sounds: [],
      varnmala: [],
      stories: []
    };
    
    querySnapshot.forEach((doc) => {
      const data = { id: doc.id, ...doc.data() };
      if (data.type && results[data.type]) {
        results[data.type].push(data);
      }
    });
    
    return results;
  } catch (error) {
    console.error('Error getting documents: ', error);
    throw error;
  }
};

// Update a result
export const updateResult = async (id, data) => {
  try {
    const docRef = doc(db, 'results', id);
    await updateDoc(docRef, data);
    console.log('Document updated');
  } catch (error) {
    console.error('Error updating document: ', error);
    throw error;
  }
};

// Delete a result
export const deleteResult = async (id) => {
  try {
    await deleteDoc(doc(db, 'results', id));
    console.log('Document deleted');
  } catch (error) {
    console.error('Error deleting document: ', error);
    throw error;
  }
};

// Real-time listener with proper error handling
export const subscribeToResults = (userId, callback) => {
  // Add validation for callback function
  if (typeof callback !== 'function') {
    console.error('Callback must be a function');
    return () => {};
  }

  if (!userId) {
    console.error('User ID is required');
    callback({ sounds: [], varnmala: [], stories: [] });
    return () => {};
  }

  try {
    const q = query(
      collection(db, 'results'), 
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const results = {
        sounds: [],
        varnmala: [],
        stories: []
      };
      
      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        if (data.type && results[data.type]) {
          results[data.type].push(data);
        }
      });
      
      callback(results);
    }, (error) => {
      console.error('Error in real-time listener: ', error);
      callback({ sounds: [], varnmala: [], stories: [] });
    });
  } catch (error) {
    console.error('Error setting up listener: ', error);
    callback({ sounds: [], varnmala: [], stories: [] });
    return () => {};
  }
};
