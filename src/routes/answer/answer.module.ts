import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { Answer } from './entities/answer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from '../survey/entities/survey.entity';
import { Question } from '../question/entities/question.entity';
import { Option } from '../option/entities/option.entity';
import { OptionService } from '../option/option.service';
import { QuestionService } from '../question/question.service';
import { SurveyService } from '../survey/survey.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Option, Survey, Question, User])],
  controllers: [AnswerController],
  providers: [
    AnswerService,
    OptionService,
    QuestionService,
    SurveyService,
    Repository,
  ],
})
export class AnswerModule {}
