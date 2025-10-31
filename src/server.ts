import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import { Server as IOServer } from 'socket.io';

import authRoutes from './routes/auth.routes.js';
import threadRoutes from './routes/thread.routes.js';
import messageRoutes from './routes/message.routes.js';
import socketHandler from './services/socket.service.js';

dotenv.config();

await connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/thread', threadRoutes);
app.use('/api/message', messageRoutes);

const server = http.createServer(app);

const io = new IOServer(server, {
	cors: { origin: '*' },
});

socketHandler(io);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
	console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
