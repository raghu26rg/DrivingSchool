import express from 'express';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../controllers/studentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, adminOnly, getStudents)
  .post(protect, adminOnly, createStudent);

router.route('/:id')
  .put(protect, adminOnly, updateStudent)
  .delete(protect, adminOnly, deleteStudent);

export default router;
