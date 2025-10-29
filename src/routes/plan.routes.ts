import { Router } from 'express';
import { authenticate, verifyAdmin } from '../middlewares/auth.middleware';
import {
	createPlan,
	getAllPlans,
	updatePlan,
	deletePlan,
	getSubscriptions,
	cancelSubscription,
} from '../controllers/plan.controller';

const router = Router();

router.post('/', authenticate, verifyAdmin, createPlan);
router.get('/', authenticate, verifyAdmin, getAllPlans);
router.put('/:id', authenticate, verifyAdmin, updatePlan);
router.delete('/:id', authenticate, verifyAdmin, deletePlan);

router.get('/subscriptions/list', authenticate, verifyAdmin, getSubscriptions);
router.put('/subscriptions/:id/cancel', authenticate, verifyAdmin, cancelSubscription);

export default router;
