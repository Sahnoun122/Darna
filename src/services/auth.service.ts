import { User, IUserDocument } from '../models/user.model.js';
import { signAccessToken } from '../config/jwt.js';
import { twoFAService, TwoFAServiceError } from './twoFA.service.js';

export class AuthServiceError extends Error {
	public statusCode: number;

	constructor(message: string, statusCode = 400) {
		super(message);
		this.name = 'AuthServiceError';
		this.statusCode = statusCode;
	}
}

export interface RegisterInput {
	username: string;
	email: string;
	password: string;
	plan: string;
	role: string;
}

export interface LoginInput {
	email: string;
	password: string;
	twoFAToken?: string;
}

export interface AuthenticatedUser {
	id: string;
	username: string;
	email: string;
	plan: string;
	twoFA: boolean;
	role: string;
	createdAt: string;
	updatedAt: string;
	isValidated: boolean;
}

export interface AuthResponse {
	user: AuthenticatedUser;
	accessToken: string;
}

const sanitizeUser = (user: IUserDocument): AuthenticatedUser => {
	const plain = user.toJSON() as unknown as {
		id: string;
		username: string;
		email: string;
		plan: string;
		twoFA: boolean;
		role: string;
		isValidated: boolean;
		createdAt: Date;
		updatedAt: Date;
	};

	const toIso = (value: Date | string): string =>
		value instanceof Date ? value.toISOString() : new Date(value).toISOString();

	return {
		id: plain.id,
		username: plain.username,
		email: plain.email,
		plan: plain.plan,
		twoFA: plain.twoFA,
		role: plain.role,
		isValidated: plain.isValidated,
		createdAt: toIso(plain.createdAt),
		updatedAt: toIso(plain.updatedAt),
	};
};

class AuthService {
	async register(data: RegisterInput): Promise<AuthResponse> {
		const email = data.email.trim().toLowerCase();
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new AuthServiceError('Email déjà enregistré', 409);
		}

		const isEntreprise = data.role === 'entreprise';

		const user = new User({
			username: data.username.trim(),
			email,
			password: data.password,
			plan: data.plan.trim() || 'basic',
			twoFA: false,
			role: data.role,
			isValidated: !isEntreprise,
		});

		await user.save();

		const accessToken = signAccessToken({ userId: user.id });
		return {
			user: sanitizeUser(user),
			accessToken,
		};
	}

	async login(data: LoginInput): Promise<AuthResponse> {
		const email = data.email.trim().toLowerCase();
		const user = await User.findOne({ email });

		if (!user) {
			throw new AuthServiceError('Identifiants invalides', 401);
		}

		if (user.role === 'entreprise' && !user.isValidated) {
			throw new AuthServiceError(
				'Votre compte entreprise est en attente de validation par un administrateur.',
				403
			);
		}

		const isPasswordValid = await user.comparePassword(data.password);
		if (!isPasswordValid) {
			throw new AuthServiceError('Identifiants invalides', 401);
		}

		if (user.twoFA) {
			const token = data.twoFAToken?.trim();
			if (!token) {
				throw new AuthServiceError('Code de vérification 2FA requis', 401);
			}

			try {
				const isTwoFATokenValid = await twoFAService.verifyLoginToken(user.id, token);
				if (!isTwoFATokenValid) {
					throw new AuthServiceError('Code 2FA invalide', 401);
				}
			} catch (err) {
				if (err instanceof TwoFAServiceError) {
					throw new AuthServiceError(err.message, err.statusCode);
				}
				throw err;
			}
		}

		const accessToken = signAccessToken({ userId: user.id });
		return {
			user: sanitizeUser(user),
			accessToken,
		};
	}
}

export const authService = new AuthService();
