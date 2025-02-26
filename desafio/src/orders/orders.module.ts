import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../_db/prisma.service';
import { RedisService } from '../redis/redis.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, RedisService],
})
export class OrdersModule {}
