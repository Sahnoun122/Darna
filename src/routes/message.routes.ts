import express, { Request, Response } from 'express';
import Message from '../models/message.model.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
	try {
		const { threadId, from, to, text } = req.body;

		const message = await Message.create({
			threadId: new mongoose.Types.ObjectId(threadId),
			from: new mongoose.Types.ObjectId(from),
			to: to.map((id: string) => new mongoose.Types.ObjectId(id)),
			text,
		});

		res.status(201).json(message);
	} catch (err: any) {
		console.error(err);
		res.status(500).json({ message: err.message });
	}
});

export default router;
