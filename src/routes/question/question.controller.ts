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
  Query,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { EntityWithId } from 'src/survey.type';
import { AuthGuardJwt } from 'src/auth/guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from 'src/auth/current.user.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageReqDto } from 'src/common/pagination.dto';

@Controller('survey')
@ApiTags('api')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  // 문항 생성
  @Post('/:surveyId/questions')
  @ApiOperation({ summary: '문항 생성' })
  @UseGuards(AuthGuardJwt)
  async createQuestion(
    @Param('surveyId', ParseIntPipe) surveyId: number,
    @Body(new ValidationPipe()) createDto: CreateQuestionDto,
    @CurrentUser() user: User,
  ) {
    return await this.questionService.createQuestion(surveyId, createDto, user);
  }

  // 문항 목록조회
  @Get('/:surveyId/questions')
  @ApiOperation({ summary: '문항 목록조회' })
  async getQuestions(
    @Param('surveyId', ParseIntPipe) surveyId: number,
    @Query() { page, size }: PageReqDto,
  ) {
    return await this.questionService.getQuestions(surveyId);
  }

  // 문항 상세조회
  @Get('/:surveyId/questions/:questionId')
  @ApiOperation({ summary: '문항 상세조회' })
  async getQuestion(
    @Param('surveyId', ParseIntPipe) surveyId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
  ) {
    return await this.questionService.getQuestion(surveyId, questionId);
  }

  // 문항 수정
  @Patch('/:surveyId/questions/:questionId')
  @ApiOperation({ summary: '문항 수정' })
  @UseGuards(AuthGuardJwt)
  async updateQuestion(
    @Param('surveyId', ParseIntPipe) surveyId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body(new ValidationPipe()) updateDto: UpdateQuestionDto,
    @CurrentUser() user: User,
  ) {
    return await this.questionService.updateQuestion(
      surveyId,
      questionId,
      updateDto,
      user,
    );
  }

  // 문항 삭제
  @Delete('/:surveyId/questions/:questionId')
  @ApiOperation({ summary: '문항 삭제' })
  @UseGuards(AuthGuardJwt)
  async deleteQuestion(
    @Param('surveyId', ParseIntPipe) surveyId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @CurrentUser() user: User,
  ) {
    await this.questionService.deleteQuestion(surveyId, questionId, user);
    return new EntityWithId(questionId);
  }
}
