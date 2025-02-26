import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Res() res: Response,
    @Body() body: { email?: string; password?: string },
  ) {
    if (!body || !body.email || !body.password) {
      throw new BadRequestException('Email and password are required');
    }

    return this.authService.login(res, {
      email: body.email,
      password: body.password,
    });
  }

  @Post('logout')
  async logout(@Res() res: Response, @Body() body: { userId: string }) {
    if (!body || !body.userId) {
      throw new BadRequestException('User ID is required');
    }

    return this.authService.logout(body.userId);
  }
}
