/**
 * Unit tests for auth controller
 * - These tests mock `authService` to avoid DB operations and test controller behavior.
 */

jest.mock('../src/services/auth.service', () => {
	class AuthServiceError extends Error {
		statusCode: number;
		constructor(message: string, statusCode = 400) {
			super(message);
			this.name = 'AuthServiceError';
			this.statusCode = statusCode;
		}
	}

	return {
		authService: {
			register: jest.fn(),
			login: jest.fn(),
		},
		AuthServiceError,
	};
});

import { register, login } from '../src/controllers/auth.controller';
import { authService, AuthServiceError } from '../src/services/auth.service';

const mockRes = () => {
	const res: any = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res as any;
};

describe('Auth Controller', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('register returns 201 and body on success', async () => {
		const req: any = {
			body: { username: 'user1', email: 'u1@example.com', password: 'pass123', plan: 'basic' },
		};
		const res = mockRes();
		const next = jest.fn();

		(authService.register as jest.Mock).mockResolvedValue({
			user: {
				id: '1',
				username: 'user1',
				email: 'u1@example.com',
				plan: 'basic',
				twoFA: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			accessToken: 'token-abc',
		});

		await register(req, res, next);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ accessToken: 'token-abc' }));
	});

	test('register returns 400 when missing fields', async () => {
		const req: any = { body: { email: 'u1@example.com' } };
		const res = mockRes();
		const next = jest.fn();

		await register(req, res, next);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ message: expect.any(String) })
		);
	});

	test('register maps AuthServiceError status code', async () => {
		const req: any = {
			body: { username: 'user1', email: 'u1@example.com', password: 'pass123' },
		};
		const res = mockRes();
		const next = jest.fn();

		(authService.register as jest.Mock).mockRejectedValue(
			new AuthServiceError('Email already registered', 409)
		);

		await register(req, res, next);

		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ message: 'Email already registered' })
		);
	});

	test('login returns 200 and body on success', async () => {
		const req: any = { body: { email: 'u1@example.com', password: 'pass123' } };
		const res = mockRes();
		const next = jest.fn();

		(authService.login as jest.Mock).mockResolvedValue({
			user: { id: '1' },
			accessToken: 'tok-xyz',
		});

		await login(req, res, next);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ accessToken: 'tok-xyz' }));
	});

	test('login returns 400 when missing fields', async () => {
		const req: any = { body: { email: 'u1@example.com' } };
		const res = mockRes();
		const next = jest.fn();

		await login(req, res, next);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ message: expect.any(String) })
		);
	});

	test('login maps AuthServiceError status code', async () => {
		const req: any = { body: { email: 'u1@example.com', password: 'pass123' } };
		const res = mockRes();
		const next = jest.fn();

		(authService.login as jest.Mock).mockRejectedValue(
			new AuthServiceError('Invalid credentials', 401)
		);

		await login(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ message: 'Invalid credentials' })
		);
	});
});
