import { Server, Socket } from 'socket.io';
import Thread from '../models/thread.model.js';
import Message from '../models/message.model.js';
import Notification from '../models/notification.model.js';
import * as notificationService from './notification.service.js';
import mongoose from 'mongoose';

const onlineUsers = new Map<string, Set<string>>();

const sendNotificationToUser = async (
	io: Server,
	userId: string,
	type: string,
	title: string,
	message: string,
	payload: any = {},
	priority: 'low' | 'medium' | 'high' = 'medium'
) => {
	try {
		const notification = await notificationService.createNotification(
			userId,
			type,
			title,
			message,
			payload,
			priority
		);

		const userSockets = onlineUsers.get(userId);
		if (userSockets && userSockets.size > 0) {
			io.to(`user:${userId}`).emit('notification:new', {
				id: notification._id,
				type: notification.type,
				title: notification.title,
				message: notification.message,
				payload: notification.payload,
				priority: notification.priority,
				read: notification.read,
				createdAt: (notification as any).createdAt,
			});
		}

		return notification;
	} catch (error) {
		console.error('Error sending notification:', error);
	}
};

export const notifyPropertyApproved = async (
	io: Server,
	userId: string,
	propertyId: string,
	propertyTitle: string
) => {
	return sendNotificationToUser(
		io,
		userId,
		'property_approved',
		'Propriété approuvée',
		`Votre propriété "${propertyTitle}" a été approuvée`,
		{ propertyId },
		'high'
	);
};

export const notifyPropertyRejected = async (
	io: Server,
	userId: string,
	propertyId: string,
	propertyTitle: string,
	reason?: string
) => {
	return sendNotificationToUser(
		io,
		userId,
		'property_rejected',
		'Propriété rejetée',
		`Votre propriété "${propertyTitle}" a été rejetée${reason ? ` - ${reason}` : ''}`,
		{ propertyId, reason },
		'high'
	);
};

export const notifySubscriptionExpiring = async (io: Server, userId: string, daysLeft: number) => {
	return sendNotificationToUser(
		io,
		userId,
		'subscription_expiring',
		'Abonnement expire bientôt',
		`Votre abonnement expire dans ${daysLeft} jour(s)`,
		{ daysLeft },
		'medium'
	);
};

