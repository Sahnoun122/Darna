import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import propertyRoutes from './routes/property.routes.js';
import twoFARoutes from './routes/twoFA.routes.js';
import { swaggerDocs } from './config/swagger.js';

dotenv.config();

await connectDB();

export const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/2fa', twoFARoutes);

const PORT: number = Number(process.env.PORT) || 8000;

swaggerDocs(app, PORT);

app.listen(PORT, () => {
	console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
