const express = require('express');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Reservation = require('../models/Reservation');

const router = express.Router();

// GET /api/admin/dashboard/summary
router.get('/dashboard/summary', auth, requireAdmin, async (req, res) => {
  try {
    const [users, hotels, reservations] = await Promise.all([
      User.countDocuments({}),
      Hotel.countDocuments({}),
      Reservation.countDocuments({})
    ]);

    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate()+1);

    const todayLogins = await User.countDocuments({ lastLogin: { $gte: today, $lt: tomorrow } });

    res.json({ users, hotels, reservations, todayLogins });
  } catch (err) {
    console.error('Admin summary error:', err);
    res.status(500).json({ message: 'Failed to load summary' });
  }
});

// GET /api/admin/hotels/:id/reservations
router.get('/hotels/:id/reservations', auth, requireAdmin, async (req, res) => {
  try {
    const list = await Reservation.find({ hotel: req.params.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ reservations: list });
  } catch (err) {
    console.error('Admin hotel reservations error:', err);
    res.status(500).json({ message: 'Failed to load hotel reservations' });
  }
});

module.exports = router;
