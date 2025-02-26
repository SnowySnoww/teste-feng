import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../_db/prisma.service';
import { CreateOrdersDto } from './dto/create-orders.dto';
import { RedisService } from '../redis/redis.service';

interface OrderItemResponse {
  name: string;
  description: string | null;
  quantity: number;
  value: number;
}

export interface OrderResponse {
  id: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  items: OrderItemResponse[];
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async createOrder(
    userId: string,
    createOrdersDto: CreateOrdersDto,
  ): Promise<OrderResponse> {
    try {
      if (
        !createOrdersDto ||
        !createOrdersDto.items ||
        createOrdersDto.items.length === 0
      ) {
        throw new BadRequestException('Items list cannot be empty');
      }
      if (createOrdersDto.items.some((item) => item.quantity <= 0)) {
        throw new BadRequestException('Quantity must be greater than 0');
      }

      const cacheKey = 'orders:all';

      const itemIds = createOrdersDto.items.map((item) => item.itemId);
      const existingItems = await this.prisma.item.findMany({
        where: { id: { in: itemIds } },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
        },
      });
      const existingItemIds = new Set(existingItems.map((item) => item.id));

      const invalidItems = itemIds.filter((id) => !existingItemIds.has(id));
      if (invalidItems.length > 0) {
        throw new BadRequestException(
          `Invalid item(s) found: ${invalidItems.join(', ')}`,
        );
      }

      const order = await this.prisma.order.create({
        data: {
          userId,
          items: {
            create: createOrdersDto.items.map((item) => ({
              itemId: item.itemId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              item: {
                select: {
                  name: true,
                  description: true,
                  price: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      const orders = await this.findAll();

      await this.redisService.set(cacheKey, JSON.stringify(orders), 3600);

      return {
        id: order.id,
        createdAt: order.createdAt,
        user: order.user,
        items: order.items.map((orderItem) => ({
          name: orderItem.item.name,
          description: orderItem.item.description,
          quantity: orderItem.quantity,
          value: Number(orderItem.item.price),
        })),
      };
    } catch {
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  async findAll(): Promise<OrderResponse[]> {
    const cacheKey = 'orders:all';

    await this.redisService.delete(cacheKey);

    try {
      const orders = await this.prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              item: {
                select: {
                  name: true,
                  description: true,
                  price: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      console.log('Fetched orders:', orders);

      const formattedOrders: OrderResponse[] = orders.map((order) => ({
        id: order.id,
        createdAt: order.createdAt,
        user: {
          id: order.user.id,
          name: order.user.name,
          email: order.user.email,
          phone: order.user.phone,
        },
        items: order.items.map((orderItem) => ({
          name: orderItem.item.name,
          description: orderItem.item.description,
          quantity: orderItem.quantity,
          value: Number(orderItem.item.price),
        })),
      }));

      console.log('Formatted orders:', formattedOrders);

      await this.redisService.set(
        cacheKey,
        JSON.stringify(formattedOrders),
        3600,
      );

      return formattedOrders;
    } catch (error) {
      console.error('Error retrieving orders:', error);
      throw new InternalServerErrorException('Failed to retrieve orders');
    }
  }

  async findByUser(userId: string): Promise<OrderResponse[]> {
    const cacheKey = `orders:user:${userId}`;

    const cachedOrders = await this.redisService.get(cacheKey);

    if (cachedOrders) {
      return JSON.parse(cachedOrders) as OrderResponse[];
    }

    try {
      const orders = await this.prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              item: {
                select: {
                  name: true,
                  description: true,
                  price: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      await this.redisService.set(cacheKey, JSON.stringify(orders), 3600);

      return orders.map((order) => ({
        id: order.id,
        createdAt: order.createdAt,
        user: order.user,
        items: order.items.map((orderItem) => ({
          name: orderItem.item.name,
          description: orderItem.item.description,
          quantity: orderItem.quantity,
          value: Number(orderItem.item.price),
        })),
      }));
    } catch {
      throw new InternalServerErrorException('Failed to retrieve user orders');
    }
  }
}
