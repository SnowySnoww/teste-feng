import { RedisService } from './../redis/redis.service';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/_db/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, RedisService],
})
export class AuthModule {}
