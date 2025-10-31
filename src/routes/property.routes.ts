import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
const controller = new PropertyController();

// Route de recherche, filtrage et tri
router.get('/search', controller.search.bind(controller));

/**
 * @openapi
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *         - type
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: L'identifiant unique de la propriété
 *         title:
 *           type: string
 *           description: Le titre de la propriété
 *         description:
 *           type: string
 *           description: La description détaillée de la propriété
 *         price:
 *           type: number
 *           format: float
 *           description: Le prix de la propriété
 *         type:
 *           type: string
 *           enum: [appartement, maison, bureau, terrain, autre]
 *           description: Le type de propriété
 *         status:
 *           type: string
 *           enum: [à vendre, à louer, vendu, loué]
 *           description: Le statut de la propriété
 *         surface:
 *           type: number
 *           description: La surface en m²
 *         rooms:
 *           type: number
 *           description: Nombre de pièces
 *         bedrooms:
 *           type: number
 *           description: Nombre de chambres
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             postalCode:
 *               type: string
 *             country:
 *               type: string
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des équipements et caractéristiques
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs des images de la propriété
 *         owner:
 *           type: string
 *           description: ID du propriétaire
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Message d'erreur détaillé
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @openapi
 * tags:
 *   name: Properties
 *   description: Gestion des propriétés immobilières
 */

/**
 * @openapi
 * /api/properties:
 *   post:
 *     summary: Créer une nouvelle propriété
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       201:
 *         description: Propriété créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non autorisé - Token JWT manquant ou invalide
 */
router.post('/', authenticate, controller.create.bind(controller));
router.get('/', authenticate, controller.getAll.bind(controller));
router.get('/:id', authenticate, controller.getById.bind(controller));
router.put('/:id', authenticate, controller.update.bind(controller));
router.delete('/:id', authenticate, controller.delete.bind(controller));

export default router;
