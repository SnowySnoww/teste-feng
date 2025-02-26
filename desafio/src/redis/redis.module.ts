import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        try {
          const client = createClient({ url: 'redis://localhost:6379' });
          client.on('error', (err) =>
            console.error('❌ Redis Client Error', err),
          );
          await client.connect();
          console.log('✅ Redis Connected Successfully');
          return client;
        } catch (error) {
          console.error('❌ Redis Connection Failed:', error);
          throw error;
        }
      },
    },
    RedisService,
  ],
  controllers: [RedisController],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
