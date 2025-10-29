import { Request, Response } from 'express';
import { Property } from '../models/property.model';

export const getPendingProperties = async (req: Request, res: Response) => {
	try {
		const pending = await Property.find({ status: 'pending' }).populate('owner', 'email');
		res.status(200).json(pending);
	} catch (error) {
		res.status(500).json({ message: `erreur lors de la recuperations des annonces ` });
	}
};
