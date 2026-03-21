const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
const session  = require('express-session');
const MongoStore = require('connect-mongo').default;const app  = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/foodshare_db';

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'foodshare_secret_123',
  resave: false,
  saveUninitialized: false,
store: MongoStore.create({ mongoUrl: MONGO_URI }),  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 7 din
}));
// ── Auth Middleware ──────────────────────────────────
const requireLogin = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect('/login');
};

const requireAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') return next();
  res.redirect('/login');
};

// ── Routes ──────────────────────────────────────────────
app.use('/api/food',   require('./routes/food'));
app.use('/api/claims', require('./routes/claims'));
app.use('/api/auth',   require('./routes/auth'));

// ── Serve HTML pages ────────────────────────────────────
app.get('/',          (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/donor',     requireLogin, (_, res) => res.sendFile(path.join(__dirname, 'public', 'donor.html')));
app.get('/browse',    requireLogin, (_, res) => res.sendFile(path.join(__dirname, 'public', 'browse.html')));
app.get('/myclaims',  requireLogin, (_, res) => res.sendFile(path.join(__dirname, 'public', 'myclaims.html')));
app.get('/history',   requireLogin, (_, res) => res.sendFile(path.join(__dirname, 'public', 'history.html')));
app.get('/login',     (_, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/signup',    (_, res) => res.sendFile(path.join(__dirname, 'public', 'signup.html')));
app.get('/admin',     requireAdmin, (_, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
// ── MongoDB ─────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB Error:', err.message));