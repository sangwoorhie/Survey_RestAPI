import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { Answer } from './entities/answer.entity';
import { Survey } from 'src/survey/entities/survey.entity';
import { Question } from 'src/question/entities/question.entity';
import { Option } from 'src/option/entities/option.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionService } from 'src/option/option.service';
import { QuestionService } from 'src/question/question.service';
import { SurveyService } from 'src/survey/survey.service';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Option, Survey, Question])],
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
