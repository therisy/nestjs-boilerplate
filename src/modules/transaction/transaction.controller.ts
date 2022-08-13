import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { Transaction } from '@modules/transaction/etc/transaction.schema';
import { TransactionService } from '@modules/transaction/transaction.service';
import { GetTransactionsQuery } from '@modules/transaction/etc/get-transactions.query';
import { User } from '@decorators/user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@guards/jwt.guard';
import { RoleGuard } from '@guards/role.guard';
import { RoleType } from '@enums/role.enum';
import { Roles } from '@decorators/role.decorator';

@Controller('transaction')
@ApiTags('Transaction')
@UseGuards(JwtGuard, RoleGuard)
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Get('@me')
  @Roles(RoleType.USER)
  async getMyTransactions(
    @User() user,
    @Query() query: GetTransactionsQuery,
  ): Promise<PaginateResult<Transaction>> {
    const { page } = query;

    return await this.service.getMyTransactions(user, page);
  }
}
