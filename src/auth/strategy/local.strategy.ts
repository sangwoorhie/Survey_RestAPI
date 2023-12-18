import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }
  public async validate(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      this.logger.debug(`E-mail ${email}이 조회되지 않습니다.`);
      throw new UnauthorizedException();
    }
    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`올바른 비밀번호가 아닙니다.`);
      throw new UnauthorizedException();
    }
    return user;
  }
}
