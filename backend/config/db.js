/**
 * ============================================================
 * Database Configuration (MongoDB Atlas Connection)
 * ============================================================
 * This file handles connecting our Node/Express backend to
 * MongoDB Atlas using the Mongoose ODM library.
 *
 * Rules:
 * - We connect ONLY to MongoDB Atlas (cloud database).
 * - All credentials come from .env (process.env.MONGODB_URI).
 * - If credentials are not yet set or invalid, a helpful message
 *   is printed instead of an unhandled crash.
 * ============================================================
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // Check if URI exists or is still the template placeholder
  if (!uri || uri.includes('your_username') || uri.includes('your_password')) {
    console.warn('\n⚠️  [MongoDB Warning]: MONGODB_URI in backend/.env is still set to the placeholder string.');
    console.warn('👉 Please update backend/.env with your real MongoDB Atlas connection string:');
    console.warn('   mongodb+srv://<user>:<password>@cluster0.mongodb.net/digital_legacy_db?retryWrites=true&w=majority\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      // Modern mongoose options are enabled by default in Mongoose v8+
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    });

    console.log(`\n🔮 [MongoDB Atlas Connected]: ${conn.connection.host}`);
    console.log(`   Database Name: ${conn.connection.name}\n`);
    return true;
  } catch (error) {
    console.error(`\n❌ [MongoDB Connection Error]: ${error.message}`);
    console.warn('👉 Check your IP Whitelist (Network Access: 0.0.0.0/0) and credentials in MongoDB Atlas.\n');
    return false;
  }
};

module.exports = connectDB;
