import Notification from '../models/notification.model.js';
import { User } from '../models/user.model.js';
import mongoose from 'mongoose';

/**
 * Service de notifications - suit la même structure que le service de messages
 */

export const createNotification = async (
	userId: string,
	type: string,
	title: string,
	message: string,
	payload: any = {},
	priority: 'low' | 'medium' | 'high' = 'medium'
) => {
	const notification = new Notification({
		user: new mongoose.Types.ObjectId(userId),
		type,
		title,
		message,
		payload,
		priority,
	});
	await notification.save();
	return notification;
};

export const getNotificationsByUser = async (userId: string, limit: number = 50) => {
	return await Notification.find({
		user: new mongoose.Types.ObjectId(userId),
	})
		.sort({ createdAt: -1 })
		.limit(limit)
		.lean();
};

export const markNotificationsAsRead = async (userId: string, notificationIds: string[]) => {
	const objIds = notificationIds.map((id) => new mongoose.Types.ObjectId(id));
	return await Notification.updateMany(
		{
			_id: { $in: objIds },
			user: new mongoose.Types.ObjectId(userId),
		},
		{ read: true }
	);
};

export const getUnreadCount = async (userId: string) => {
	return await Notification.countDocuments({
		user: new mongoose.Types.ObjectId(userId),
		read: false,
	});
};

export const deleteNotification = async (userId: string, notificationId: string) => {
	return await Notification.deleteOne({
		_id: new mongoose.Types.ObjectId(notificationId),
		user: new mongoose.Types.ObjectId(userId),
	});
};
