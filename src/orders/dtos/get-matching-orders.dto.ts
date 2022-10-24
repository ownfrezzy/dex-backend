import { IsNumber, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetMatchingOrdersDto {
  @ApiProperty({ description: 'Buy token address' })
  @IsString()
  tokenA: string;
  @ApiProperty({ description: 'Sell token address' })
  @IsString()
  tokenB: string;
  @ApiProperty({ description: 'Buy token amount. Market order if set to 0' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amountA: number;
  @ApiProperty({ description: 'Sell token amount' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amountB: number;
}
