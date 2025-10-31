import { Router } from 'express';
import { initiateTwoFA, verifyTwoFA, disableTwoFA } from '../controllers/twoFA.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
// import { RequestHandler } from 'express';

const twoFARouter = Router();

twoFARouter.post('/setup', authenticate, initiateTwoFA);
twoFARouter.post('/verify', authenticate, verifyTwoFA);
twoFARouter.delete('/disable', authenticate, disableTwoFA);

export default twoFARouter;
