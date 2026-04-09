import express from 'express';
import { markAttendance, getAttendance, getStudentAttendance } from '../controllers/attendanceController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, markAttendance)
  .get(protect, getAttendance);

// Fetch a single student's attendance log (Admin only)
router.route('/student/:id')
  .get(protect, adminOnly, getStudentAttendance);

export default router;
