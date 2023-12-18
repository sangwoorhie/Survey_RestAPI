import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { CompleteSurveyDto } from './dto/complete-survey.dto';
import { EntityWithId } from 'src/survey.type';

@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  // 설문지 생성
  @Post()
  async createSurvey(@Body() createDto: CreateSurveyDto) {
    return await this.surveyService.createSurvey(createDto);
  }

  // 설문지 완료
  @Post('/:surveyId')
  async completeSurvey(
    @Param('surveyId') surveyId: number,
    @Body() completeDto: CompleteSurveyDto,
  ) {
    return await this.surveyService.completeSurvey(surveyId, completeDto);
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
  ) {
    return await this.surveyService.updateSurvey(surveyId, updateDto);
  }

  // 설문지 삭제
  @Delete('/:surveyId')
  async deleteSurvey(@Param('surveyId') surveyId: number) {
    await this.surveyService.deleteSurvey(surveyId);
    return new EntityWithId(surveyId);
  }
}
