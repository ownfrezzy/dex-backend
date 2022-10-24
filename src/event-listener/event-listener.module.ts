import { Inject, Module } from '@nestjs/common';
import { Web3Service } from '../web3/web3.service';
import { OrdersService } from '../orders/orders.service';
import { OrdersModule } from '../orders/orders.module';
import { Web3Event } from '../orders/interfaces';

@Module({
  imports: [OrdersModule],
})
export class EventListenerModule {
  constructor(
    private web3Service: Web3Service,
    @Inject(OrdersService) private orderService,
  ) {
    this.web3Service.orderControllerContract.events
      .OrderCreated()
      .on('data', (event: Web3Event) => {
        this.orderService.create(event);
      });

    this.web3Service.orderControllerContract.events
      .OrderCancelled()
      .on('data', (event: Web3Event) => {
        this.orderService.cancel(event);
      });

    this.web3Service.orderControllerContract.events
      .OrderMatched()
      .on('data', (event: Web3Event) => {
        this.orderService.match(event);
      });
  }
}
