import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { User } from './entities/user.entity';
import { DeleteUserDto } from './dto/delete-user.dto';
import { EntityWithId } from 'src/survey.type';
import { CurrentUser } from 'src/auth/current.user.decorator';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageReqDto } from 'src/common/dto/pagination.dto';

@Controller('user')
@ApiTags('api')
@ApiExtraModels(PageReqDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 이메일로 회원찾기
  @Get('/search')
  @ApiOperation({ summary: '이메일로 회원 찾기' })
  async findUser(
    @Query() { page, size }: PageReqDto,
    @Body(new ValidationPipe()) { email }: SearchUserDto,
  ) {
    return await this.userService.findUser(email);
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
