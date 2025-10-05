const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  address: { type: String, trim: true },
  phone: { type: String, trim: true },
  description: { type: String, trim: true },
  cuisine: { type: String, trim: true },
  priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'], default: '$$' },
  openTime: { type: String },
  closeTime: { type: String },
  capacity: { type: Number, default: 50 },
  image: { type: String },
  rating: { type: Number, default: 4.5 },
  // Admin-only metadata fields (not required in user card, but used for filtering)
  locationType: { type: String, enum: ['open', 'closed', 'beach', 'hill'], default: 'open' },
  district: { type: String, trim: true },
  bestFood: { type: String, trim: true },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'any'], default: 'any' },
  // Map coordinates
  lat: { type: Number },
  lng: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
