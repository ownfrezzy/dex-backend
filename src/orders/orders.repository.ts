import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  PipelineStage,
  UpdateWriteOpResult,
} from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { FindMatchingOrdersQuery, IOrder } from './interfaces';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  getAggregationPipeline(params: FindMatchingOrdersQuery): PipelineStage[] {
    const { tokenA, tokenB } = params;
    return [
      {
        $match: {
          tokenA: tokenB,
          tokenB: tokenA,
          isCancelled: false,
        },
      },
      {
        $sort: { blockNumber: 1 },
      },
    ];
  }

  async aggregateMatchingOrders(
    params: FindMatchingOrdersQuery,
  ): Promise<IOrder[]> {
    const aggregate = this.getAggregationPipeline(params);
    return this.orderModel.aggregate(aggregate);
  }

  async findAll(params: FilterQuery<OrderDocument>): Promise<Order[]> {
    return this.orderModel.find(params);
  }

  async findOne(param: FilterQuery<OrderDocument>): Promise<Order> {
    return this.orderModel.findOne(param);
  }

  async save(order: OrderDocument): Promise<Order> {
    return order.save();
  }

  async create(orderData: Order): Promise<Order> {
    const newOrder = new this.orderModel(orderData);

    return newOrder.save();
  }

  async createIfNotExists(orderData: Order): Promise<UpdateWriteOpResult> {
    return this.orderModel.updateOne(
      {
        id: orderData.id,
      },
      { $setOnInsert: orderData },
      { upsert: true },
    );
  }
}
