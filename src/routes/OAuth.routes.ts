import { Router } from 'express';
import passport from '../config/passport.js';
import { googleCallbackHandler, oauthFailure } from '../controllers/OAuth.controller.js';

const router = Router();

router.get(
	'/google',
	passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/api/auth/failure', session: false }),
	googleCallbackHandler
);

router.get('/failure', oauthFailure);

export default router;
