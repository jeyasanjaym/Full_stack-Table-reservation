const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  restaurantName: { type: String, required: true, trim: true },
  restaurantId: { type: Number },
  address: { type: String },
  phone: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  partySize: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['confirmed', 'cancelled', 'pending'], default: 'confirmed' },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
