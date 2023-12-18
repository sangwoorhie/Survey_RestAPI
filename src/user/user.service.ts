import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SearchUserDto } from './dto/search-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 회원가입
  async createUser(createDto: CreateUserDto) {
    const user = new User();

    if (createDto.password !== createDto.confirmPassword) {
      throw new BadRequestException(
        '비밀번호와 확인 비밀번호는 동일해야 합니다.',
      );
    }
    const existingUser = await this.userRepository.findOne({
      where: { email: createDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('해당 이메일은 이미 사용중입니다.');
    }

    user.email = createDto.email;
    user.password = await this.authService.hashPassword(createDto.password);
    user.name = createDto.name;
    user.status = createDto.status;

    return {
      ...(await this.userRepository.save(user)),
      token: this.authService.getTokenForUser(user),
    };
  }

  // 이메일로 회원찾기
  async findUser(searchDto: SearchUserDto) {}

  // 내정보 수정
  async updateUser(updateDto: UpdateUserDto) {}

  // 회원탈퇴
  async deleteUser(deleteDto: DeleteUserDto) {}
}
