import express from 'express';
import {
	getPendingProperties,
	approveProperty,
	rejectProperty,
	getReportedProperties,
	getPendingEntreprises,
	validateEntreprise,
	getGlobalStats,
} from '../controllers/admin.controller';
import { authenticate, verifyAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Property:
 *       $ref: '#/components/schemas/Property'
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Message d'erreur détaillé
 *     ValidationError:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *               param:
 *                 type: string
 *               location:
 *                 type: string
 */

/**
 * @openapi
 * tags:
 *   name: Admin
 *   description: Gestion des fonctionnalités administrateur
 */

/**
 * @openapi
 * /api/admin/pending:
 *   get:
 *     summary: Récupérer les propriétés en attente de validation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des propriétés en attente récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 *       401:
 *         description: Non autorisé - Token JWT manquant ou invalide
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 */
router.get('/pending', authenticate, verifyAdmin, getPendingProperties);

/**
 * @openapi
 * /api/admin/approve/{id}:
 *   put:
 *     summary: Approuver une propriété
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la propriété à approuver
 *     responses:
 *       200:
 *         description: Propriété approuvée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       400:
 *         description: ID invalide ou propriété déjà approuvée
 *       401:
 *         description: Non autorisé - Token JWT manquant ou invalide
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 *       404:
 *         description: Propriété non trouvée
 */
router.put('/approve/:id', authenticate, verifyAdmin, approveProperty);

/**
 * @openapi
 * /api/admin/reject/{id}:
 *   put:
 *     summary: Rejeter une propriété
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la propriété à rejeter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Raison du rejet
 *                 example: "La description est trop vague"
 *             required:
 *               - reason
 *     responses:
 *       200:
 *         description: Propriété rejetée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       400:
 *         description: ID invalide ou propriété déjà traitée
 *       401:
 *         description: Non autorisé - Token JWT manquant ou invalide
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 *       404:
 *         description: Propriété non trouvée
 */
router.put('/reject/:id', authenticate, verifyAdmin, rejectProperty);

/**
 * @openapi
 * /api/admin/reported:
 *   get:
 *     summary: Récupérer les propriétés signalées
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des propriétés signalées récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 *       401:
 *         description: Non autorisé - Token JWT manquant ou invalide
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 */
/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Gestion des fonctionnalités administrateur
 */

/**
 * @openapi
 * /api/admin/reported:
 *   get:
 *     summary: Liste des propriétés signalées
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Liste des propriétés signalées récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   reason:
 *                     type: string
 *                   reporter:
 *                     type: string
 *       '401':
 *         description: Non autorisé (token manquant ou invalide)
 *       '403':
 *         description: Accès réservé aux administrateurs
 */

/**
 * @openapi
 * /api/admin/entreprises/pending:
 *   get:
 *     summary: Liste des entreprises en attente de validation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Liste des entreprises en attente récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       '401':
 *         description: Non autorisé
 *       '403':
 *         description: Accès réservé aux administrateurs
 */

/**
 * @openapi
 * /api/admin/entreprises/validate/{id}:
 *   put:
 *     summary: Valider une entreprise en attente
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'entreprise à valider
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Entreprise validée avec succès
 *       '404':
 *         description: Entreprise introuvable
 *       '401':
 *         description: Non autorisé
 *       '403':
 *         description: Accès réservé aux administrateurs
 */

/**
 * @openapi
 * /api/admin/stats:
 *   get:
 *     summary: Statistiques globales de la plateforme
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Statistiques globales récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 1200
 *                 totalEntreprises:
 *                   type: integer
 *                   example: 200
 *                 totalProperties:
 *                   type: integer
 *                   example: 530
 *                 reportedProperties:
 *                   type: integer
 *                   example: 12
 *       '401':
 *         description: Non autorisé
 *       '403':
 *         description: Accès réservé aux administrateurs
 */

export default router;
