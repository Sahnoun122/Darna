import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { signAccessToken } from '../config/jwt.js';

dotenv.config();

const SUCCESS_REDIRECT = process.env.OAUTH_SUCCESS_REDIRECT;
const FAILURE_REDIRECT = process.env.OAUTH_FAILURE_REDIRECT;

export const oauthFailure = (_req: Request, res: Response) => {
	return res.status(401).json({ message: 'Google authentication failed' });
};

export const googleCallbackHandler = (req: Request, res: Response) => {
	const anyReq = req as any;
	const user = anyReq.user as { id: string } | undefined;

	if (!user) {
		if (FAILURE_REDIRECT) {
			return res.redirect(FAILURE_REDIRECT);
		}
		return res.status(401).json({ message: 'Authentication failed' });
	}

	const token = signAccessToken({ userId: user.id });

	if (SUCCESS_REDIRECT) {
		const url = new URL(SUCCESS_REDIRECT);
		url.searchParams.set('token', token);
		return res.redirect(url.toString());
	}

	return res.status(200).json({ accessToken: token });
};
