import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { EntityWithId } from 'src/survey.type';

@Controller('surveys')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  // 답안 생성
  @Post('/:surveyId/questions/:questionId/answers')
  async createAnswer(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Body() createDto: CreateAnswerDto,
  ) {
    return await this.answerService.createAnswer(
      surveyId,
      questionId,
      createDto,
    );
  }

  // 답안 목록조회
  @Get('/:surveyId/questions/:questionId/answers')
  async getAnswers(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
  ) {
    return await this.answerService.getAnswers(surveyId, questionId);
  }

  // 답안 상세조회
  @Get('/:surveyId/questions/:questionId/answers/:answerId')
  async getAnswer(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('answerId') answerId: number,
  ) {
    return await this.answerService.getAnswer(surveyId, questionId, answerId);
  }

  // 답안 수정
  @Patch('/:surveyId/questions/:questionId/answers/:answerId')
  async updateAnswer(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('answerId') answerId: number,
    @Body() updateDto: UpdateAnswerDto,
  ) {
    return await this.answerService.updateAnswer(
      surveyId,
      questionId,
      answerId,
      updateDto,
    );
  }

  // 답안 삭제
  @Delete('/:surveyId/questions/:questionId/answers/:answerId')
  async deleteAnswer(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('optionId') answerId: number,
  ) {
    await this.answerService.deleteAnswer(surveyId, questionId, answerId);
    return new EntityWithId(answerId);
  }
}
