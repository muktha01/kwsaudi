import Admin from '../models/Admin.js';

// Script to create a new admin user with phone-based login
// Usage: node scripts/createAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URI_PROD || '';

async function createAdmin() {
  await mongoose.connect(MONGO_URI);

  const phoneNumber = '9552567681';
  const password = 'Lokesh@123';
  const email = 'lokesh@admin.com';
  const firstName = 'Lokesh';
  const lastName = 'Admin';

  // Check if admin already exists
  const existing = await Admin.findOne({ phoneNumber });
  if (existing) {
    console.log('Admin already exists:', existing);
    process.exit(0);
  }

  const admin = new Admin({
    firstName,
    lastName,
    email,
    phoneNumber,
    password, // Will be hashed by pre-save hook
    role: 'admin',
    isActive: true
  });
  await admin.save();
  console.log('Admin created:', admin);
  process.exit(0);
}

createAdmin().catch(err => {
  console.error('Error creating admin:', err);
  process.exit(1);
});
