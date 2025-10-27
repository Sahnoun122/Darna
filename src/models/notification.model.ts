import mongoose, { Document } from 'mongoose';

export interface INotification extends Document {
	user: mongoose.Types.ObjectId;
	type:
		| 'new_message'
		| 'new_lead'
		| 'subscription_expiring'
		| 'property_approved'
		| 'property_rejected'
		| 'property_deleted';
	title: string;
	message: string;
	payload: any;
	read: boolean;
	priority: 'low' | 'medium' | 'high';
}

const NotificationSchema = new mongoose.Schema<INotification>(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		type: {
			type: String,
			required: true,
			enum: [
				'new_message',
				'new_lead',
				'subscription_expiring',
				'property_approved',
				'property_rejected',
				'property_deleted',
			],
		},
		title: { type: String, required: true },
		message: { type: String, required: true },
		payload: { type: Object, default: {} },
		read: { type: Boolean, default: false },
		priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
	},
	{ timestamps: true }
);

NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, read: 1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
