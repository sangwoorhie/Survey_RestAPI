import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateSurveyDto {
  @ApiProperty({
    required: true,
    description: '설문지 제목',
  })
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsString({ message: '문자열을 입력해주세요.' })
  @MinLength(5, { message: '최소 5글자 이상이어야 합니다.' })
  @MaxLength(50, { message: '최대 50글자까지 입력 가능합니다.' })
  readonly title: string;

  @ApiProperty({
    required: true,
    description: '설문지 내용',
  })
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsString({ message: '문자열을 입력해주세요.' })
  @MinLength(20, { message: '최소 20글자 이상이어야 합니다.' })
  @MaxLength(500, { message: '최대 500글자까지 입력 가능합니다.' })
  readonly description: string;
}
