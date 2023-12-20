import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { SearchUserDto } from './dto/search-user.dto';
import { User } from './entities/user.entity';
import { DeleteUserDto } from './dto/delete-user.dto';
import { EntityWithId } from 'src/survey.type';
import { CurrentUser } from 'src/auth/current.user.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원가입
  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  async createUser(@Body(new ValidationPipe()) createDto: CreateUserDto) {
    return await this.userService.createUser(createDto);
  }

  // 이메일로 회원찾기
  @Get('/search')
  @ApiOperation({ summary: '이메일로 회원 찾기' })
  async findUser(@Body(new ValidationPipe()) searchDto: SearchUserDto) {
    return await this.userService.findUser(searchDto);
  }

  // 내정보 수정
  @Patch()
  @ApiOperation({ summary: '내 정보 수정' })
  async updateUser(
    @CurrentUser() user: User,
    @Body(new ValidationPipe()) updateDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(user, updateDto);
  }

  // 회원탈퇴
  @Delete()
  @ApiOperation({ summary: '회원 탈퇴' })
  async deleteUser(
    @CurrentUser() user: User,
    @Body(new ValidationPipe()) deleteDto: DeleteUserDto,
  ) {
    await this.userService.deleteUser(user, deleteDto);
    return new EntityWithId(user.id);
  }
}
