import QRCode from 'qrcode';
import speakeasy from 'speakeasy';
import { User } from '../models/user.model.js';

export class TwoFAServiceError extends Error {
	public statusCode: number;

	constructor(message: string, statusCode = 400) {
		super(message);
		this.name = 'TwoFAServiceError';
		this.statusCode = statusCode;
	}
}

export interface InitiateTwoFAResult {
	secret: string;
	otpauthUrl: string;
	qrCodeDataUrl: string;
}

const getIssuer = () => process.env.TWO_FA_ISSUER?.trim() || 'Darna';

const getQrCode = async (otpauthUrl: string): Promise<string> => {
	try {
		return await QRCode.toDataURL(otpauthUrl);
	} catch (error) {
		throw new TwoFAServiceError('Failed to generate QR code', 500);
	}
};

class TwoFAService {
	async initiateSetup(userId: string): Promise<InitiateTwoFAResult> {
		const user = await User.findById(userId);

		if (!user) {
			throw new TwoFAServiceError('User not found', 404);
		}

		if (user.twoFA) {
			throw new TwoFAServiceError('Two-factor authentication already enabled', 409);
		}

		const issuer = getIssuer();
		const secret = speakeasy.generateSecret({
			length: 32,
			name: `${issuer}:${user.email}`,
			issuer,
		});

		user.twoFASecret = secret.base32;
		user.twoFA = false;
		await user.save();

		if (!secret.otpauth_url) {
			throw new TwoFAServiceError('Failed to create otpauth url', 500);
		}

		const qrCodeDataUrl = await getQrCode(secret.otpauth_url);

		return {
			secret: secret.base32,
			otpauthUrl: secret.otpauth_url,
			qrCodeDataUrl,
		};
	}

	async verifySetupToken(userId: string, token: string): Promise<boolean> {
		const user = await User.findById(userId);

		if (!user) {
			throw new TwoFAServiceError('User not found', 404);
		}

		if (!user.twoFASecret) {
			throw new TwoFAServiceError('Two-factor authentication not initialized', 400);
		}

		const isValid = speakeasy.totp.verify({
			secret: user.twoFASecret,
			encoding: 'base32',
			token,
			window: 1,
		});

		if (!isValid) {
			return false;
		}

		user.twoFA = true;
		await user.save();
		return true;
	}

	async verifyLoginToken(userId: string, token: string): Promise<boolean> {
		const user = await User.findById(userId);

		if (!user) {
			throw new TwoFAServiceError('User not found', 404);
		}

		if (!user.twoFA || !user.twoFASecret) {
			throw new TwoFAServiceError('Two-factor authentication not enabled', 400);
		}

		return speakeasy.totp.verify({
			secret: user.twoFASecret,
			encoding: 'base32',
			token,
			window: 1,
		});
	}

	async disable(userId: string): Promise<void> {
		const user = await User.findById(userId);

		if (!user) {
			throw new TwoFAServiceError('User not found', 404);
		}

		user.twoFA = false;
		user.twoFASecret = null;
		await user.save();
	}
}

export const twoFAService = new TwoFAService();
