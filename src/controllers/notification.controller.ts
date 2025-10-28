import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const userId = req.userId!;
		const limit = parseInt(req.query.limit as string) || 50;

		const notifications = await notificationService.getNotificationsByUser(userId, limit);

		res.status(200).json({
			success: true,
			notifications: notifications.map((notif) => ({
				id: notif._id,
				type: notif.type,
				title: notif.title,
				message: notif.message,
				payload: notif.payload,
				read: notif.read,
				priority: notif.priority,
				createdAt: (notif as any).createdAt,
			})),
		});
	} catch (err: any) {
		console.error('Get notifications error:', err);
		res.status(500).json({ success: false, message: err.message });
	}
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const userId = req.userId!;
		const { notificationIds } = req.body;

		if (!Array.isArray(notificationIds)) {
			return res.status(400).json({
				success: false,
				message: 'notificationIds must be an array',
			});
		}

		const result = await notificationService.markNotificationsAsRead(userId, notificationIds);

		res.status(200).json({
			success: true,
			modifiedCount: result.modifiedCount,
		});
	} catch (err: any) {
		console.error('Mark as read error:', err);
		res.status(500).json({ success: false, message: err.message });
	}
};

export const getUnreadCount = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const userId = req.userId!;
		const count = await notificationService.getUnreadCount(userId);

		res.status(200).json({
			success: true,
			unreadCount: count,
		});
	} catch (err: any) {
		console.error('Get unread count error:', err);
		res.status(500).json({ success: false, message: err.message });
	}
};

export const deleteNotification = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const userId = req.userId!;
		const { notificationId } = req.params;

		const result = await notificationService.deleteNotification(userId, notificationId);

		if (result.deletedCount === 0) {
			return res.status(404).json({
				success: false,
				message: 'Notification not found',
			});
		}

		res.status(200).json({
			success: true,
			message: 'Notification deleted',
		});
	} catch (err: any) {
		console.error('Delete notification error:', err);
		res.status(500).json({ success: false, message: err.message });
	}
};
