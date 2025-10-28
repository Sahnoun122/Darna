import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const accessTokenSecret: string = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
const accessTokenExpiresIn: string = process.env.JWT_ACCESS_EXPIRES || '1h';

export interface JwtPayload {
	userId: string;
}

export const signAccessToken = (payload: JwtPayload): string =>
	jwt.sign(payload as object, accessTokenSecret, {
		expiresIn: accessTokenExpiresIn,
	} as SignOptions);

export const verifyAccessToken = (token: string): JwtPayload =>
	jwt.verify(token, accessTokenSecret) as JwtPayload;

export const jwtConfig = {
	secret: accessTokenSecret,
	expiresIn: accessTokenExpiresIn,
};
