import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { Web3Service } from '../web3/web3.service';
import { OrdersService } from '../orders/orders.service';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [OrdersModule],
})
export class WarmupModule implements OnApplicationBootstrap {
  constructor(
    private web3Service: Web3Service,
    @Inject(OrdersService) private orderService,
  ) {}

  async onApplicationBootstrap() {
    const pastEvents =
      await this.web3Service.orderControllerContract.getPastEvents(
        'allEvents',
        {
          fromBlock: 0,
        },
      );
    const orderCreatedEvents = pastEvents.filter(
      (event) => event.event === 'OrderCreated',
    );
    const orderCancelledEvents = pastEvents.filter(
      (event) => event.event === 'OrderCancelled',
    );
    const orderMatched = pastEvents.filter(
      (event) => event.event === 'OrderMatched',
    );
    await Promise.all(
      orderCreatedEvents.map((event) =>
        this.orderService.createIfNotExists(event),
      ),
    );

    await Promise.all(
      orderCancelledEvents.map((event) => {
        this.orderService.cancel(event);
      }),
    );

    orderMatched.forEach((event) => this.orderService.match(event));
  }
}
