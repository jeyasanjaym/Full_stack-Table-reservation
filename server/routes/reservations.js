const express = require('express');
const auth = require('../middleware/auth');
const Reservation = require('../models/Reservation');

const router = express.Router();

// GET /api/reservations - list current user's reservations (seed on first call)
router.get('/', auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id }).sort({ date: 1 });
    res.json({ reservations });
  } catch (err) {
    console.error('Get reservations error:', err);
    res.status(500).json({ message: 'Failed to get reservations' });
  }
});

// POST /api/reservations - create a reservation
router.post('/', auth, async (req, res) => {
  try {
    const body = req.body;
    const reservation = await Reservation.create({
      user: req.user._id,
      hotel: body.hotel || undefined,
      restaurantName: body.restaurantName,
      restaurantId: body.restaurantId,
      address: body.address,
      phone: body.phone,
      date: new Date(body.date),
      time: body.time,
      partySize: body.partySize,
      status: body.status || 'confirmed',
    });
    res.status(201).json({ reservation });
  } catch (err) {
    console.error('Create reservation error:', err);
    res.status(500).json({ message: 'Failed to create reservation' });
  }
});

// PUT /api/reservations/:id - update status or fields
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const reservation = await Reservation.findOneAndUpdate(
      { _id: id, user: req.user._id },
      update,
      { new: true }
    );
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    res.json({ reservation });
  } catch (err) {
    console.error('Update reservation error:', err);
    res.status(500).json({ message: 'Failed to update reservation' });
  }
});

// DELETE /api/reservations/:id - delete reservation
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Reservation.deleteOne({ _id: id, user: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Reservation not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete reservation error:', err);
    res.status(500).json({ message: 'Failed to delete reservation' });
  }
});

// DELETE /api/reservations - delete ALL reservations of current user
router.delete('/', auth, async (req, res) => {
  try {
    const result = await Reservation.deleteMany({ user: req.user._id });
    res.json({ success: true, deleted: result.deletedCount });
  } catch (err) {
    console.error('Bulk delete reservations error:', err);
    res.status(500).json({ message: 'Failed to clear reservations' });
  }
});

module.exports = router;
