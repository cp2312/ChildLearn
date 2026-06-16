const express = require('express');
const router = express.Router();
const { initializeFirebase } = require('../config/firebase');

// Verify Firebase ID token middleware
async function verifyToken(req, res, next) {
  try {
    const { getAuth } = require('../config/firebase');
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = await getAuth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// GET /api/auth/profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    initializeFirebase();
    const { getDb } = require('../config/firebase');
    const db = getDb();
    const doc = await db.collection('teachers').doc(req.user.uid).get();
    if (!doc.exists) return res.status(404).json({ error: 'Teacher not found' });
    res.json({ uid: req.user.uid, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/setup-teacher — Only for initial setup
router.post('/setup-teacher', verifyToken, async (req, res) => {
  try {
    initializeFirebase();
    const { getDb } = require('../config/firebase');
    const db = getDb();
    const { name, groups } = req.body;
    await db.collection('teachers').doc(req.user.uid).set({
      name,
      email: req.user.email,
      groups: groups || [],
      createdAt: new Date().toISOString()
    }, { merge: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
module.exports.verifyToken = verifyToken;