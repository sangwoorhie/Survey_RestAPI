import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsNumber,
} from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    required: true,
    description: '문항 번호',
  })
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsNumber()
  readonly questionNumber: number;

  @ApiProperty({
    required: true,
    description: '문항 내용',
  })
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsString({ message: '문자열을 입력해주세요.' })
  @MinLength(10, { message: '최소 10글자 이상이어야 합니다.' })
  @MaxLength(50, { message: '최대 50글자까지 입력 가능합니다.' })
  readonly content: string;
}
