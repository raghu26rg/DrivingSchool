import express from 'express';
import { authAdmin, requestStudentOtp, verifyStudentOtp, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/admin/login', authAdmin);
router.post('/student/request-otp', requestStudentOtp);
router.post('/student/verify-otp', verifyStudentOtp);
router.get('/me', protect, getMe);

export default router;
