import { Schema, model, Document } from 'mongoose';

export interface IPlan extends Document {
	name: string;
	price: number;
	currency: string;
	durationDays: number;
	features: string[];
	active: boolean;
	metadata?: Record<string, any>;
}

const PlanSchema = new Schema<IPlan>(
	{
		name: { type: String, required: true, trim: true, unique: true },
		price: { type: Number, required: true, default: 0 },
		currency: { type: String, default: 'MAD' },
		durationDays: { type: Number, required: true, default: 30 },
		features: [{ type: String }],
		active: { type: Boolean, default: true },
		metadata: { type: Schema.Types.Mixed },
	},
	{ timestamps: true }
);

const Plan = model<IPlan>('Plan', PlanSchema);
export default Plan;
