import { Server, Socket } from 'socket.io';

export default function socketHandler(io: Server) {
	io.on('connection', (socket: Socket) => {
		console.log(' User connected:', socket.id);

		socket.on('message:send', (data) => {
			console.log('📩 Message received:', data);
			io.emit('message:new', data);
		});

		socket.on('disconnect', () => {
			console.log(' User disconnected:', socket.id);
		});
	});
}
