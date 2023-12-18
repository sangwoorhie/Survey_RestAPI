import { IsString, IsEmail } from 'class-validator';

export class SearchUserDto {
  @IsEmail()
  @IsString()
  email: string;
}
