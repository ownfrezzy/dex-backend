import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @ApiProperty()
  @Prop()
  id: string;
  @Prop()
  @ApiProperty()
  tokenA: string;
  @Prop()
  @ApiProperty()
  tokenB: string;
  @Prop()
  @ApiProperty()
  amountA: string;
  @Prop()
  @ApiProperty()
  amountB: string;
  @Prop()
  @ApiProperty()
  user: string;
  @Prop()
  @ApiProperty()
  isMarket: boolean;
  @Prop()
  @ApiProperty()
  isCancelled: boolean;
  @Prop()
  @ApiProperty()
  amountLeftToFillA: string;
  @Prop()
  @ApiProperty()
  amountLeftToFillB: string;
  @Prop()
  @ApiProperty()
  blockNumber: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
