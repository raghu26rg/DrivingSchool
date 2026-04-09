import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

dotenv.config();

mongoose.connect('mongodb://127.0.0.1:27017/neha_driving_school').then(async () => {
  const admin = await User.findOne({ role: 'admin' });
  const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
  
  console.log('Simulating Admin Requests...');

  // Get students
  const studentsRes = await fetch('http://localhost:5000/api/students', {
      headers: { Authorization: `Bearer ${token}` }
  });
  const students = await studentsRes.json();
  const student = students.find(s => s.role === 'student');
  
  console.log(`Initial GET /students -> ${student.name} paymentMethod:`, student.paymentMethod);
  
  // Update
  console.log('Sending PUT /students/:id with { paymentMethod: "card", totalFee: 5000, paidAmount: 2000 }');
  const putRes = await fetch(`http://localhost:5000/api/students/${student._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ paymentMethod: 'card', totalFee: 5000, paidAmount: 2000 })
  });
  const putData = await putRes.json();
  console.log('PUT Response raw:', JSON.stringify(putData));

  // Final Get
  const finalRes = await fetch('http://localhost:5000/api/students', {
      headers: { Authorization: `Bearer ${token}` }
  });
  const finalStudents = await finalRes.json();
  const finalStudent = finalStudents.find(s => s.role === 'student');
  console.log(`Final GET /students -> ${finalStudent.name} paymentMethod:`, finalStudent.paymentMethod);
  console.log(`Final GET /students -> ${finalStudent.name} totalFee:`, finalStudent.totalFee);
  
  // reset to pending
  await fetch(`http://localhost:5000/api/students/${student._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ paymentMethod: 'pending', totalFee: 0, paidAmount: 0 })
  });

  process.exit(0);
}).catch(console.error);
