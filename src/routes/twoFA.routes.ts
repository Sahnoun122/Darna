import express, { RequestHandler } from 'express';
import { initiateTwoFA, verifyTwoFA, disableTwoFA } from '../controllers/twoFA.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post(
	'/setup',
	authenticate as unknown as RequestHandler,
	initiateTwoFA as unknown as RequestHandler
);

router.post(
	'/verify',
	authenticate as unknown as RequestHandler,
	verifyTwoFA as unknown as RequestHandler
);

router.delete(
	'/disable',
	authenticate as unknown as RequestHandler,
	disableTwoFA as unknown as RequestHandler
);

export default router;
