import { Controller, Get, Delete, Param, Post, Body } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  // Obter um valor do Redis
  @Get(':key')
  async getValue(@Param('key') key: string) {
    const value = await this.redisService.get(key);
    if (!value) return { message: 'Key not found' };
    return { key, value };
  }

  // Armazenar um valor no Redis
  @Post()
  async setValue(@Body() body: { key: string; value: string; ttl?: number }) {
    await this.redisService.set(body.key, body.value, body.ttl);
    return { message: `Key '${body.key}' set successfully` };
  }

  // Remover uma chave do Redis
  @Delete(':key')
  async deleteKey(@Param('key') key: string) {
    await this.redisService.delete(key);
    return { message: `Key '${key}' deleted successfully` };
  }
}
