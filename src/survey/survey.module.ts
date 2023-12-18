import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { Question } from 'src/question/entities/question.entity';
import { Survey } from './entities/survey.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionService } from 'src/question/question.service';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, Question])],
  controllers: [SurveyController],
  providers: [SurveyService, QuestionService, Repository],
})
export class SurveyModule {}
