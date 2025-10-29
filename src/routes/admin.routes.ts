import express from 'express';

import {
	getPendingProperties,
	approveProperty,
	rejectProperty,
	getReportedProperties,
} from '../controllers/admin.controller.js';
import { authenticate, verifyAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/pending', authenticate, verifyAdmin, getPendingProperties);

router.put('/approve/:id', authenticate, verifyAdmin, approveProperty);

router.put('/reject/:id', authenticate, verifyAdmin, rejectProperty);

router.get('/reported', authenticate, verifyAdmin, getReportedProperties);
