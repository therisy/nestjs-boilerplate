import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FastifyRequest } from 'fastify';
import * as bcrypt from 'bcryptjs';
import { User } from '@modules/user/etc/user.schema';
import { CreateUserDto } from './etc/create-user.dto';
import { RoleType } from '@enums/role.enum';
import { UpdateUserDto } from '@modules/user/etc/update-user.dto';
import CONFIG from '@config';
import { TransactionService } from '@modules/transaction/transaction.service';
import { Transaction } from '@modules/transaction/etc/transaction.schema';
import { ActionType } from '@enums/action.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly model: Model<User>,
    @InjectModel('Transaction')
    private readonly transactionModel: Model<Transaction>,
    private readonly httpService: HttpService,
    private readonly transactionService: TransactionService,
  ) {}

  async create(dto: CreateUserDto, req: FastifyRequest): Promise<boolean> {
    dto.username = dto.username.toLowerCase();
    const exist = await this.model.findOne({ username: dto.username });
    if (exist) throw new ConflictException('Username already exists');

    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${CONFIG.CAPTCHA_SECRET}&response=${dto.captcha}`;
    const res = await this.httpService.get(url).toPromise();
    if (!res.data.success) throw new BadRequestException('Captcha failed');

    const user = new this.model(dto);
    user.role = RoleType.USER;
    user.password = await bcrypt.hash(user.password, 10);
    user.ip = req.ip;

    const transaction = new this.transactionModel({
      user: user._id,
      ip: user.ip,
      action: ActionType.LOGIN,
    });

    await this.transactionService.create(transaction);

    await user.save();

    return true;
  }

  async getMe(user) {
    return Object.assign(user, {
      password: undefined,
      freeze: undefined,
      updatedAt: undefined,
    });
  }

  async removeFreeze(user: User): Promise<User> {
    return this.model.findOneAndUpdate(
      {
        _id: user._id,
        freeze: true,
      },
      { freeze: false },
      { new: true },
    );
  }

  async getByUsernameAsAdmin(username: string): Promise<User> {
    return this.model.findOne({
      username: username.toLowerCase(),
    });
  }

  async getUserById(id: string): Promise<User> {
    return this.model.findOne({ _id: id, freeze: { $ne: true } });
  }

  async update(user: User, dto: UpdateUserDto): Promise<User> {
    const exist = await this.model.findOne({
      username: dto.username,
      freeze: { $ne: true },
    });
    if (exist && exist.id !== user.id)
      throw new ConflictException('Username already exists');

    return this.model.findOneAndUpdate(
      {
        _id: user._id,
      },
      { username: dto.username, freeze: dto.freeze },
      { new: true },
    );
  }

  async updatePassword(user: User, dto): Promise<boolean> {
    const exist = await this.model.findById(user._id);
    if (!exist) throw new BadRequestException('User not found');

    if (dto.newPassword !== dto.newPasswordConfirm) {
      throw new BadRequestException('New password not match');
    }

    const match = await bcrypt.compare(dto.newPassword, exist.password);
    if (!match) throw new BadRequestException('Password not match');

    exist.password = await bcrypt.hash(dto.newPassword, 10);
    await exist.save();

    return true;
  }
}
