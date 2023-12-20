import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/routes/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/routes/user/user.service';
import { SignUpReqDto } from './dto/req.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refreshToken.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  // 회원가입
  async signup(createDto: SignUpReqDto) {
    const user = new User();
    try {
      if (createDto.password !== createDto.confirmPassword) {
        throw new BadRequestException(
          '비밀번호와 확인 비밀번호는 동일해야 합니다.',
        );
      }
      const existingUser = await this.userService.findUser(createDto.email);
      if (existingUser) {
        throw new BadRequestException('해당 이메일은 이미 사용중입니다.');
      }

      user.email = createDto.email;
      user.password = await this.hashPassword(createDto.password);
      user.name = createDto.name;
      user.status = createDto.status;

      return {
        ...(await this.userRepository.save(user)),
        token: this.generateAccessToken(user),
      };
    } catch (error) {
      this.logger.error(`회원가입 중 에러가 발생했습니다: ${error.message}`);
      throw error;
    }
  }

  // 로그인
  public async signin(email: string, password: string) {
    const user = await this.userService.findUser(email);
    if (!user) throw new UnauthorizedException('이메일이 존재하지 않습니다.');
    const comparedPassword = await bcrypt.compare(password, user.password);
    if (!comparedPassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    const refreshToken = await this.generateRefreshToken(user);
    await this.createRefreshTokenUsingUser(user, refreshToken);
    return { accessToken: this.generateAccessToken(user) };
  }

  // 엑세스 토큰 발급
  public generateAccessToken(user: User): string {
    const payload = { email: user.email, sub: user.id, tokenType: 'access' };
    return this.jwtService.sign(payload, { expiresIn: '2h' });
  }

  // 리프레시 토큰 발급
  public generateRefreshToken(user) {
    const payload = { email: user.email, sub: user.id, tokenType: 'refresh' };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  public async createRefreshTokenUsingUser(user, refreshToken) {
    let refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      user: { id: user.id },
    });
    if (refreshTokenEntity) {
      refreshTokenEntity.token = refreshToken;
    } else {
      refreshTokenEntity = this.refreshTokenRepository.create({
        user: { id: user.id },
        token: refreshToken,
      });
      await this.refreshTokenRepository.save(refreshTokenEntity);
    }
  }

  // 비밀번호 해싱
  async hashPassword(password: string): Promise<string> {
    const DEFAULT_SALT = 10;
    return await bcrypt.hash(password, DEFAULT_SALT);
  }
}
