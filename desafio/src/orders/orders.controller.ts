import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService, OrderResponse } from './orders.service';
import { CreateOrdersDto } from './dto/create-orders.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Request() req: { user: { id: string } },
    @Body() createOrderDto?: CreateOrdersDto,
  ): Promise<any> {
    if (
      !createOrderDto ||
      !createOrderDto.items ||
      createOrderDto.items.length === 0
    ) {
      throw new BadRequestException('Items list is empty');
    }

    if (createOrderDto.items.some((item) => item.quantity <= 0)) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    return this.ordersService.createOrder(req.user.id, createOrderDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Request() req: { user: { id: string; role: string } },
  ): Promise<OrderResponse[]> {
    if (req.user.role === 'ADMIN') {
      return this.ordersService.findAll();
    }
    return this.ordersService.findByUser(req.user.id);
  }
}
