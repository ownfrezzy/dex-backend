import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { GetMatchingOrdersDto } from './dtos/get-matching-orders.dto';
import { Order } from '../schemas/order.schema';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('getOrders')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @ApiOperation({
    description: 'Returns array of orders based on optional params',
  })
  async getOrders(@Query() query: GetOrdersDto): Promise<Order[]> {
    return await this.ordersService.findAll(query);
  }

  @Get('getMatchingOrders')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getMatchingOrders(
    @Query() query: GetMatchingOrdersDto,
  ): Promise<Order['id'][]> {
    return await this.ordersService.findMatching(query);
  }
}
