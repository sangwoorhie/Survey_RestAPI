import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { EntityWithId } from 'src/survey.type';
import { AuthGuardJwt } from 'src/auth/guards/auth.guard.jwt';
import { CurrentUser } from 'src/auth/current.user.decorator';
import { User } from '../user/entities/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('surveys')
@ApiTags('api')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  // 답안 생성
  @Post('/:surveyId/questions/:questionId/answers')
  @ApiOperation({ summary: '답안 생성' })
  @UseGuards(AuthGuardJwt)
  async createAnswer(
    @Param('surveyId', ParseIntPipe) surveyId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body(new ValidationPipe()) createDto: CreateAnswerDto,
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
  @ApiOperation({ summary: '답안 목록조회' })
  async getAnswers(
    @Param('surveyId', ParseIntPipe) surveyId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
  ) {
    return await this.answerService.getAnswers(surveyId, questionId);
  }

  // 답안 상세조회
  @Get('/:surveyId/questions/:questionId/answers/:answerId')
  @ApiOperation({ summary: '답안 상세조회' })
  async getAnswer(
    @Param('surveyId', ParseIntPipe) surveyId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Param('answerId', ParseIntPipe) answerId: number,
  ) {
    return await this.answerService.getAnswer(surveyId, questionId, answerId);
  }

  // 답안 수정
  @Patch('/:surveyId/questions/:questionId/answers/:answerId')
  @ApiOperation({ summary: '답안 수정' })
  async updateAnswer(
    @Param('surveyId', ParseIntPipe) surveyId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Param('answerId', ParseIntPipe) answerId: number,
    @Body(new ValidationPipe()) updateDto: UpdateAnswerDto,
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
  @ApiOperation({ summary: '답안 삭제' })
  async deleteAnswer(
    @Param('surveyId', ParseIntPipe) surveyId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Param('optionId', ParseIntPipe) answerId: number,
    @CurrentUser() user: User,
  ) {
    await this.answerService.deleteAnswer(surveyId, questionId, answerId, user);
    return new EntityWithId(answerId);
  }
}
