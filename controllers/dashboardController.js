import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Schedule from '../models/Schedule.js';

// @desc    Get dashboard metrics
// @route   GET /api/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeStudents = await User.countDocuments({ role: 'student', status: 'active' });
    const completedStudents = await User.countDocuments({ role: 'student', status: 'completed' });
    
    // Total classes scheduled today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const todayAttendance = await Attendance.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    res.json({
      totalStudents,
      activeStudents,
      completedStudents,
      todayAttendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
