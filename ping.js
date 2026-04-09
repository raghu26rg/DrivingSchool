import mongoose from 'mongoose';
import User from './models/User.js';

mongoose.connect('mongodb://127.0.0.1:27017/neha_driving_school').then(async () => {
  const student = await User.findOne({ role: 'student' });
  if (!student) return console.log('No student found');
  
  console.log('Before update:', student.paymentMethod);
  student.paymentMethod = 'upi';
  await student.save();
  
  const updated = await User.findById(student._id);
  console.log('After update:', updated.paymentMethod);
  
  // Clean up back to default so we don't mess up user tests completely
  updated.paymentMethod = 'pending';
  await updated.save();
  process.exit(0);
}).catch(console.error);
