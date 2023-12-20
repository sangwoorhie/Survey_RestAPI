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
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpReqDto, SignInReqDto } from './dto/req.dto';

@ApiTags('auth')
@ApiExtraModels(SignUpReqDto, SignInReqDto)
@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입
  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  async signup(@Body(new ValidationPipe()) createDto: SignUpReqDto) {
    return await this.authService.signup(createDto);
  }

  // 로그인
  @Post('/signin')
  @ApiOperation({ summary: '로그인' })
  async signin(@Body() { email, password }: SignInReqDto) {
    return this.authService.signin(email, password);
  }

  // 내정보 보기
}
