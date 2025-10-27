import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
const controller = new PropertyController();

router.post('/', authenticate, controller.create.bind(controller));
router.get('/', authenticate, controller.getAll.bind(controller));
router.get('/:id', authenticate, controller.getById.bind(controller));
router.put('/:id', authenticate, controller.update.bind(controller));
router.delete('/:id', authenticate, controller.delete.bind(controller));

export default router;
