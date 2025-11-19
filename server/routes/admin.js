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

// POST /api/admin/promote/:userId
router.post('/promote/:userId', auth, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User promoted to admin successfully',
      user: user.toJSON()
    });
  } catch (err) {
    console.error('Promote user error:', err);
    res.status(500).json({ message: 'Failed to promote user' });
  }
});

module.exports = router;
