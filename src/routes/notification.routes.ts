import express, { RequestHandler } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import * as notificationController from '../controllers/notification.controller.js';

const router = express.Router();

router.get(
	'/',
	authenticate as RequestHandler,
	notificationController.getNotifications as unknown as RequestHandler
);

router.get(
	'/unread-count',
	authenticate as RequestHandler,
	notificationController.getUnreadCount as unknown as RequestHandler
);

router.put(
	'/read',
	authenticate as RequestHandler,
	notificationController.markAsRead as unknown as RequestHandler
);

router.delete(
	'/:notificationId',
	authenticate as RequestHandler,
	notificationController.deleteNotification as unknown as RequestHandler
);

export default router;
