import bcrypt from 'bcryptjs';
import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IUser {
	username: string;
	email: string;
	password: string;
	plan: string;
	twoFA: boolean;
	twoFASecret?: string | null;
	role: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
	_id: Types.ObjectId;
	comparePassword(candidate: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {}

const userSchema = new Schema<IUserDocument, IUserModel>(
	{
		username: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		plan: {
			type: String,
			required: true,
			default: 'basic',
		},
		twoFA: {
			type: Boolean,
			required: true,
			default: false,
		},
		twoFASecret: {
			type: String,
			default: null,
		},
		role: {
			type: String,
			enum: ['admin', 'regulier'],
			default: 'regulier',
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', async function hashPassword(next) {
	if (!this.isModified('password')) {
		return next();
	}

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error as Error);
	}
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
	return bcrypt.compare(candidate, this.password);
};

userSchema.set('toJSON', {
	transform: (_document, returned: any) => {
		returned.id = returned._id instanceof Types.ObjectId ? returned._id.toString() : returned._id;
		delete returned._id;
		delete (returned as { __v?: number }).__v;
		delete (returned as { password?: string }).password;
		delete (returned as { twoFASecret?: string | null }).twoFASecret;
		return returned;
	},
});

export const User = model<IUserDocument, IUserModel>('User', userSchema);
