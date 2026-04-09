import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
} from '../controllers/scheduleController.js';

const router = express.Router();

router.route('/')
  .get(protect, adminOnly, getSchedules)
  .post(protect, adminOnly, createSchedule);

router.route('/:id')
  .put(protect, adminOnly, updateSchedule)
  .delete(protect, adminOnly, deleteSchedule);

export default router;
