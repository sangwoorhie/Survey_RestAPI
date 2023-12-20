import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class SearchUserDto {
  @ApiProperty({
    required: true,
    description: '이메일',
    example: 'nestjs@naver.com',
  })
  @IsEmail()
  @IsString()
  email: string;
}
