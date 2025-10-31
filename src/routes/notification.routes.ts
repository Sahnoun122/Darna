import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import * as notificationController from '../controllers/notification.controller.js';
import { RequestHandler } from 'express';

const router = express.Router();

router.get('/', authenticate, notificationController.getNotifications as unknown as RequestHandler);

router.get(
	'/unread-count',
	authenticate,
	notificationController.getUnreadCount as unknown as RequestHandler
);

router.put('/read', authenticate, notificationController.markAsRead as unknown as RequestHandler);

router.delete(
	'/:notificationId',
	authenticate,
	notificationController.deleteNotification as unknown as RequestHandler
);

export default router;
