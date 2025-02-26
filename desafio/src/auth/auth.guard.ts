import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CustomRequest>(); // Use the extended type

    const token: string | undefined =
      (request.cookies?.auth_token as string | undefined) ||
      request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      interface DecodedToken {
        id: string;
        email: string;
        role: string;
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret',
      ) as DecodedToken;

      request.user = decoded;
      return Promise.resolve(true);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
