const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app  = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/foodshare_db';

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Routes ──────────────────────────────────────────────
app.use('/api/food',   require('./routes/food'));
app.use('/api/claims', require('./routes/claims'));

// ── Serve HTML pages ────────────────────────────────────
app.get('/',          (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/donor',     (_, res) => res.sendFile(path.join(__dirname, 'public', 'donor.html')));
app.get('/browse',    (_, res) => res.sendFile(path.join(__dirname, 'public', 'browse.html')));
app.get('/myclaims',  (_, res) => res.sendFile(path.join(__dirname, 'public', 'myclaims.html')));
app.get('/history',   (_, res) => res.sendFile(path.join(__dirname, 'public', 'history.html')));

// ── MongoDB ─────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB Error:', err.message));
