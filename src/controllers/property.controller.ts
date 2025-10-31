import { Request, Response } from 'express';
import { PropertyService } from '../services/property.service.js';

const propertyService = new PropertyService();

interface SearchQueryParams {
	search?: string;
	type?: string;
	status?: string;
	minPrice?: string;
	maxPrice?: string;
	minSurface?: string;
	minRooms?: string;
	minBedrooms?: string;
	city?: string;
	sort?: string;
	page?: string;
	limit?: string;
}

export class PropertyController {
	async search(req: Request<{}, {}, {}, SearchQueryParams>, res: Response) {
		try {
			const {
				search,
				type,
				status,
				minPrice,
				maxPrice,
				minSurface,
				minRooms,
				minBedrooms,
				city,
				sort,
				page = '1',
				limit = '10',
			} = req.query;

			const result = await propertyService.searchProperties({
				search,
				type,
				status,
				minPrice: minPrice ? Number(minPrice) : undefined,
				maxPrice: maxPrice ? Number(maxPrice) : undefined,
				minSurface: minSurface ? Number(minSurface) : undefined,
				minRooms: minRooms ? Number(minRooms) : undefined,
				minBedrooms: minBedrooms ? Number(minBedrooms) : undefined,
				city,
				sort,
				page: parseInt(page, 10),
				limit: parseInt(limit, 10),
			});

			res.json(result);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	async create(req: Request, res: Response) {
		try {
			const property = await propertyService.createProperty({
				...req.body,
				owner: (req as any).user?.id || (req as any).user?._id,
			});
			res.status(201).json(property);
		} catch (err: any) {
			res.status(400).json({ error: err.message });
		}
	}

	async getAll(req: Request, res: Response) {
		try {
			const properties = await propertyService.getAllProperties();
			res.json(properties);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	async getById(req: Request, res: Response) {
		try {
			const property = await propertyService.getPropertyById(req.params.id);
			if (!property) return res.status(404).json({ message: 'Bien introuvable' });
			res.json(property);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	async update(req: Request, res: Response) {
		try {
			const updated = await propertyService.updateProperty(req.params.id, req.body);
			if (!updated) return res.status(404).json({ message: 'Bien introuvable' });
			res.json(updated);
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const deleted = await propertyService.deleteProperty(req.params.id);
			if (!deleted) return res.status(404).json({ message: 'Bien introuvable' });
			res.json({ message: 'Bien supprimé avec succès' });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}
}
