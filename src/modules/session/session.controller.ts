import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './etc/create-session.dto';
import { JwtGuard } from '@guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('session')
@ApiTags('Session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async create(@Body() dto: CreateSessionDto): Promise<string> {
    return await this.sessionService.create(dto);
  }
}
