import { PartialType } from '@nestjs/mapped-types';
import { IsString, MaxLength, MinLength, IsNotEmpty } from 'class-validator';
import { CreateQuestionDto } from './create-question.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
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
