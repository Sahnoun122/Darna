import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { User } from '../models/user.model';
import { Error } from 'mongoose';

export const verifySocketJWT = async (socket: Socket) => {
	const token =
		socket.handshake.auth?.token ||
		(socket.handshake.headers?.authorization || '').replace('Bearer', '');
	if (!token) throw new Error('not token provided');

	try {
		const payload: any = jwt.verify(token, jwtConfig.secret);
		const userId = payload.sub || payload.id;
		if (!userId) throw new Error('invalid token palyoad');

		const user = await User.findById(userId).select('-password').lean();

		if (!user) throw new Error('user not found');

		socket.data.user = { _id: userId, email: (user as any).email, name: (user as any).name };
	} catch (error) {
		throw new Error('Authentication error');
	}
};
