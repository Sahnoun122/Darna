import type { Profile } from 'passport-google-oauth20';
import crypto from 'crypto';
import { User, IUserDocument } from '../models/user.model.js';

export class OAuthServiceError extends Error {
	public statusCode: number;
	constructor(message: string, statusCode = 400) {
		super(message);
		this.name = 'OAuthServiceError';
		this.statusCode = statusCode;
	}
}

const randomPassword = () => crypto.randomBytes(32).toString('hex');

export const upsertGoogleUser = async (profile: Profile): Promise<IUserDocument> => {
	const email = profile.emails?.[0]?.value?.toLowerCase();
	const displayName = profile.displayName || 'Google User';

	if (!email) {
		throw new OAuthServiceError(
			'Google account has no accessible email. Ask the user to grant email scope.'
		);
	}

	let user = await User.findOne({ email });
	if (user) {
		return user;
	}

	user = new User({
		username: displayName,
		email,
		password: randomPassword(),
		plan: 'basic',
		twoFA: false,
	});

	await user.save();
	return user;
};
