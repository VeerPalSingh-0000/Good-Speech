import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebase';

// Add data to Firestore
export const addResult = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'results'), {
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

// Get all results
export const getResults = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'results'));
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
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

// Real-time listener
export const subscribeToResults = (callback) => {
  return onSnapshot(collection(db, 'results'), (querySnapshot) => {
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    callback(results);
  });
};
