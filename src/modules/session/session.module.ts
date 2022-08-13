import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@modules/user/user.module';
import { JwtStrategy } from '@strategies/jwt.strategy';
import { TransactionModule } from '@modules/transaction/transaction.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from '@modules/transaction/etc/transaction.schema';
import CONFIG from '@config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
    ]),
    JwtModule.register({
      secret: CONFIG.SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    UserModule,
    TransactionModule,
    HttpModule,
  ],
  controllers: [SessionController],
  providers: [SessionService, JwtStrategy],
})
export class SessionModule {}
