import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import adminRoutes from '../src/routes/admin.routes';

jest.mock('../src/middlewares/auth.middleware', () => ({
	authenticate: (req: Request, res: Response, next: NextFunction) => {
		(req as any).userId = 'fakeUser';
		next();
	},
	verifyAdmin: (req: Request, res: Response, next: NextFunction) => next(),
}));

jest.mock('../src/controllers/admin.controller', () => ({
	getPendingProperties: (req: Request, res: Response) =>
		res.status(200).json([{ id: 1, title: 'Pending Property' }]),

	approveProperty: (req: Request, res: Response) =>
		res.status(200).json({ message: 'Property approved' }),

	rejectProperty: (req: Request, res: Response) =>
		res.status(200).json({ message: 'Property rejected' }),

	getReportedProperties: (req: Request, res: Response) =>
		res.status(200).json([{ id: 2, title: 'Reported Property' }]),
}));

const app = express();
app.use(express.json());
app.use('/api/admin', adminRoutes);

describe('Admin Routes', () => {
	it('GET /api/admin/pending should return pending properties', async () => {
		const res = await request(app).get('/api/admin/pending');
		expect(res.statusCode).toBe(200);
		expect(res.body[0].title).toBe('Pending Property');
	});

	it('GET /api/admin/reported should return reported properties', async () => {
		const res = await request(app).get('/api/admin/reported');
		expect(res.statusCode).toBe(200);
		expect(res.body[0].title).toBe('Reported Property');
	});

	it('PUT /api/admin/approve/:id should approve property', async () => {
		const res = await request(app).put('/api/admin/approve/1');
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe('Property approved');
	});

	it('PUT /api/admin/reject/:id should reject property', async () => {
		const res = await request(app).put('/api/admin/reject/1');
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe('Property rejected');
	});
});
