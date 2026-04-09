import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const authAdmin = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone, role: 'admin' });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestStudentOtp = async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await User.findOne({ phone, role: 'student' });
    
    if (user) {
      // Mock OTP sending
      console.log(`Sending Mock OTP 1234 to ${phone}`);
      res.json({ message: 'OTP sent successfully', mockOtp: '1234' });
    } else {
      res.status(404).json({ message: 'Student not found with this phone number' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyStudentOtp = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    // In a real app, verify against cache/DB. Here we use '1234'
    if (otp !== '1234') {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    const user = await User.findOne({ phone, role: 'student' }).populate('schedule').populate('trainingType');
    
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        status: user.status,
        instructorName: user.instructorName,
        daysCompleted: user.daysCompleted,
        totalDays: user.totalDays,
        totalFee: user.totalFee,
        paidAmount: user.paidAmount,
        paymentStatus: user.paymentStatus,
        paymentMethod: user.paymentMethod,
        token: generateToken(user._id, user.role),
        schedule: user.schedule,
        trainingType: user.trainingType
      });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({
         ...user.toObject(),
         instructorName: user.instructorName, // Expose explicitly to ensure frontend state update
         paymentStatus: user.paymentStatus,
         totalFee: user.totalFee,
         paidAmount: user.paidAmount,
         paymentMethod: user.paymentMethod
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
