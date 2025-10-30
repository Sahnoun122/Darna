import request from 'supertest';
import express from 'express';
import adminRoutes from '../src/routes/admin.routes';

jest.mock('../src/middlewares/auth.middleware', () => ({
	authenticate: (req: any, res: any, next: any) => next(),
	verifyAdmin: (req: any, res: any, next: any) => next(),
}));

jest.mock('../src/services/admin.service', () => ({
	getGlobalStats: jest.fn().mockResolvedValue({
		totalUsers: 100,
		totalProperties: 50,
		totalRevenue: 2500,
		newUsersThisWeek: 10,
		newPropertiesThisWeek: 5,
	}),
}));

const app = express();
app.use('/api/admin', adminRoutes);

describe('GET /api/admin/stats', () => {
	it('should return global stats', async () => {
		const res = await request(app).get('/api/admin/stats');
		expect(res.statusCode).toBe(200);
		expect(res.body.data.totalUsers).toBe(100);
	});
});
