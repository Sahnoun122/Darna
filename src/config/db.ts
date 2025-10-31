import mongoose from 'mongoose';
import 'dotenv/config';

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/darna';

export const connectDB = async (): Promise<void> => {
	try {
		await mongoose.connect(mongoURI);
		console.log('✅ Connecté à la base de données MongoDB');
	} catch (error) {
		console.error('❌ Erreur de connexion à la base de données MongoDB:', error);
		process.exit(1);
	}
};
