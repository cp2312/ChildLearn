require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
const authRoutes = require('./src/controllers/authController');
const progressRoutes = require('./src/controllers/progressController');

app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

// SPA fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
   console.log(`🎓 Santa Cruz Edu corriendo en: http://localhost:${PORT}`);
});

module.exports = app;