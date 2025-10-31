import { Schema, model, Document, Types } from 'mongoose';

export interface IMessage extends Document {
	threadId: Types.ObjectId;
	from: Types.ObjectId;
	to: Types.ObjectId[];
	text?: string;
	attachments?: { url: string; filename?: string }[];
	readBy: Types.ObjectId[];
	deliveredTo: Types.ObjectId[];
	isSystem?: boolean;
}

const AttachmentSchema = new Schema({
	url: { type: String, required: true },
	filename: { type: String },
});

const MessageSchema = new Schema<IMessage>(
	{
		threadId: { type: Schema.Types.ObjectId, ref: 'Thread', required: true },
		from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		to: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		text: { type: String },
		attachments: [AttachmentSchema],
		readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		deliveredTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		isSystem: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

MessageSchema.index({ threadId: 1, createdAt: -1 });

export default model<IMessage>('Message', MessageSchema);
