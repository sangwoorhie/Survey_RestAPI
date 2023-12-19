import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SearchUserDto } from './dto/search-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';
import { EntityWithId } from 'src/survey.type';

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
    try {
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
    } catch (error) {
      this.logger.error(`회원가입 중 에러가 발생했습니다: ${error.message}`);
      throw error;
    }
  }

  // 이메일로 회원찾기
  async findUser(searchDto: SearchUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: searchDto.email,
        },
        select: ['id', 'name', 'email', 'status'],
      });
      if (!user) {
        throw new NotFoundException(
          '해당 이메일의 사용자가 조회되지 않습니다.',
        );
      }
      return user;
    } catch (error) {
      this.logger.error(
        `해당 회원 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 내정보 수정
  async updateUser(user: User, updateDto: UpdateUserDto): Promise<User> {
    try {
      const comparedPassword = await bcrypt.compare(
        updateDto.currentPassword,
        user.password,
      );
      if (!comparedPassword) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }

      const newPassword = await this.authService.hashPassword(
        updateDto.newPassword,
      );

      await this.userRepository.update(
        { id: user.id },
        { password: newPassword, name: updateDto.name },
      );
      return this.userRepository.findOne({ where: { id: user.id } });
    } catch (error) {
      this.logger.error(
        `내 정보 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 회원탈퇴
  async deleteUser(
    user: User,
    deleteDto: DeleteUserDto,
  ): Promise<EntityWithId> {
    try {
      const userId = user.id;
      const comparedPassword = await bcrypt.compare(
        deleteDto.password,
        user.password,
      );
      if (!comparedPassword) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }
      await this.userRepository.softDelete({ id: user.id });
      return new EntityWithId(userId);
    } catch (error) {
      this.logger.error(`회원 탈퇴 중 에러가 발생했습니다: ${error.message}`);
      throw error;
    }
  }
}
