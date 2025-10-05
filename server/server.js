const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reservetable';
mongoose.connect(mongoURI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Optional: seed admin from env
const User = require('./models/User');
(async () => {
  try {
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_NAME) {
      let admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
      if (!admin) {
        admin = new User({
          name: process.env.ADMIN_NAME,
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          loginMethod: 'email',
          role: 'admin'
        });
      } else {
        admin.name = process.env.ADMIN_NAME;
        if (process.env.ADMIN_PASSWORD) admin.password = process.env.ADMIN_PASSWORD;
        admin.role = 'admin';
      }
      await admin.save();
      console.log('👑 Admin ensured:', admin.email);
    }
  } catch (e) {
    console.error('Admin seed error:', e.message);
  }
})();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/admin', require('./routes/admin'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
