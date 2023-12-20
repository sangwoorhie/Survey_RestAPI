import { LocalStrategy } from './strategy/local.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/routes/user/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from '../routes/user/user.module';
import { UserService } from 'src/routes/user/user.service';
import { RefreshToken } from './entities/refreshToken.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User, RefreshToken]),
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: process.env.AUTH_SECRET,
        signOptions: {
          expiresIn: '2h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, JwtService, UserService, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
