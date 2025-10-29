import { Property, IProperty } from '../models/property.model.js';
import { SortOrder } from 'mongoose';

interface SearchOptions {
	search?: string;
	type?: string;
	status?: string;
	minPrice?: number;
	maxPrice?: number;
	minSurface?: number;
	minRooms?: number;
	minBedrooms?: number;
	city?: string;
	sort?: string;
	page?: number;
	limit?: number;
}

export class PropertyService {
	private buildSearchQuery(filters: SearchOptions) {
		const query: any = {};

		// Recherche par mot-clé (titre, description, adresse)
		if (filters.search) {
			query.$or = [
				{ title: { $regex: filters.search, $options: 'i' } },
				{ description: { $regex: filters.search, $options: 'i' } },
				{ 'address.street': { $regex: filters.search, $options: 'i' } },
				{ 'address.city': { $regex: filters.search, $options: 'i' } },
			];
		}

		// Filtres simples
		if (filters.type) query.type = filters.type;
		if (filters.status) query.status = filters.status;
		if (filters.city) query['address.city'] = { $regex: filters.city, $options: 'i' };

		// Filtres numériques
		if (filters.minPrice || filters.maxPrice) {
			query.price = {};
			if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
			if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
		}

		if (filters.minSurface) query.surface = { $gte: Number(filters.minSurface) };
		if (filters.minRooms) query.rooms = { $gte: Number(filters.minRooms) };
		if (filters.minBedrooms) query.bedrooms = { $gte: Number(filters.minBedrooms) };

		return query;
	}

	private buildSortOptions(sortString?: string): { [key: string]: SortOrder } {
		if (!sortString) return { createdAt: 'desc' }; // Tri par défaut

		const [field, order] = sortString.split(':');
		const sortOrder: SortOrder = order?.toLowerCase() === 'asc' ? 'asc' : 'desc';

		// Vérification des champs de tri autorisés
		const allowedFields = ['price', 'surface', 'rooms', 'bedrooms', 'createdAt'];
		if (!field || !allowedFields.includes(field)) return { createdAt: 'desc' };

		return { [field]: sortOrder };
	}

	async searchProperties(options: SearchOptions = {}) {
		const page = options.page || 1;
		const limit = options.limit || 10;
		const skip = (page - 1) * limit;

		const query = this.buildSearchQuery(options);
		const sort = this.buildSortOptions(options.sort);

		const [properties, total] = await Promise.all([
			Property.find(query).sort(sort).skip(skip).limit(limit).populate('owner', 'name email'),
			Property.countDocuments(query),
		]);

		return {
			data: properties,
			pagination: {
				total,
				page,
				totalPages: Math.ceil(total / limit),
				limit,
			},
		};
	}

	async createProperty(data: Partial<IProperty>) {
		const property = new Property(data);
		return await property.save();
	}

	async getAllProperties(filters = {}) {
		return await Property.find(filters).populate('owner', 'name email');
	}

	async getPropertyById(id: string) {
		return await Property.findById(id).populate('owner', 'name email');
	}

	async updateProperty(id: string, data: Partial<IProperty>) {
		return await Property.findByIdAndUpdate(id, data, { new: true });
	}

	async deleteProperty(id: string) {
		return await Property.findByIdAndDelete(id);
	}
}
