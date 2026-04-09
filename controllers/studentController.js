import User from '../models/User.js';
import mongoose from 'mongoose';

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).populate('schedule').populate('trainingType');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin
export const createStudent = async (req, res) => {
  const { name, phone, trainingType, vehicleAssigned, instructorName, scheduleId, totalFee, paidAmount, paymentMethod } = req.body;

  try {
    const userExists = await User.findOne({ phone });

    if (userExists) {
      if (userExists.role === 'admin') {
        return res.status(400).json({ message: 'An Admin account already uses this phone number' });
      }
      return res.status(400).json({ message: 'A Student with this phone number already exists' });
    }

    const student = await User.create({
      role: 'student',
      name,
      phone,
      trainingType,
      vehicleAssigned,
      instructorName,
      schedule: scheduleId || null,
      daysCompleted: 0,
      totalDays: req.body.totalDays || 26,
      status: 'active',
      totalFee: totalFee || 0,
      paidAmount: paidAmount || 0,
      paymentMethod: paymentMethod || 'pending'
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
export const updateStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (student && student.role === 'student') {
      student.name = req.body.name || student.name;
      student.phone = req.body.phone || student.phone;
      student.trainingType = req.body.trainingType || student.trainingType;
      student.vehicleAssigned = req.body.vehicleAssigned !== undefined ? req.body.vehicleAssigned : student.vehicleAssigned;
      student.instructorName = req.body.instructorName !== undefined ? req.body.instructorName : student.instructorName;
      
      if (req.body.scheduleId !== undefined) {
        student.schedule = req.body.scheduleId;
      }
      student.status = req.body.status || student.status;
      
      if (req.body.daysCompleted !== undefined) student.daysCompleted = req.body.daysCompleted;
      if (req.body.totalDays !== undefined) student.totalDays = req.body.totalDays;
      if (req.body.totalFee !== undefined) student.totalFee = req.body.totalFee;
      if (req.body.paidAmount !== undefined) student.paidAmount = req.body.paidAmount;
      if (req.body.paymentMethod !== undefined) student.paymentMethod = req.body.paymentMethod;

      const updatedStudent = await student.save();
      res.json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete student (or mark inactive)
// @route   DELETE /api/students/:id
// @access  Private/Admin
export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (student && student.role === 'student') {
      // Clean up associated attendance records first
      await mongoose.model('Attendance').deleteMany({ student: student._id });
      
      // Delete the student
      await User.findByIdAndDelete(student._id);
      
      res.json({ message: 'Student removed' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
