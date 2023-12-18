import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from 'src/survey/entities/survey.entity';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Survey])],
  controllers: [QuestionController],
  providers: [QuestionService, Repository],
})
export class QuestionModule {}
