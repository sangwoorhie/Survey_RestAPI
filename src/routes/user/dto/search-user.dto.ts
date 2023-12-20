import { IsString, IsEmail } from 'class-validator';

export class SearchUserDto {
  @ApiProperty({
    required: true,
    description: 'E-mail',
    example: 'nestjs@naver.com',
  })
  @IsEmail()
  @IsString()
  email: string;
}
