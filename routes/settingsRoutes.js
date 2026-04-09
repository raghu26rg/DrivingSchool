import express from 'express';
import { getSettings, createSetting, updateSetting, deleteSetting } from '../controllers/settingsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, adminOnly, getSettings)
  .post(protect, adminOnly, createSetting);

router.route('/:id')
  .put(protect, adminOnly, updateSetting)
  .delete(protect, adminOnly, deleteSetting);

export default router;
