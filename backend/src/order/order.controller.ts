import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { Response } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() orderDto: OrderDto, @Res() res: Response) {
    try {
      const result = await this.orderService.bookSeats(orderDto);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return res.status(error.status || HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}