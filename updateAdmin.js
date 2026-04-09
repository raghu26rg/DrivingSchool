import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/neha_driving_school';

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: node updateAdmin.js <existing_phone> <new_password> [new_name]');
  console.log('Example: node updateAdmin.js 9989195761 MyNewPass123 "Soumya Updated"');
  process.exit(1);
}

const [phone, newPassword, newName] = args;

const updateAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    
    // Find the admin
    const admin = await User.findOne({ phone, role: 'admin' });
    
    if (!admin) {
      console.log(`❌ Admin with phone ${phone} does not exist!`);
      process.exit(1);
    }

    // Hash the new password and update
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.password = hashedPassword;
    
    if (newName) {
        admin.name = newName;
    }

    await admin.save();

    console.log(`\n✅ Admin updated successfully!`);
    console.log(`Phone: ${admin.phone}`);
    console.log(`New Password: ${newPassword}`);
    console.log(`Name: ${admin.name}`);
    console.log(`\nLog in at http://localhost:5173/login\n`);
    
    process.exit();
  } catch (error) {
    console.error('Error updating admin:', error.message);
    process.exit(1);
  }
};

updateAdmin();
