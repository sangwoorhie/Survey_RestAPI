import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { EntityWithId } from 'src/survey.type';

@Controller('surveys')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  // 선택지 생성
  @Post('/:surveyId/questions/:questionId/options')
  async createOption(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Body() createDto: CreateOptionDto,
  ) {
    return await this.optionService.createOption(
      surveyId,
      questionId,
      createDto,
    );
  }

  // 선택지 전체조회
  @Get('/:surveyId/questions/:questionId/options')
  async getOptions(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
  ) {
    return await this.optionService.getOptions(surveyId, questionId);
  }

  // 선택지 상세조회
  @Get('/:surveyId/questions/:questionId/options/:optionId')
  async getOption(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('optionId') optionId: number,
  ) {
    return await this.optionService.getOption(surveyId, questionId, optionId);
  }

  // 선택지 수정
  @Patch('/:surveyId/questions/:questionId/options/:optionId')
  async updateOption(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('optionId') optionId: number,
    @Body() updateDto: UpdateOptionDto,
  ) {
    return await this.optionService.updateOption(
      surveyId,
      questionId,
      optionId,
      updateDto,
    );
  }

  // 선택지 삭제
  @Delete('/:surveyId/questions/:questionId/options/:optionId')
  async deleteOption(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('optionId') optionId: number,
  ) {
    await this.optionService.deleteOption(surveyId, questionId, optionId);
    return new EntityWithId(optionId);
  }
}
