import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../_db/prisma.service';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  private isValidRequest(body: { email?: string; password?: string }) {
    if (!body || !body.email || !body.password) {
      throw new BadRequestException('Email and password are required');
    }
  }

  private async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  private async validatePassword(password: string, hashedPassword: string) {
    const isValidPassword = await new Promise<boolean>((resolve, reject) => {
      bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private setTokenCookie(res: Response, token: string) {
    res.cookie('auth_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });
  }

  async login(
    res: Response,
    { email, password }: { email: string; password: string },
  ) {
    this.isValidRequest({ email, password });

    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.validatePassword(password, user.password);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' },
    );

    await this.redisService.set(`session:${token}`, JSON.stringify(user), 3600);

    this.setTokenCookie(res, token);

    return res.status(200).json({
      message: 'Login successful',
      role: user.role,
    });
  }

  async logout(userId: string) {
    await this.redisService.delete(`auth:token:${userId}`);
    return { message: 'Logged out successfully' };
  }
}
