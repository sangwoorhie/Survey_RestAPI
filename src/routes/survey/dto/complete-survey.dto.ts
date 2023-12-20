import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CompleteSurveyDto {
  @ApiProperty({
    required: true,
    description: '설문지 완료 여부',
    example: 'true',
  })
  @IsNotEmpty({
    message:
      '설문지 완료 여부를 기입해주세요. 설문지가 완료되었을 경우, `true`를 작성해주세요.',
  })
  @IsBoolean()
  readonly isDone: boolean;
}
