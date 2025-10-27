import express, { Request, Response } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import * as notificationController from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/', authenticate, notificationController.getNotifications);

router.get('/unread-count', authenticate, notificationController.getUnreadCount);

router.put('/read', authenticate, notificationController.markAsRead);

router.delete('/:notificationId', authenticate, notificationController.deleteNotification);

export default router;
