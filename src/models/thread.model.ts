import { Schema, model, Document, Types } from 'mongoose';

export interface IThread extends Document {
	property?: Types.ObjectId;
	participants: Types.ObjectId[];
	lastMessage?: Types.ObjectId;
	createBy?: Types.ObjectId;
	unreadCounts?: Map<string, number>;
}

const ThreadSchema = new Schema<IThread>(
	{
		property: { type: Schema.Types.ObjectId, ref: 'Property' },
		participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
		createBy: { type: Schema.Types.ObjectId, ref: 'User' },
		unreadCounts: { type: Map, of: Number, default: {} },
	},
	{ timestamps: true }
);

ThreadSchema.index({ participants: 1 });

export default model<IThread>('Thread', ThreadSchema);
