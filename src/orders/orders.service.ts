import { Injectable } from '@nestjs/common';
import { Order, OrderDocument } from '../schemas/order.schema';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { GetMatchingOrdersDto } from './dtos/get-matching-orders.dto';
import { OrdersRepository } from './orders.repository';
import { UpdateWriteOpResult } from 'mongoose';
import { FindMatchingOrdersQuery, IOrder, Web3Event } from './interfaces';
import { sleep } from '../utils';
import { divide, bignumber, multiply, number, subtract } from 'mathjs';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  private async findFillingOrders(
    query: FindMatchingOrdersQuery,
  ): Promise<string[]> {
    const { amountA, amountB } = query;
    const bigNumberAmountA = bignumber(amountA);
    const bigNumberAmountB = bignumber(amountB);
    const aggregatedOrders: IOrder[] =
      await this.ordersRepository.aggregateMatchingOrders(query);
    const aggregatedOrdersWithPrices = aggregatedOrders.map((order) => {
      const price = divide(bignumber(order.amountA), bignumber(order.amountB));
      return { ...order, price };
    });

    const requestedPrice = divide(bigNumberAmountA, bigNumberAmountB);

    let orders: Order[];
    const result: string[] = [];
    const isMarket = amountA === 0;
    if (!isMarket) {
      // Removes invalid orders for limit order
      orders = aggregatedOrdersWithPrices.filter((order) => {
        return (
          order.price <= requestedPrice &&
          multiply(bigNumberAmountA, bignumber(order.amountA)) <=
            multiply(bigNumberAmountB, bignumber(order.amountB))
        );
      });
      // Loops through valid orders until one of the assets is filled
      for (
        let i = 0,
          amountLeftToFillA = bigNumberAmountA,
          amountLeftToFillB = bigNumberAmountB;
        i < orders.length &&
        number(amountLeftToFillB) > 0 &&
        number(amountLeftToFillA) > 0;
        i++
      ) {
        const order = orders[i];
        const availableAmountA = bignumber(
          order.amountLeftToFillA || order.amountA,
        );
        const availableAmountB = bignumber(
          order.amountLeftToFillB || order.amountB,
        );

        result.push(order.id);

        amountLeftToFillA = subtract(amountLeftToFillA, availableAmountB);
        amountLeftToFillB = subtract(amountLeftToFillB, availableAmountA);
      }
    } else {
      orders = aggregatedOrdersWithPrices;

      // For market orders loops until amountB is filled
      for (
        let i = 0, amountLeftToFillB = bigNumberAmountB;
        i < orders.length && number(amountLeftToFillB) > 0;
        i++
      ) {
        const order = orders[i];

        result.push(order.id);
        amountLeftToFillB = subtract(
          amountLeftToFillB,
          bignumber(order.amountA),
        );
      }
    }

    return result;
  }

  async findAll(query: GetOrdersDto): Promise<Order[]> {
    const { tokenA, tokenB, user, active } = query;
    const params = Object.assign(
      {},
      tokenA && { tokenA },
      tokenB && { tokenB },
      user && { user },
      active && { isCancelled: false },
    );

    return this.ordersRepository.findAll(params);
  }

  async findMatching(query: GetMatchingOrdersDto): Promise<string[]> {
    return this.findFillingOrders(query);
  }

  async create(event: Web3Event): Promise<Order> {
    const { returnValues, blockNumber } = event;
    const orderData = {
      ...returnValues,
      isCancelled: false,
      blockNumber,
      amountLeftToFillA: returnValues.amountA,
      amountLeftToFillB: returnValues.amountB,
    };

    return this.ordersRepository.create(orderData as Order);
  }

  async createIfNotExists(event: Web3Event): Promise<UpdateWriteOpResult> {
    const { returnValues, blockNumber } = event;
    const orderData = {
      ...returnValues,
      isCancelled: false,
      blockNumber,
      amountLeftToFillA: returnValues.amountA,
      amountLeftToFillB: returnValues.amountB,
    };

    return this.ordersRepository.createIfNotExists(orderData as Order);
  }

  async match(event: Web3Event): Promise<Order> {
    const { returnValues } = event;
    const { id, amountLeftToFill } = returnValues;
    let order = await this.ordersRepository.findOne({ id });

    if (!order) {
      // @TODO: considering another way to handle null order
      await sleep(50);
      order = await this.ordersRepository.findOne({ id });
    }

    order.amountLeftToFillA = amountLeftToFill;
    order.amountLeftToFillB = multiply(
      divide(bignumber(amountLeftToFill), bignumber(order.amountA)),
      bignumber(order.amountB),
    ).toString();

    if (amountLeftToFill === '0') order.isCancelled = true;

    return this.ordersRepository.save(order as OrderDocument);
  }

  async cancel(event: Web3Event): Promise<Order> {
    const { returnValues } = event;
    const { id } = returnValues;
    const order = await this.ordersRepository.findOne({ id });
    order.isCancelled = true;

    return this.ordersRepository.save(order as OrderDocument);
  }
}
