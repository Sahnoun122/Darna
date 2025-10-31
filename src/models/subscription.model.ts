import { Schema, model, Document, Types } from 'mongoose';
import { IPlan } from './plan.model';
import { IUser } from './user.model';

export interface ISubscription extends Document {
	user: Types.ObjectId | IUser;
	plan: Types.ObjectId | IPlan;
	startedAt: Date;
	expiresAt: Date;
	status: 'active' | 'cancelled' | 'expired';
	provider?: string;
	providerSubscriptionId?: string;
}

const SubscriptionSchema = new Schema<ISubscription>(
	{
		user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		plan: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
		startedAt: { type: Date, default: Date.now },
		expiresAt: { type: Date, required: true },
		status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
		provider: { type: String },
		providerSubscriptionId: { type: String },
	},
	{ timestamps: true }
);

export default model<ISubscription>('Subscription', SubscriptionSchema);
