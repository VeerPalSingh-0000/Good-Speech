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
  if (ts.seconds) return new Date(ts.seconds * 1000);    // plain object
  return new Date(ts);                                   // string / number
};

export const formatTime = (date) =>
  date ? date.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }) : '';

export const formatDate = (date) =>
  date ? date.toLocaleDateString('hi-IN') : '';

/* ---------- CRUD ---------- */

export const addResult = async (userId, type, data) => {
  const valid = ['sounds', 'varnmala', 'stories'];
  if (!userId || !valid.includes(type)) {
    throw new Error('Invalid user or type');
  }

  const ref = await addDoc(collection(db, 'results'), {
    userId,
    type,
    ...data,
    timestamp: serverTimestamp()
  });

  return ref.id;
};

export const updateResult = (id, data) =>
  updateDoc(doc(db, 'results', id), { ...data, updatedAt: serverTimestamp() });

export const deleteResult = (id) => deleteDoc(doc(db, 'results', id));

/* ---------- read helpers (shared by get + realtime) ---------- */

const massageSnapshot = (snap) => {
  const results = { sounds: [], varnmala: [], stories: [] };

  snap.forEach((d) => {
    const raw = d.data();
    const dateObj = toDate(raw.timestamp);

    const record = {
      id: d.id,
      ...raw,
      // derived / formatted fields used by the UI
      timestampMs: dateObj ? dateObj.getTime() : 0,
      formattedTime: formatTime(dateObj),
      date: formatDate(dateObj)
    };

    if (results[record.type]) results[record.type].push(record);
  });

  return results;
};

/* ---------- one-off read ---------- */

export const getResults = async (userId) => {
  const q = query(
    collection(db, 'results'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );
  const snap = await getDocs(q);
  return massageSnapshot(snap);
};

/* ---------- realtime listener ---------- */

export const subscribeToResults = (userId, cb) => {
  if (typeof cb !== 'function') return () => {};
  if (!userId) {
    cb({ sounds: [], varnmala: [], stories: [] });
    return () => {};
  }

  const q = query(
    collection(db, 'results'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(
    q,
    (snap) => cb(massageSnapshot(snap)),
    (err) => {
      console.error(err);
      cb({ sounds: [], varnmala: [], stories: [] });
    }
  );
};
