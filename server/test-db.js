const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testDatabase() {
  try {
    console.log('Testing MongoDB connection...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Test creating a user
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123',
      loginMethod: 'email'
    });

    console.log('Testing user creation...');
    await testUser.save();
    console.log('✅ User created successfully:', testUser.toJSON());

    // Clean up - delete test user
    await User.deleteOne({ email: 'test@example.com' });
    console.log('✅ Test user cleaned up');

    // Test Google user creation
    const testGoogleUser = new User({
      name: 'Test Google User',
      email: 'testgoogle@example.com',
      googleId: 'test_google_123',
      loginMethod: 'google'
    });

    console.log('Testing Google user creation...');
    await testGoogleUser.save();
    console.log('✅ Google user created successfully:', testGoogleUser.toJSON());

    // Clean up - delete test Google user
    await User.deleteOne({ email: 'testgoogle@example.com' });
    console.log('✅ Test Google user cleaned up');

    console.log('🎉 All database tests passed!');

  } catch (error) {
    console.error('❌ Database test failed:', error);
    console.error('Error details:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

testDatabase();
