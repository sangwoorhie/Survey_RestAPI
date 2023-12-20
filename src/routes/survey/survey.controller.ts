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
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { CompleteSurveyDto } from './dto/complete-survey.dto';
import { EntityWithId } from 'src/survey.type';
import { CurrentUser } from 'src/auth/current.user.decorator';
import { User } from '../user/entities/user.entity';
import { AuthGuardJwt } from 'src/auth/guards/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageReqDto } from 'src/common/dto/pagination.dto';

@Controller('surveys')
@ApiTags('api')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  // 설문지 생성
  @Post()
  @ApiOperation({ summary: '설문지 생성' })
  @UseGuards(AuthGuardJwt)
  async createSurvey(
    @Body(new ValidationPipe()) createDto: CreateSurveyDto,
    @CurrentUser() user: User,
  ) {
    return await this.surveyService.createSurvey(createDto, user);
  }

  // 설문지 완료
  @Post('/:surveyId')
  @ApiOperation({ summary: '설문지 완료' })
  async completeSurvey(
    @Param('surveyId', ParseIntPipe) surveyId: number,
    @Body(new ValidationPipe()) completeDto: CompleteSurveyDto,
    @CurrentUser() user: User,
  ) {
    return await this.surveyService.completeSurvey(surveyId, completeDto, user);
  }

  // 설문지 목록조회
  @Get()
  @ApiOperation({ summary: '설문지 목록조회' })
  async getSurveys(@Query() { page, size }: PageReqDto) {
    return await this.surveyService.getSurveys();
  }

  // 완료 설문지 목록조회
  @Get('/done')
  @ApiOperation({ summary: '완료 설문지 목록조회' })
  async getDoneSurveys(@Query() { page, size }: PageReqDto) {
    return await this.surveyService.getDoneSurveys();
  }

  // 설문지 상세조회
  @Get('/:surveyId')
  @ApiOperation({ summary: '완료 설문지 상세조회' })
  async getSurvey(@Param('surveyId', ParseIntPipe) surveyId: number) {
    return await this.surveyService.getSurvey(surveyId);
  }

  // 설문지 수정
  @Patch('/:surveyId')
  @UseGuards(AuthGuardJwt)
  @ApiOperation({ summary: '설문지 수정' })
  async updateSurvey(
    @Param('surveyId', ParseIntPipe) surveyId: number,
    @Body(new ValidationPipe()) updateDto: UpdateSurveyDto,
    @CurrentUser() user: User,
  ) {
    return await this.surveyService.updateSurvey(surveyId, updateDto, user);
  }

  // 설문지 삭제
  @Delete('/:surveyId')
  @UseGuards(AuthGuardJwt)
  @ApiOperation({ summary: '설문지 삭제' })
  async deleteSurvey(
    @Param('surveyId', ParseIntPipe) surveyId: number,
    @CurrentUser() user: User,
  ) {
    await this.surveyService.deleteSurvey(surveyId, user);
    return new EntityWithId(surveyId);
  }
}
