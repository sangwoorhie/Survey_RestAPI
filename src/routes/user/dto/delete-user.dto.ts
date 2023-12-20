import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    required: true,
    description: 'password',
    example: 'Password123',
  })
  @IsString()
  password: string;
}
