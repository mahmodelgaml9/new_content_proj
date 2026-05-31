import { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { strategyController } from './strategy.controller';

const strategyRouter = Router();
strategyRouter.use(authMiddleware);

// POST /api/strategy/:businessId/full-analysis
strategyRouter.post('/:businessId/full-analysis', strategyController.triggerFullAnalysis);

export default strategyRouter;