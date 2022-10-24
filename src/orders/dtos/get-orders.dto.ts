import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetOrdersDto {
  @ApiProperty({ required: false })
  @IsOptional()
  tokenA: string;
  @ApiProperty({ required: false })
  @IsOptional()
  tokenB: string;
  @ApiProperty({ required: false })
  @IsOptional()
  user: string;
  @ApiProperty({
    required: false,
    default: false,
    description: 'If set to true - returns only opened(not cancelled) orders',
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  active?: boolean = false;
}
