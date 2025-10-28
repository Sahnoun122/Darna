import { Request, Response, NextFunction } from 'express';
import {
	authService,
	AuthServiceError,
	RegisterInput,
	LoginInput,
} from '../services/auth.service.js';

const ensureString = (value: unknown): string | undefined => {
	if (typeof value !== 'string') {
		return undefined;
	}

	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : undefined;
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const username = ensureString(req.body.username);
		const email = ensureString(req.body.email);
		const password = ensureString(req.body.password);
		const plan = ensureString(req.body.plan) ?? 'basic';

		if (!username || !email || !password) {
			return res.status(400).json({
				message: 'username, email and password are required',
			});
		}

		const payload: RegisterInput = {
			username,
			email,
			password,
			plan,
		};

		const result = await authService.register(payload);
		return res.status(201).json(result);
	} catch (error) {
		if (error instanceof AuthServiceError) {
			return res.status(error.statusCode).json({ message: error.message });
		}
		return next(error);
	}
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const email = ensureString(req.body.email);
		const password = ensureString(req.body.password);
		const twoFAToken = ensureString(req.body.twoFAToken);

		if (!email || !password) {
			return res.status(400).json({ message: 'email and password are required' });
		}

		const payload: LoginInput = { email, password };
		if (twoFAToken) {
			payload.twoFAToken = twoFAToken;
		}
		const result = await authService.login(payload);
		return res.status(200).json(result);
	} catch (error) {
		if (error instanceof AuthServiceError) {
			return res.status(error.statusCode).json({ message: error.message });
		}
		return next(error);
	}
};
