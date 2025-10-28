import { Property, IProperty } from '../models/property.model.js';

export class PropertyService {
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
