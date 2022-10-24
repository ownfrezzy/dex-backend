import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Web3Module } from './web3/web3.module';
import { EventListenerModule } from './event-listener/event-listener.module';
import { WarmupModule } from './warmup/warmup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    Web3Module,
    EventListenerModule,
    WarmupModule,
  ],
})
export class AppModule {}
