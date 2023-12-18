import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from 'src/survey/entities/survey.entity';
import { Question } from 'src/question/entities/question.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Option, Survey, Question])],
  controllers: [OptionController],
  providers: [OptionService, Repository],
})
export class OptionModule {}
