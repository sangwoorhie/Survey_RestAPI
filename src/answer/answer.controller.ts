import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { EntityWithId } from 'src/survey.type';
import { AuthGuardJwt } from 'src/auth/guards/auth.guard.jwt';
import { CurrentUser } from 'src/auth/current.user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('surveys')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  // 답안 생성
  @Post('/:surveyId/questions/:questionId/answers')
  @UseGuards(AuthGuardJwt)
  async createAnswer(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Body() createDto: CreateAnswerDto,
    @CurrentUser() user: User,
  ) {
    return await this.answerService.createAnswer(
      surveyId,
      questionId,
      createDto,
      user,
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
    @CurrentUser() user: User,
  ) {
    return await this.answerService.updateAnswer(
      surveyId,
      questionId,
      answerId,
      updateDto,
      user,
    );
  }

  // 답안 삭제
  @Delete('/:surveyId/questions/:questionId/answers/:answerId')
  async deleteAnswer(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('optionId') answerId: number,
    @CurrentUser() user: User,
  ) {
    await this.answerService.deleteAnswer(surveyId, questionId, answerId, user);
    return new EntityWithId(answerId);
  }
}
