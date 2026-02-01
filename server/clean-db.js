const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function cleanDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Show current users
    const users = await User.find({});
    console.log(`Found ${users.length} users in database:`);
    users.forEach(user => {
      console.log(`- ${user.email} (${user.loginMethod})`);
    });

    // Remove test users and duplicates
    const testEmails = ['test@example.com', 'testgoogle@example.com', 'demo.google@example.com'];
    
    for (const email of testEmails) {
      const result = await User.deleteMany({ email });
      if (result.deletedCount > 0) {
        console.log(`✅ Removed ${result.deletedCount} user(s) with email: ${email}`);
      }
    }

    // Show remaining users
    const remainingUsers = await User.find({});
    console.log(`\nRemaining users: ${remainingUsers.length}`);
    remainingUsers.forEach(user => {
      console.log(`- ${user.email} (${user.loginMethod})`);
    });

    console.log('🎉 Database cleanup completed!');

  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

cleanDatabase();
