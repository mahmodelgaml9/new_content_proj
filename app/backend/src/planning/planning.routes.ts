// src/planning/planning.routes.ts

import { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { planningController } from './planning.controller';

const planningRouter = Router();
planningRouter.use(authMiddleware);

/**
 * ROUTE 1: Get the list of strategic choices for the custom path.
 */
planningRouter.get('/strategic-options', planningController.getStrategicOptions);

/**
 * ROUTE 2: The CUSTOM path. Generate plans based on user's choices.
 */
planningRouter.post('/:businessId/generate-customized-plan', planningController.generateCustomizedPlans);

/**
 * ROUTE 3: The RECOMMENDED path. Let the AI decide and generate plans.
 */
planningRouter.post('/:businessId/generate-recommended-plan', planningController.generateRecommendedPlans);

export default planningRouter;