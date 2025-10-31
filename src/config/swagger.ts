import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Express API with Swagger (TypeScript)',
			version: '1.0.0',
			description: 'Documentation auto-générée avec OpenAPI & Swagger',
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Serveur local',
			},
		],
	},
	apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function swaggerDocs(app: Express, port: number): void {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	console.log(`📘 Swagger Docs disponibles sur: http://localhost:${port}/api-docs`);
}
