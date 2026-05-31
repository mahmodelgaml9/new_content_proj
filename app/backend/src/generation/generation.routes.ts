import { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { generationController } from './generation.controller';

const generationRouter = Router();
generationRouter.use(authMiddleware);

// Route for streaming content
generationRouter.post('/stream', generationController.streamContent);

// NEW ROUTE: for saving the generated content
generationRouter.post('/save', generationController.saveGeneratedContent);

export default generationRouter;