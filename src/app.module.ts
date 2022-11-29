import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@modules/user/user.module';
import { SessionModule } from '@modules/session/session.module';
import { validate } from '@core/config/validation';
import CONFIG from './config';

@Module({
  imports: [
    MongooseModule.forRoot(CONFIG.MONGO_URL),
    ConfigModule.forRoot({ validate }),
    UserModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
