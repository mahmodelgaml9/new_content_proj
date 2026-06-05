import { Request, Response } from 'express';
import { authService } from './auth.service';
import { AuthenticatedRequest } from './auth.middleware';

class AuthController {
  public async signup(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.signup(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      // Handle cases where the user already exists
      if (error.code === 'P2002') {
        res.status(409).json({ message: 'User with this email already exists.' });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred during signup.' });
      }
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      if (!result) {
        res.status(401).json({ message: 'Invalid email or password.' });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'An unexpected error occurred during login.' });
    }
  }

  public async getUserStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const stats = await authService.getUserStats(req.user.id);
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: 'An unexpected error occurred while fetching user stats.' });
    }
  }
}

export const authController = new AuthController();