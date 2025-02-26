import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { ItemsModule } from './items/items.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [AuthModule, OrdersModule, ItemsModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
