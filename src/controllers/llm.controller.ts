import llmfetch from '../services/llm.service.js';
import { Request, Response } from 'express';

interface IProperty {
	location: {
		address: string;
		city: string;
		latitude: number;
		longitude: number;
	};
	characteristics: {
		surface: number;
		rooms: number;
		bedrooms: number;
		bathrooms: number;
		equipment: string[];
		rules: string[];
		energyRating?: string;
	};
}

export const getEstimation = async (req: Request<{}, {}, IProperty>, res: Response) => {
	try {
		const { location, characteristics } = req.body;
		if (!location || !characteristics) {
			return res.status(400).json({ error: 'Missing location or characteristics' });
		}
		const estimation = await llmfetch(location, characteristics);
		res.json(estimation);
	} catch (error) {
		res.status(500).json({ error: 'Failed to get estimation' });
	}
};
