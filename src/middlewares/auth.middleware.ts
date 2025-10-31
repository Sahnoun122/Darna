import { NextFunction, Request, Response, RequestHandler } from 'express';
import { verifyAccessToken } from '../config/jwt.js';
import { User } from '../models/user.model.js';

export interface RequestUser {
	id: string;
	username: string;
	email: string;
	plan: string;
	role: string;
}

export interface AuthenticatedRequest extends Request {
	user?: RequestUser;
	userId?: string;
}

const extractToken = (authorization?: string): string | undefined => {
	if (!authorization) return undefined;
	const [scheme, token] = authorization.split(' ');
	if (scheme?.toLowerCase() !== 'bearer' || !token) return undefined;
	return token.trim();
};

export const authenticate: RequestHandler = async (req, res, next) => {
	try {
		const token = extractToken(req.headers.authorization);
		if (!token) return res.status(401).json({ message: 'Authentication required' });

		const payload = verifyAccessToken(token);
		const user = await User.findById(payload.userId);

		if (!user) return res.status(401).json({ message: 'Invalid or expired token' });

		(req as AuthenticatedRequest).userId = user.id;
		(req as AuthenticatedRequest).user = {
			id: user.id,
			username: user.username,
			email: user.email,
			plan: user.plan || 'basic',
			role: user.role || 'user',
		};

		next();
	} catch (error) {
		const tokenError = error as Error & { name?: string };
		const message = tokenError?.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
		return res.status(401).json({ message });
	}
};

export const verifyAdmin: RequestHandler = (req, res, next) => {
	const user = (req as AuthenticatedRequest).user;
	if (!user || user.role !== 'admin') {
		return res.status(403).json({ message: 'Admin access required' });
	}
	next();
};

export const verifyUser = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): Response | void => {
	if (req.userId === req.params.id || req.user?.role === 'admin') {
		return next();
	} else {
		return res.status(403).json({ message: 'Access denied: not authorized' });
	}
};

export default authenticate;
