import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';

// Mock middlewares
const authenticate = (req: Request, res: Response, next: NextFunction) => next();
const verifyAdmin = (req: Request, res: Response, next: NextFunction) => next();

// Mock controllers
const getAllPlans = (req: Request, res: Response) =>
	res.status(200).json([{ id: 'plan1', name: 'Basic' }]);
const createPlan = (req: Request, res: Response) =>
	res.status(201).json({ id: 'plan2', name: req.body.name });
const updatePlan = (req: Request, res: Response) => res.status(200).json({ ...req.body });
const deletePlan = (req: Request, res: Response) =>
	res.status(200).json({ message: 'Plan deleted' });

// Mock router
import { Router } from 'express';
const router = Router();
router.get('/plans', authenticate, verifyAdmin, getAllPlans);
router.post('/plans', authenticate, verifyAdmin, createPlan);
router.put('/plans/:id', authenticate, verifyAdmin, updatePlan);
router.delete('/plans/:id', authenticate, verifyAdmin, deletePlan);

const app = express();
app.use(express.json());
app.use('/api/admin', router);

describe('Admin Subscription Plans', () => {
	it('GET /api/admin/plans', async () => {
		const res = await request(app).get('/api/admin/plans');
		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	it('POST /api/admin/plans', async () => {
		const res = await request(app).post('/api/admin/plans').send({ name: 'Premium' });
		expect(res.status).toBe(201);
		expect(res.body.name).toBe('Premium');
	});

	it('PUT /api/admin/plans/:id', async () => {
		const res = await request(app).put('/api/admin/plans/plan1').send({ name: 'Updated Plan' });
		expect(res.status).toBe(200);
		expect(res.body.name).toBe('Updated Plan');
	});

	it('DELETE /api/admin/plans/:id', async () => {
		const res = await request(app).delete('/api/admin/plans/plan1');
		expect(res.status).toBe(200);
		expect(res.body.message).toBe('Plan deleted');
	});
});
