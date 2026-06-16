// public/js/firebase-init.js
// Firebase SDK v9 (modular) via CDN - loaded as module

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged }
  from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, doc, getDoc, setDoc, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

// ⚠️ REPLACE with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBCnS1iqVBMNUKxzq1zkTm2mj8Cyd_Dga4",
  authDomain: "proyecto-a6934.firebaseapp.com",
  projectId: "proyecto-a6934",
  storageBucket: "proyecto-a6934.firebasestorage.app",
  messagingSenderId: "647670693192",
  appId: "1:647670693192:web:a09e945a21c1115a24877d",
  measurementId: "G-S1VC63408F"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===== AUTH SERVICE =====
export const AuthService = {
  async login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  },

  async logout() {
    await signOut(auth);
  },

  onAuthChange(cb) {
    return onAuthStateChanged(auth, cb);
  },

  currentUser() {
    return auth.currentUser;
  },

  async getToken() {
    const user = auth.currentUser;
    if (!user) return null;
    return user.getIdToken();
  }
};

// ===== TEACHER SERVICE =====
export const TeacherService = {
  async getProfile(uid) {
    const snap = await getDoc(doc(db, 'teachers', uid));
    return snap.exists() ? { uid, ...snap.data() } : null;
  },

  async saveProfile(uid, data) {
    await setDoc(doc(db, 'teachers', uid), data, { merge: true });
  }
};

// ===== PROGRESS SERVICE =====
export const ProgressService = {
  async saveSession(sessionData) {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const data = {
      ...sessionData,
      teacherId: user.uid,
      teacherEmail: user.email,
      timestamp: Date.now(),
      date: new Date().toISOString()
    };
    const ref = await addDoc(collection(db, 'sessions'), data);
    return ref.id;
  },

  async getHistory(teacherId, groupFilter = null, maxItems = 50) {
    let q = query(
      collection(db, 'sessions'),
      where('teacherId', '==', teacherId),
      orderBy('timestamp', 'desc'),
      limit(maxItems)
    );
    const snap = await getDocs(q);
    const sessions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (groupFilter) return sessions.filter(s => s.group === groupFilter);
    return sessions;
  },

  async getStats(teacherId) {
    const sessions = await this.getHistory(teacherId, null, 200);
    const stats = {};
    sessions.forEach(s => {
      if (!stats[s.group]) stats[s.group] = { sessions: 0, topics: {}, totalScore: 0, grade: s.grade };
      stats[s.group].sessions++;
      stats[s.group].totalScore += s.score || 0;
      if (!stats[s.group].topics[s.topic]) {
        stats[s.group].topics[s.topic] = { count: 0, scores: [] };
      }
      stats[s.group].topics[s.topic].count++;
      stats[s.group].topics[s.topic].scores.push(s.score || 0);
    });
    // Compute averages
    Object.values(stats).forEach(g => {
      g.avgScore = g.sessions > 0 ? Math.round(g.totalScore / g.sessions) : 0;
      Object.values(g.topics).forEach(t => {
        t.avgScore = t.scores.length > 0 ? Math.round(t.scores.reduce((a, b) => a + b, 0) / t.scores.length) : 0;
      });
    });
    return stats;
  }
};

// Export Firebase instances for direct use
export { auth, db };