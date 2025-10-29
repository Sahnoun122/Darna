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

/**
 * @openapi
 * /api/properties:
 *   get:
 *     summary: Récupérer tous les biens
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [appartement, maison, bureau, terrain, autre]
 *         description: Filtrer par type de propriété
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [à vendre, à louer, vendu, loué]
 *         description: Filtrer par statut
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Prix minimum
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Prix maximum
 *       - in: query
 *         name: minSurface
 *         schema:
 *           type: number
 *         description: Surface minimale en m²
 *       - in: query
 *         name: rooms
 *         schema:
 *           type: number
 *         description: Nombre de pièces minimum
 *     responses:
 *       200:
 *         description: Liste des propriétés récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 *       401:
 *         description: Non autorisé - Token JWT manquant ou invalide
 */
router.get('/', authenticate, controller.getAll.bind(controller));

/**
 * @openapi
 * /api/properties/{id}:
 *   get:
 *     summary: Récupérer un bien par son ID
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la propriété à récupérer
 *     responses:
 *       200:
 *         description: Détails de la propriété
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       401:
 *         description: Non autorisé - Token JWT manquant ou invalide
 *       404:
 *         description: Propriété non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bien introuvable"
 */
router.get('/:id', authenticate, controller.getById.bind(controller));

/**
 * @openapi
 * /api/properties/{id}:
 *   put:
 *     summary: Mettre à jour une propriété
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la propriété à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       200:
 *         description: Propriété mise à jour avec succès
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
 *       403:
 *         description: Action non autorisée - Vous n'êtes pas le propriétaire
 *       404:
 *         description: Propriété non trouvée
 */
router.put('/:id', authenticate, controller.update.bind(controller));

/**
 * @openapi
 * /api/properties/{id}:
 *   delete:
 *     summary: Supprimer une propriété
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la propriété à supprimer
 *     responses:
 *       200:
 *         description: Propriété supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bien supprimé avec succès"
 *       401:
 *         description: Non autorisé - Token JWT manquant ou invalide
 *       403:
 *         description: Action non autorisée - Vous n'êtes pas le propriétaire
 *       404:
 *         description: Propriété non trouvée
 */
router.delete('/:id', authenticate, controller.delete.bind(controller));

export default router;
