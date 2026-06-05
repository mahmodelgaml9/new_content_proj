import { Router } from 'express';
import { authController } from './auth.controller';
import { authMiddleware } from './auth.middleware';

const authRouter = Router();

// Route for user signup
authRouter.post('/signup', authController.signup);

// Route for user login
authRouter.post('/login', authController.login);

// Route for getting user stats
authRouter.get('/me/stats', authMiddleware, authController.getUserStats);

export default authRouter;