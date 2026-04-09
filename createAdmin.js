import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/neha_driving_school';

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: node createAdmin.js <phone> <password> [name]');
  console.log('Example: node createAdmin.js 9876543210 mysecretpassword "John Doe"');
  process.exit(1);
}

const [phone, password, name = 'Admin'] = args;

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    
    const adminExists = await User.findOne({ phone, role: 'admin' });
    
    if (adminExists) {
      console.log(`An admin with phone ${phone} already exists!`);
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      role: 'admin',
      name: name,
      phone: phone,
      password: hashedPassword,
      status: 'active'
    });

    console.log(`\n🎉 Admin created successfully!`);
    console.log(`Phone: ${phone}`);
    console.log(`Password: ${password}`);
    console.log(`Name: ${name}`);
    console.log(`\nYou can now log in at http://localhost:5173/login\n`);
    
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
