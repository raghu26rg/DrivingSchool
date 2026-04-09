import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/neha_driving_school';
const NEW_PHONE = '9390912974'; 

const changePhone = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    
    // 1. Delete the student to free up the slot
    const checkExists = await User.findOne({ phone: NEW_PHONE });
    if (checkExists && checkExists.role === 'student') {
        await User.deleteOne({ _id: checkExists._id });
        console.log(`🗑️ Deleted test student (${checkExists.name}) to free up the phone number.`);
    }

    // 2. Find the original admin
    const admin = await User.findOne({ phone: '1234567890', role: 'admin' });
    
    if (!admin) {
      console.log('Original admin (1234567890) not found. Checking if new number exists...');
      const checkNew = await User.findOne({ phone: NEW_PHONE, role: 'admin' });
      if (checkNew) console.log(`✅ Admin is already using ${NEW_PHONE}`);
      process.exit();
    }

    admin.phone = NEW_PHONE;
    
    // We also need to change the mock password for testing if requested
    // But keeping admin123 is standard for now.
    
    await admin.save();
    console.log(`✅ Admin phone successfully changed from 1234567890 to ${NEW_PHONE}`);
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

changePhone();
