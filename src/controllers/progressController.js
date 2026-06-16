const express = require('express');
const router = express.Router();
const { verifyToken } = require('./authController');
const { initializeFirebase } = require('../config/firebase');

initializeFirebase();

// POST /api/progress/save - Save class session result
router.post('/save', verifyToken, async (req, res) => {
  try {
    const { getDb } = require('../config/firebase');
    const db = getDb();
    const { group, grade, topic, activity, score, totalQuestions, correct, duration } = req.body;

    const sessionData = {
      teacherId: req.user.uid,
      teacherEmail: req.user.email,
      group,
      grade,
      topic,
      activity,
      score,
      totalQuestions,
      correct,
      duration,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };

    const ref = await db.collection('sessions').add(sessionData);
    res.json({ success: true, sessionId: ref.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/progress/history - Get teacher's session history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const { getDb } = require('../config/firebase');
    const db = getDb();
    const { group, limit = 50 } = req.query;

    let query = db.collection('sessions')
      .where('teacherId', '==', req.user.uid)
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit));

    if (group) query = query.where('group', '==', group);

    const snap = await query.get();
    const sessions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/progress/stats - Aggregate stats by group
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const { getDb } = require('../config/firebase');
    const db = getDb();
    const snap = await db.collection('sessions')
      .where('teacherId', '==', req.user.uid)
      .orderBy('timestamp', 'desc')
      .limit(200)
      .get();

    const sessions = snap.docs.map(d => d.data());

    // Aggregate by group and topic
    const stats = {};
    sessions.forEach(s => {
      if (!stats[s.group]) stats[s.group] = { sessions: 0, topics: {}, totalScore: 0 };
      stats[s.group].sessions++;
      stats[s.group].totalScore += s.score || 0;
      if (!stats[s.group].topics[s.topic]) stats[s.group].topics[s.topic] = { count: 0, avgScore: 0 };
      stats[s.group].topics[s.topic].count++;
      stats[s.group].topics[s.topic].avgScore = Math.round(
        (stats[s.group].topics[s.topic].avgScore * (stats[s.group].topics[s.topic].count - 1) + (s.score || 0)) /
        stats[s.group].topics[s.topic].count
      );
    });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;