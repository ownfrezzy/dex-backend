import { Order } from '../../schemas/order.schema';

export interface IOrder extends Order {
  price: number;
}
