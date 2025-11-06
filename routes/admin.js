const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Notice = require('../models/Notice');
const Setting = require('../models/Setting');
const CoderOfMonth = require('../models/CoderOfMonth');
const TopWinner = require('../models/TopWinner'); // ✅ new model for Top 3 winners

// 🔒 Middleware
function ensureAdmin(req, res, next) {
  if (req.session.admin) return next();
  res.redirect('/admin/login');
}

// 🧠 LOGIN ROUTES
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

// 📊 DASHBOARD
router.get('/dashboard', ensureAdmin, async (req, res) => {
  try {
    const [eventCount, noticeCount, coderCount, winnersCount, setting] = await Promise.all([
      Event.countDocuments(),
      Notice.countDocuments(),
      CoderOfMonth.countDocuments(),
      TopWinner.countDocuments(),
      Setting.findOne({ key: 'examLive' }),
    ]);

    const examLive = setting?.value || false;

    res.render('admin/dashboard', {
      eventCount,
      noticeCount,
      coderCount,
      winnersCount,
      examLive,
    });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.render('admin/dashboard', {
      eventCount: 0,
      noticeCount: 0,
      coderCount: 0,
      winnersCount: 0,
      examLive: false,
    });
  }
});


// 🎉 EVENTS MANAGEMENT
router.get('/events', ensureAdmin, async (req, res) => {
  const events = await Event.find().sort({ date: -1 });
  res.render('admin/events', { events });
});

router.post('/events', ensureAdmin, async (req, res) => {
  await Event.create(req.body);
  res.redirect('/admin/events');
});

router.post('/events/edit/:id', ensureAdmin, async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/admin/events');
});

router.post('/events/delete/:id', ensureAdmin, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.redirect('/admin/events');
});


// 📢 NOTICES MANAGEMENT
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


// ⚙️ EXAM LIVE TOGGLE SYSTEM
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


// 👑 CODER OF THE MONTH MANAGEMENT
router.get('/coders', ensureAdmin, async (req, res) => {
  try {
    const coders = await CoderOfMonth.find().sort({ createdAt: -1 });
    res.render('admin/coders', { coders });
  } catch (err) {
    console.error('Error loading coders:', err);
    res.status(500).send('Error loading coders');
  }
});

router.post('/coders', ensureAdmin, async (req, res) => {
  try {
    const { name, roll, achievement, image, month } = req.body;
    await CoderOfMonth.create({ name, roll, achievement, image, month });
    res.redirect('/admin/coders');
  } catch (err) {
    console.error('Error adding coder:', err);
    res.status(500).send('Error adding coder');
  }
});

router.post('/coders/edit/:id', ensureAdmin, async (req, res) => {
  try {
    await CoderOfMonth.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/admin/coders');
  } catch (err) {
    console.error('Error updating coder:', err);
    res.status(500).send('Error updating coder');
  }
});

router.post('/coders/delete/:id', ensureAdmin, async (req, res) => {
  try {
    await CoderOfMonth.findByIdAndDelete(req.params.id);
    res.redirect('/admin/coders');
  } catch (err) {
    console.error('Error deleting coder:', err);
    res.status(500).send('Error deleting coder');
  }
});


// 🏆 TOP 3 WINNERS MANAGEMENT
// 🏆 EVENT-WISE TOP 3 WINNERS MANAGEMENT
router.get('/winners', ensureAdmin, async (req, res) => {
  try {
    const winners = await TopWinner.find().sort({ date: -1 });
    res.render('admin/winners', { winners });
  } catch (err) {
    console.error('Error loading winners:', err);
    res.status(500).send('Error loading winners');
  }
});

router.post('/winners', ensureAdmin, async (req, res) => {
  try {
    const { eventName, firstName, firstRoll, secondName, secondRoll, thirdName, thirdRoll } = req.body;

    const winners = [
      { position: "1st", name: firstName, roll: firstRoll },
      { position: "2nd", name: secondName, roll: secondRoll },
      { position: "3rd", name: thirdName, roll: thirdRoll },
    ];

    await TopWinner.create({ eventName, winners });
    res.redirect('/admin/winners');
  } catch (err) {
    console.error('Error adding winners:', err);
    res.status(500).send('Error adding winners');
  }
});

router.post('/winners/delete/:id', ensureAdmin, async (req, res) => {
  try {
    await TopWinner.findByIdAndDelete(req.params.id);
    res.redirect('/admin/winners');
  } catch (err) {
    console.error('Error deleting winner:', err);
    res.status(500).send('Error deleting winner');
  }
});


module.exports = router;
