import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { UserService } from './user.service';
import { Throttle } from '@nestjs/throttler';
import { CreateUserDto } from './etc/create-user.dto';
import { User } from '@decorators/user.decorator';
import { JwtGuard } from '@guards/jwt.guard';
import { RoleGuard } from '@guards/role.guard';
import { Roles } from '@decorators/role.decorator';
import { RoleType } from '@enums/role.enum';
import { UpdateUserDto } from '@modules/user/etc/update-user.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Throttle(1, 60 * 8)
  @Post()
  async create(@Body() createDTO: CreateUserDto, @Req() req: FastifyRequest) {
    return await this.userService.create(createDTO, req);
  }

  @Get('@me')
  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RoleType.USER)
  async getMe(@User() user) {
    return await this.userService.getMe(user);
  }

  @Patch('@me')
  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RoleType.USER)
  async update(@User() user, @Body() updateDTO: UpdateUserDto) {
    return await this.userService.update(user, updateDTO);
  }

  @Put('password')
  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RoleType.USER)
  async updatePassword(@User() user, @Body() updateDTO: UpdateUserDto) {
    return await this.userService.updatePassword(user, updateDTO);
  }
}
