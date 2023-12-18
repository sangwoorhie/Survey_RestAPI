import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { SearchUserDto } from './dto/search-user.dto';
import { User } from './entities/user.entity';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 회원가입
  @Post('/signup')
  async createUser(@Body() createDto: CreateUserDto) {
    return await this.userService.createUser(createDto);
  }

  // 이메일로 회원찾기
  @Get('/search')
  async findUser(@Param('id') id: string, @Body() searchDto: SearchUserDto) {
    return await this.userService.findUser(searchDto);
  }

  // 내정보 수정
  @Patch()
  async updateUser(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return await this.userService.updateUser(updateDto);
  }

  // 회원탈퇴
  @Delete()
  async deleteUser(@Param('id') id: string, @Body() deleteDto: DeleteUserDto) {
    return await this.userService.deleteUser(deleteDto);
  }
}
