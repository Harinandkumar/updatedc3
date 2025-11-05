const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Notice = require('../models/Notice');
const Setting = require('../models/Setting'); // ✅ Added for Exam toggle system

// 🔒 Middleware
function ensureAdmin(req, res, next) {
  if (req.session.admin) return next();
  res.redirect('/admin/login');
}

// 🧠 Login
router.get('/login', (req, res) => res.render('admin/login'));

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    req.session.admin = true;
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { error: 'Invalid credentials' });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// 📊 Dashboard
router.get('/dashboard', ensureAdmin, async (req, res) => {
  const eventCount = await Event.countDocuments();
  const noticeCount = await Notice.countDocuments();
  res.render('admin/dashboard', { eventCount, noticeCount });
});

// 🎉 Events
router.get('/events', ensureAdmin, async (req, res) => {
  const events = await Event.find().sort({ date: -1 });
  res.render('admin/events', { events });
});

router.post('/events', ensureAdmin, async (req, res) => {
  await Event.create(req.body);
  res.redirect('/admin/events');
});

router.post('/events/delete/:id', ensureAdmin, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.redirect('/admin/events');
});

// 📢 Notices
router.get('/notices', ensureAdmin, async (req, res) => {
  const notices = await Notice.find().sort({ date: -1 });
  res.render('admin/notices', { notices });
});

router.post('/notices', ensureAdmin, async (req, res) => {
  await Notice.create(req.body);
  res.redirect('/admin/notices');
});

router.post('/notices/delete/:id', ensureAdmin, async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.redirect('/admin/notices');
});


// ⚙️ ==========================
// 🧠 Exam Live Toggle System
// ==========================
router.get('/settings', ensureAdmin, async (req, res) => {
  try {
    const examSetting = await Setting.findOne({ key: 'examLive' });
    const examLive = examSetting?.value || false;
    res.render('admin/settings', { examLive });
  } catch (err) {
    console.error('Error loading settings:', err);
    res.render('admin/settings', { examLive: false });
  }
});

router.post('/settings/toggle-exam', ensureAdmin, async (req, res) => {
  try {
    const current = await Setting.findOne({ key: 'examLive' });
    const newValue = !(current?.value || false);

    await Setting.findOneAndUpdate(
      { key: 'examLive' },
      { value: newValue },
      { upsert: true }
    );

    res.redirect('/admin/settings');
  } catch (err) {
    console.error('Error updating exam status:', err);
    res.redirect('/admin/settings');
  }
});
// ✏️ Edit event
router.post('/events/edit/:id', ensureAdmin, async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/admin/events');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating event");
  }
});

module.exports = router;
