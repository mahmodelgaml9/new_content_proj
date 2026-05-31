import { prisma } from '../services/prisma.service';
import { User, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthService {
  public async signup(data: Prisma.UserCreateInput): Promise<{ user: Omit<User, 'password'>, token: string }> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    const { password, ...userWithoutPassword } = newUser;
    const token = this.generateJwt(userWithoutPassword);

    return { user: userWithoutPassword, token };
  }

  public async login(email: string, pass: string): Promise<{ user: Omit<User, 'password'>, token: string } | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(pass, user.password))) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    const token = this.generateJwt(userWithoutPassword);

    return { user: userWithoutPassword, token };
  }

  private generateJwt(user: Omit<User, 'password'>): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables.');
    }

    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
      jwtSecret,
      { expiresIn: '7d' } // Token expires in 7 days
    );
  }
}

export const authService = new AuthService();