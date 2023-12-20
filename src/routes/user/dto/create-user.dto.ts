import {
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { Status } from '../userinfo';

export class CreateUserDto {
  @IsEmail()
  @MinLength(4)
  @MaxLength(20)
  @Matches(
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
    {
      message: '이메일 형식이 올바르지 않습니다.',
    },
  )
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/, {
    message:
      '비밀번호는 최소 4자 이상의 영문 대소문자 및 숫자로 이루어져야 합니다.',
  })
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  confirmPassword: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @IsEnum(Status, {
    message: `학생일 경우 'student', 교사일 경우 'teacher'를 입력해주세요.`,
  })
  status: Status;
}