export default function socketHandler(io: Server) {
	io.on('connection', (socket: Socket) => {
		const user = socket.data.user;
		if (!user) {
			socket.disconnect();
			return;
		}
		const userId = String(user._id);

		const set = onlineUsers.get(userId) || new Set<string>();
		set.add(socket.id);
		onlineUsers.set(userId, set);

		socket.join(`user:${userId}`);

		io.emit('user:presence', { userId, online: true });

		socket.on('thread:join', async ({ threadId }: { threadId: string }) => {
			socket.join(`thread:${threadId}`);
		});

		socket.on('message:send', async (payload: any, ack?: Function) => {
			try {
				const { threadId, text, attachments = [], to } = payload;
				const thread = await Thread.findById(threadId);
				if (!thread) throw new Error('Thread not found');

				const recipients =
					to && to.length ? to : thread.participants.map((p: any) => String(p));
				const recObjIds = recipients.map((r: string) => new mongoose.Types.ObjectId(r));

				const message = await Message.create({
					threadId: new mongoose.Types.ObjectId(threadId),
					from: new mongoose.Types.ObjectId(userId),
					to: recObjIds,
					text,
					attachments,
				});

				thread.lastMessage = message._id as mongoose.Types.ObjectId;
				await thread.save();

				io.to(`thread:${threadId}`).emit('message:new', { message });

				for (const r of recipients) {
					if (String(r) !== userId) {
						const sockets = onlineUsers.get(String(r));
						if (sockets && sockets.size > 0) {
							message.deliveredTo.push(new mongoose.Types.ObjectId(r));
						} else {
							await sendNotificationToUser(
								io,
								String(r),
								'new_message',
								'Nouveau message',
								'Vous avez reçu un nouveau message',
								{ threadId, from: userId, messageId: message._id },
								'medium'
							);
						}
					}
				}
				await message.save();

				if (ack) ack({ status: 'ok', message });
			} catch (err: any) {
				if (ack) ack({ status: 'error', message: err.message });
			}
		});

		socket.on(
			'message:read',
			async ({ threadId, messageIds }: { threadId: string; messageIds: string[] }) => {
				try {
					const objIds = messageIds.map((id) => new mongoose.Types.ObjectId(id));
					await Message.updateMany(
						{ _id: { $in: objIds } },
						{ $addToSet: { readBy: new mongoose.Types.ObjectId(userId) } }
					);
					io.to(`thread:${threadId}`).emit('message:read:update', {
						threadId,
						messageIds,
						userId,
					});
				} catch (err) {
					console.error('message:read error', err);
				}
			}
		);

		socket.on('typing', ({ threadId, isTyping }: { threadId: string; isTyping: boolean }) => {
			socket.to(`thread:${threadId}`).emit('typing', { userId, isTyping });
		});

		socket.on('notification:get', async (ack?: Function) => {
			try {
				const notifications = await notificationService.getNotificationsByUser(userId);
				const formattedNotifications = notifications.map((notif) => ({
					id: notif._id,
					type: notif.type,
					title: notif.title,
					message: notif.message,
					payload: notif.payload,
					priority: notif.priority,
					read: notif.read,
					createdAt: (notif as any).createdAt,
				}));

				if (ack) ack({ status: 'ok', notifications: formattedNotifications });
			} catch (err: any) {
				if (ack) ack({ status: 'error', message: err.message });
			}
		});

		socket.on(
			'notification:read',
			async ({ notificationIds }: { notificationIds: string[] }, ack?: Function) => {
				try {
					const result = await notificationService.markNotificationsAsRead(
						userId,
						notificationIds
					);

					socket.to(`user:${userId}`).emit('notification:read', { notificationIds });

					if (ack) ack({ status: 'ok', modifiedCount: result.modifiedCount });
				} catch (err: any) {
					if (ack) ack({ status: 'error', message: err.message });
				}
			}
		);

		socket.on('notification:unread-count', async (ack?: Function) => {
			try {
				const count = await notificationService.getUnreadCount(userId);
				if (ack) ack({ status: 'ok', unreadCount: count });
			} catch (err: any) {
				if (ack) ack({ status: 'error', message: err.message });
			}
		});

		socket.on(
			'lead:create',
			async ({ propertyId, sellerId }: { propertyId: string; sellerId: string }) => {
				try {
					let thread = await Thread.findOne({
						property: propertyId,
						participants: {
							$all: [
								new mongoose.Types.ObjectId(userId),
								new mongoose.Types.ObjectId(sellerId),
							],
						},
					});
					if (!thread) {
						thread = await Thread.create({
							property: propertyId ? new mongoose.Types.ObjectId(propertyId) : undefined,
							participants: [
								new mongoose.Types.ObjectId(userId),
								new mongoose.Types.ObjectId(sellerId),
							],
							createBy: new mongoose.Types.ObjectId(userId),
						});
					}
					const sysMsg = await Message.create({
						threadId: thread._id,
						from: new mongoose.Types.ObjectId(userId),
						to: [new mongoose.Types.ObjectId(sellerId)],
						text: 'Lead created',
						isSystem: true,
					});
					io.to(`user:${sellerId}`).emit('lead:new', { thread, sysMsg });

					await sendNotificationToUser(
						io,
						sellerId,
						'new_lead',
						'Nouveau lead',
						'Un utilisateur est intéressé par votre propriété',
						{ propertyId, buyerId: userId, threadId: thread._id },
						'high'
					);
				} catch (err) {
					console.error('lead:create error', err);
				}
			}
		);

		socket.on('disconnect', () => {
			const s = onlineUsers.get(userId);
			if (s) {
				s.delete(socket.id);
				if (s.size === 0) {
					onlineUsers.delete(userId);
					io.emit('user:presence', { userId, online: false });
				} else {
					onlineUsers.set(userId, s);
				}
			}
		});
	});
}
