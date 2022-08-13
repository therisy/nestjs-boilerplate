import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTransactionsQuery {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  page: number;
}
