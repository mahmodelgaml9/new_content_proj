import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define a custom interface to extend the Express Request type
export interface AuthenticatedRequest extends Request {
    user?: {
    id: string;
    email: string;
    role: string;
    plan: string;
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({ message: 'JWT secret is not configured on the server' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as any;
    // Attach the user payload to the request object
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      plan: payload.plan,
    };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};