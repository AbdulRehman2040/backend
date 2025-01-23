import express from 'express';
import {
  getNotificationsForUser,
  markNotificationsAsRead,
  deleteNotifications,
} from '../controllers/notificationController.js';

const router = express.Router();

// Route to get notifications for a user
router.get('/', getNotificationsForUser);

// Route to mark notifications as read
router.put('/read', markNotificationsAsRead);

// Route to delete notifications
router.delete('/', deleteNotifications);

export default router;
