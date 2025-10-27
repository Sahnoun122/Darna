import { Schema, model, Document } from 'mongoose';

export interface IProperty extends Document {
	title: string;
	description: string;
	transactionType: 'vente' | 'location_journalière' | 'location_mensuelle' | 'location_longue';
	price: number;
	availability: boolean;
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
	owner: Schema.Types.ObjectId;
	media: {
		images: string[];
		videos?: string[];
	};
	createdAt: Date;
	updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		transactionType: {
			type: String,
			enum: ['vente', 'location_journalière', 'location_mensuelle', 'location_longue'],
			required: true,
		},
		price: { type: Number, required: true },
		availability: { type: Boolean, default: true },
		location: {
			address: String,
			city: String,
			latitude: Number,
			longitude: Number,
		},
		characteristics: {
			surface: Number,
			rooms: Number,
			bedrooms: Number,
			bathrooms: Number,
			equipment: [String],
			rules: [String],
			energyRating: String,
		},
		owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		media: {
			images: [String],
			videos: [String],
		},
	},
	{ timestamps: true }
);
export const Property = model<IProperty>('Property', propertySchema);
