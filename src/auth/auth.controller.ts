import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './current.user.decorator';
import { User } from 'src/routes/user/entities/user.entity';
import { AuthGuardJwt } from './guards/jwt-auth.guard';
import { AuthGuardLocal } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 로그인
  @Post('/login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  // 내정보 보기
  @Get('profile')
  @UseGuards(AuthGuardJwt)
  async getProfile(@CurrentUser() user: User) {
    return await user;
  }
}
