import { Injectable } from '@nestjs/common';
import { PaginateModel, PaginateResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from '@modules/transaction/etc/transaction.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction')
    private readonly model: PaginateModel<Transaction>,
  ) {}

  async create(transaction: Transaction): Promise<Transaction> {
    return this.model.create(transaction);
  }

  async getMyTransactions(
    user,
    page = 0,
  ): Promise<PaginateResult<Transaction>> {
    return this.model.paginate(
      {
        user: user._id,
      },
      {
        page,
        limit: 10,
        sort: {
          createdAt: -1,
        },
      },
    );
  }
}
