import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

// @desc    Mark attendance (Student self-marks)
// @route   POST /api/attendance
// @access  Private/Student
export const markAttendance = async (req, res) => {
  try {
    const studentId = req.user._id;
    
    // Check if attendance already marked for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      student: studentId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    const attendance = await Attendance.create({
      student: studentId,
      date: new Date(),
      status: 'present' // Or whatever logic from body: req.body.status
    });

    // Update student days completed count
    const student = await User.findById(studentId);
    if (student) {
      student.daysCompleted += 1;
      // If daysCompleted >= totalDays, we might want to auto-mark status as 'completed'
      if (student.daysCompleted >= student.totalDays) {
        student.status = 'completed';
      }
      await student.save();
    }

    res.status(201).json(attendance);
  } catch (error) {
    if (error.code === 11000) {
       return res.status(400).json({ message: 'Attendance already marked for today' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance records (Admin views all, Student views own)
// @route   GET /api/attendance
// @access  Private
export const getAttendance = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query = { student: req.user._id };
    } else if (req.user.role === 'admin' && req.query.studentId) {
      query = { student: req.query.studentId };
    }

    const records = await Attendance.find(query)
      .populate('student', 'name phone')
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific student attendance
// @route   GET /api/attendance/student/:id
// @access  Private/Admin
export const getStudentAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.params.id })
      .populate('student', 'name phone totalDays daysCompleted status')
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
