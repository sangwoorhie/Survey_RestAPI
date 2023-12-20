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
import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { EntityWithId } from 'src/survey.type';
import { AuthGuardJwt } from 'src/auth/guards/auth.guard.jwt';
import { CurrentUser } from 'src/auth/current.user.decorator';
import { User } from '../user/entities/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('surveys')
@ApiTags('api')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  // 선택지 생성
  @Post('/:surveyId/questions/:questionId/options')
  @ApiOperation({ summary: '선택지 생성' })
  @UseGuards(AuthGuardJwt)
  async createOption(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Body() createDto: CreateOptionDto,
    @CurrentUser() user: User,
  ) {
    return await this.optionService.createOption(
      surveyId,
      questionId,
      createDto,
      user,
    );
  }

  // 선택지 목록조회
  @Get('/:surveyId/questions/:questionId/options')
  @ApiOperation({ summary: '선택지 목록조회' })
  async getOptions(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
  ) {
    return await this.optionService.getOptions(surveyId, questionId);
  }

  // 선택지 상세조회
  @Get('/:surveyId/questions/:questionId/options/:optionId')
  @ApiOperation({ summary: '선택지 상세조회' })
  async getOption(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('optionId') optionId: number,
  ) {
    return await this.optionService.getOption(surveyId, questionId, optionId);
  }

  // 선택지 수정
  @Patch('/:surveyId/questions/:questionId/options/:optionId')
  @ApiOperation({ summary: '선택지 수정' })
  async updateOption(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('optionId') optionId: number,
    @Body() updateDto: UpdateOptionDto,
    @CurrentUser() user: User,
  ) {
    return await this.optionService.updateOption(
      surveyId,
      questionId,
      optionId,
      updateDto,
      user,
    );
  }

  // 선택지 삭제
  @Delete('/:surveyId/questions/:questionId/options/:optionId')
  @ApiOperation({ summary: '선택지 삭제' })
  async deleteOption(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Param('optionId') optionId: number,
    @CurrentUser() user: User,
  ) {
    await this.optionService.deleteOption(surveyId, questionId, optionId, user);
    return new EntityWithId(optionId);
  }
}
