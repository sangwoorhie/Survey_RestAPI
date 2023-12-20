import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateOptionDto {
  @ApiProperty({
    required: true,
    description: '선택지 번호',
  })
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsNumber()
  @Min(1, { message: '최소 숫자는 1입니다' })
  @Max(5, { message: '최대 숫자는 5입니다' })
  readonly optionNumber: number;

  @ApiProperty({
    required: true,
    description: '선택지 내용',
  })
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsString({ message: '문자열을 입력해주세요.' })
  @MaxLength(20, { message: '최대 20글자까지 입력 가능합니다.' })
  readonly content: string;

  @ApiProperty({
    required: true,
    description: '선택지 점수',
  })
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsNumber()
  @Min(1, { message: '최소 숫자는 1입니다' })
  @Max(5, { message: '최대 숫자는 5입니다' })
  readonly optionScore: number;
}
