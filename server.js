require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// 🚀 CONNECT MONGO
// ========================================
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }

  // ========================================
  // ⚙️ EXPRESS CONFIG
  // ========================================
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(methodOverride('_method'));

  // ========================================
  // 💾 SESSION SETUP
  // ========================================
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 7 * 24 * 60 * 60, // Session valid for 7 days
      }),
      cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
    })
  );

  // ========================================
  // 🌍 ROUTES
  // ========================================
  app.use('/', publicRoutes); // Home, Gallery, Events, Notices
  app.use('/admin', adminRoutes); // Admin panel

  // ========================================
  // 🚫 404 HANDLER
  // ========================================
  app.use((req, res) => {
    res.status(404).render('404', {
      title: 'Page Not Found',
      url: req.originalUrl,
    });
  });

  // ========================================
  // 🟢 SERVER START
  // ========================================
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
})();
