import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty({ message: '필수 항목입니다.' })
  @IsNumber()
  @Min(1, { message: '최소 숫자는 1입니다' })
  @Max(5, { message: '최대 숫자는 5입니다' })
  readonly answerNumber: number;
}
