import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '@modules/user/etc/user.schema';
import { TransactionModule } from '@modules/transaction/transaction.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TransactionSchema } from '@modules/transaction/etc/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Transaction', schema: TransactionSchema },
    ]),
    HttpModule,
    TransactionModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
