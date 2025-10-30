import express from 'express';
import {
	getPendingProperties,
	approveProperty,
	rejectProperty,
	getReportedProperties,
	getPendingEntreprises,
	validateEntreprise,
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
router.get('/reported', authenticate, verifyAdmin, getReportedProperties);

router.get('/entreprises/pending', authenticate, verifyAdmin, getPendingEntreprises);
router.put('/entreprises/validate/:id', authenticate, verifyAdmin, validateEntreprise);

export default router;
