import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, Matches, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    required: true,
    description: '현재 비밀번호',
    example: 'Password123',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    required: true,
    description: '변경 비밀번호',
    example: 'pAssword456',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/, {
    message:
      '비밀번호는 최소 4자 이상의 영문 대소문자 및 숫자로 이루어져야 합니다.',
  })
  newPassword: string;

  @ApiProperty({
    required: true,
    description: '이름',
    example: 'John',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string;
}
