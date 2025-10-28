import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../config/jwt.js';
import { User } from '../models/user.model.js';

export interface RequestUser {
	id: string;
	username: string;
	email: string;
	plan: string;
}

export interface AuthenticatedRequest extends Request {
	user?: RequestUser;
	userId?: string;
}

declare global {
	namespace Express {
		interface Request {
			user?: RequestUser;
			userId?: string;
		}
	}
}

const extractToken = (authorization?: string): string | undefined => {
	if (!authorization) {
		return undefined;
	}

	const [scheme, token] = authorization.split(' ');
	if (scheme?.toLowerCase() !== 'bearer' || !token) {
		return undefined;
	}

	return token.trim();
};

export const authenticate = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): Promise<Response | void> => {
	try {
		const token = extractToken(req.headers.authorization);
		if (!token) {
			return res.status(401).json({ message: 'Authentication required' });
		}

		const payload = verifyAccessToken(token);
		const user = await User.findById(payload.userId);

		if (!user) {
			return res.status(401).json({ message: 'Invalid or expired token' });
		}

		req.userId = user.id;
		req.user = {
			id: user.id,
			username: user.username,
			email: user.email,
			plan: user.plan || 'basic',
		};

		return next();
	} catch (error) {
		const tokenError = error as Error & { name?: string };
		const message = tokenError?.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
		return res.status(401).json({ message });
	}
};

export default authenticate;
