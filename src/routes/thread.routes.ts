import express, { Request, Response } from 'express';
import Thread from '../models/thread.model.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
	try {
		const { participants, property } = req.body;

		if (!participants || participants.length < 2) {
			return res.status(400).json({ message: 'Participants required (2 or more)' });
		}

		const thread = await Thread.create({
			participants: participants.map((id: string) => new mongoose.Types.ObjectId(id)),
			property: property ? new mongoose.Types.ObjectId(property) : undefined,
			createBy: new mongoose.Types.ObjectId(participants[0]),
		});

		res.status(201).json(thread);
	} catch (err: any) {
		console.error(err);
		res.status(500).json({ message: err.message });
	}
});

export default router;
