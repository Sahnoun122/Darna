import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import passport from './config/passport.js';
import { swaggerDocs } from './config/swagger.js';
import { Server as IOServer } from 'socket.io';

import authRoutes from './routes/auth.routes.js';
import oauthRoutes from './routes/OAuth.routes.js';
import propertyRoutes from './routes/property.routes.js';
import twoFARoutes from './routes/twoFA.routes.js';
import threadRoutes from './routes/thread.routes.js';
import messageRoutes from './routes/message.routes.js';
import notificationRoutes from './routes/notification.routes.js';

import socketHandler from './services/socket.service.js';

import adminRoutes from './routes/admin.routes.js';

import planRoutes from './routes/plan.routes';

dotenv.config();

async function main() {
	await connectDB();

	const app = express();
	app.use(express.json());

	app.use(passport.initialize());

	app.use('/api/auth', authRoutes);
	app.use('/api/auth', oauthRoutes);
	app.use('/api/properties', propertyRoutes);
	app.use('/api/2fa', twoFARoutes);
	app.use('/api/thread', threadRoutes);
	app.use('/api/message', messageRoutes);
	app.use('/api/notifications', notificationRoutes);
	app.use('/api/admin', adminRoutes);

	app.use('/api/admin/plans', planRoutes);

	const server = http.createServer(app);

	const io = new IOServer(server, {
		cors: { origin: '*' },
	});

	socketHandler(io);

	const PORT = 8000;
	swaggerDocs(app, PORT);

	app.listen(PORT, () => {
		console.log(`Serveur démarré sur http://localhost:${PORT}`);
	});

	server.listen(8001, () => {
		console.log('websocket server runned at http://localhost:8001');
	});
}

main().catch((err) => {
	console.log('error running server', err);
});
