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
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { CompleteSurveyDto } from './dto/complete-survey.dto';
import { EntityWithId } from 'src/survey.type';
import { CurrentUser } from 'src/auth/current.user.decorator';
import { User } from 'src/user/entities/user.entity';
import { AuthGuardJwt } from 'src/auth/guards/auth.guard.jwt';

@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  // 설문지 생성
  @Post()
  @UseGuards(AuthGuardJwt)
  async createSurvey(
    @Body() createDto: CreateSurveyDto,
    @CurrentUser() user: User,
  ) {
    return await this.surveyService.createSurvey(createDto, user);
  }

  // 설문지 완료
  @Post('/:surveyId')
  async completeSurvey(
    @Param('surveyId') surveyId: number,
    @Body() completeDto: CompleteSurveyDto,
    @CurrentUser() user: User,
  ) {
    return await this.surveyService.completeSurvey(surveyId, completeDto, user);
  }

  // 설문지 목록조회
  @Get()
  async getSurveys() {
    return await this.surveyService.getSurveys();
  }

  // 완료 설문지 목록조회
  @Get('/done')
  async getDoneSurveys() {
    return await this.surveyService.getDoneSurveys();
  }

  // 설문지 상세조회
  @Get('/:surveyId')
  async getSurvey(@Param('surveyId') surveyId: number) {
    return await this.surveyService.getSurvey(surveyId);
  }

  // 설문지 수정
  @Patch('/:surveyId')
  async updateSurvey(
    @Param('surveyId') surveyId: number,
    @Body() updateDto: UpdateSurveyDto,
    @CurrentUser() user: User,
  ) {
    return await this.surveyService.updateSurvey(surveyId, updateDto, user);
  }

  // 설문지 삭제
  @Delete('/:surveyId')
  async deleteSurvey(
    @Param('surveyId') surveyId: number,
    @CurrentUser() user: User,
  ) {
    await this.surveyService.deleteSurvey(surveyId, user);
    return new EntityWithId(surveyId);
  }
}
