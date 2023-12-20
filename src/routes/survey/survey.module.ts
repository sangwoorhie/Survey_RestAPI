import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { Survey } from './entities/survey.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../question/entities/question.entity';
import { User } from '../user/entities/user.entity';
import { QuestionService } from '../question/question.service';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, Question, User])],
  controllers: [SurveyController],
  providers: [SurveyService, QuestionService, Repository],
})
export class SurveyModule {}
