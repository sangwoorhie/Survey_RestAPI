import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/routes/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // 토큰 발급
  public getTokenForUser(user: User): string {
    return this.jwtService.sign({
      email: user.email,
      sub: user.id,
    });
  }

  // 비밀번호 해싱
  public async hashPassword(password: string): Promise<string> {
    const DEFAULT_SALT = 10;
    return await bcrypt.hash(password, DEFAULT_SALT);
  }
}
