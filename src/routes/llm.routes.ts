import { Router } from 'express';
import { getEstimation } from '../controllers/llm.controller';

const router = Router();

router.post('/estimation', getEstimation);

export default router;
