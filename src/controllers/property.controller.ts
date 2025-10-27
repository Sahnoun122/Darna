import { Request, Response } from 'express';
import { PropertyService } from '../services/property.service.js';

const propertyService = new PropertyService();

export class PropertyController {
	async create(req: Request, res: Response) {
		try {
			const property = await propertyService.createProperty({
				...req.body,
				owner: (req as any).user?.id || (req as any).user?._id, // à gérer avec middleware JWT plus tard
			});
			res.status(201).json(property);
		} catch (err: any) {
			res.status(400).json({ error: err.message });
		}
	}

	async getAll(req: Request, res: Response) {
		const properties = await propertyService.getAllProperties();
		res.json(properties);
	}

	async getById(req: Request, res: Response) {
		const property = await propertyService.getPropertyById(req.params.id);
		if (!property) return res.status(404).json({ message: 'Bien introuvable' });
		res.json(property);
	}

	async update(req: Request, res: Response) {
		const updated = await propertyService.updateProperty(req.params.id, req.body);
		res.json(updated);
	}

	async delete(req: Request, res: Response) {
		await propertyService.deleteProperty(req.params.id);
		res.json({ message: 'Bien supprimé avec succès' });
	}
}
