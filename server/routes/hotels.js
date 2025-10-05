const express = require('express');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const Hotel = require('../models/Hotel');

const router = express.Router();

// Public: list hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    res.json({ hotels });
  } catch (err) {
    console.error('List hotels error:', err);
    res.status(500).json({ message: 'Failed to list hotels' });
  }
});

// Public: hotel details
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json({ hotel });
  } catch (err) {
    console.error('Get hotel error:', err);
    res.status(500).json({ message: 'Failed to get hotel' });
  }
});

// Admin: create hotel
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ hotel });
  } catch (err) {
    console.error('Create hotel error:', err);
    res.status(500).json({ message: 'Failed to create hotel' });
  }
});

// Admin: update hotel
router.put('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json({ hotel });
  } catch (err) {
    console.error('Update hotel error:', err);
    res.status(500).json({ message: 'Failed to update hotel' });
  }
});

// Admin: delete hotel
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const result = await Hotel.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Hotel not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete hotel error:', err);
    res.status(500).json({ message: 'Failed to delete hotel' });
  }
});

module.exports = router;
