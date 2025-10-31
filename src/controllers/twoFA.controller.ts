import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { twoFAService, TwoFAServiceError } from '../services/twoFA.service.js';

const ensureToken = (value: unknown): string | undefined => {
	if (typeof value !== 'string') {
		return undefined;
	}

	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : undefined;
};

export const initiateTwoFA = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ message: 'Authentication required' });
		}

		const result = await twoFAService.initiateSetup(req.userId);
		return res.status(200).json({
			secret: result.secret,
			otpauthUrl: result.otpauthUrl,
			qrCode: result.qrCodeDataUrl,
			twoFA: false,
		});
	} catch (error) {
		if (error instanceof TwoFAServiceError) {
			return res.status(error.statusCode).json({ message: error.message });
		}
		return next(error);
	}
};

export const verifyTwoFA = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ message: 'Authentication required' });
		}

		const token = ensureToken(req.body.token);
		if (!token) {
			return res.status(400).json({ message: 'Two-factor authentication token is required' });
		}

		const isValid = await twoFAService.verifySetupToken(req.userId, token);

		if (!isValid) {
			return res.status(400).json({ message: 'Invalid two-factor authentication token' });
		}

		return res.status(200).json({
			message: 'Two-factor authentication enabled',
			twoFA: true,
		});
	} catch (error) {
		if (error instanceof TwoFAServiceError) {
			return res.status(error.statusCode).json({ message: error.message });
		}
		return next(error);
	}
};

export const disableTwoFA = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ message: 'Authentication required' });
		}

		await twoFAService.disable(req.userId);
		return res.status(200).json({ message: 'Two-factor authentication disabled', twoFA: false });
	} catch (error) {
		if (error instanceof TwoFAServiceError) {
			return res.status(error.statusCode).json({ message: error.message });
		}
		return next(error);
	}
};
