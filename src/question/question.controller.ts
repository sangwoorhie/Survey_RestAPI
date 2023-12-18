import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { EntityWithId } from 'src/survey.type';

@Controller('survey')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  // 문항 생성
  @Post('/:surveyId/questions')
  async createQuestion(
    @Param('surveyId') surveyId: number,
    @Body() createDto: CreateQuestionDto,
  ) {
    return await this.questionService.createQuestion(surveyId, createDto);
  }

  // 문항 목록조회
  @Get('/:surveyId/questions')
  async getQuestions(@Param('surveyId') surveyId: number) {
    return await this.questionService.getQuestions(surveyId);
  }

  // 문항 상세조회
  @Get('/:surveyId/questions/:questionId')
  async getQuestion(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
  ) {
    return await this.questionService.getQuestion(surveyId, questionId);
  }

  // 문항 수정
  @Patch('/:surveyId/questions/:questionId')
  async updateQuestion(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Body() updateDto: UpdateQuestionDto,
  ) {
    return await this.questionService.updateQuestion(
      surveyId,
      questionId,
      updateDto,
    );
  }

  // 문항 삭제
  @Delete('/:surveyId/questions/:questionId')
  async deleteQuestion(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
  ) {
    await this.questionService.deleteQuestion(surveyId, questionId);
    return new EntityWithId(questionId);
  }
}
