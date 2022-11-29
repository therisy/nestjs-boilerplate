import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '@modules/user/user.service';
import { CreateSessionDto } from './etc/create-session.dto';
import CONFIG from '@config';

@Injectable()
export class SessionService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {}

  async create(dto: CreateSessionDto): Promise<string> {
    const user = await this.userService.getByUsernameAsAdmin(dto.username);
    if (!user) throw new NotFoundException('User not found');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new NotFoundException('Password does not match');

    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${CONFIG.CAPTCHA_SECRET}&response=${dto.captcha}`;
    const res = await this.httpService.get(url).toPromise();
    if (!res.data.success) throw new BadRequestException('Captcha failed');

    return this.jwtService.sign({
      id: user._id,
      username: user.username,
    });
  }

  async verify(payload: any): Promise<any> {
    const timeDiff = payload.exp - Date.now() / 1000;
    if (timeDiff <= 0) throw new UnauthorizedException('Access token expired');

    const user = await this.userService.getUserById(payload.id);
    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }
}
