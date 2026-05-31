import { Router } from 'express';
import { authController } from './auth.controller';

const authRouter = Router();

// Route for user signup
authRouter.post('/signup', authController.signup);

// Route for user login
authRouter.post('/login', authController.login);

export default authRouter;