import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from './entities/option.entity';
import { Repository } from 'typeorm';
import { Survey } from '../survey/entities/survey.entity';
import { Question } from '../question/entities/question.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Option, Survey, Question, User])],
  controllers: [OptionController],
  providers: [OptionService, Repository],
})
export class OptionModule {}
