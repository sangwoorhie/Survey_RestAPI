import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Survey } from 'src/survey/entities/survey.entity';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { EntityWithId } from 'src/survey.type';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  // 문항 생성
  async createQuestion(
    surveyId: number,
    createDto: CreateQuestionDto,
  ): Promise<Question> {
    try {
      await this.surveyRepository.findOneOrFail({
        where: { id: surveyId },
      });

      // 문항 생성
      const { questionNumber, content } = createDto;

      const existNumber = await this.questionRepository.findOne({
        where: {
          survey: { id: surveyId },
          questionNumber: questionNumber,
        },
      });
      if (existNumber) {
        throw new ConflictException(
          '중복된 번호의 다른 문항이 이미 존재합니다. 다른 번호로 작성해주세요.',
        );
      }
      const existContent = await this.questionRepository.findOne({
        where: {
          survey: { id: surveyId },
          content,
        },
      });
      if (existContent) {
        throw new ConflictException(
          '중복된 내용의 다른 문항이 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }
      const newQuestion = this.questionRepository.create({
        surveyId,
        questionNumber,
        content,
      });
      return await this.questionRepository.save(newQuestion);
    } catch (error) {
      this.logger.error(
        `해당 문항 생성 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 문항 목록조회
  async getQuestions(surveyId: number): Promise<Question[]> {
    try {
      const questions = await this.questionRepository.find({
        where: {
          survey: { id: surveyId },
        },
        select: ['id', 'questionNumber', 'content'],
      });
      if (!questions.length) {
        throw new NotFoundException('문항이 아직 존재하지 않습니다.');
      }
      return questions;
    } catch (error) {
      this.logger.error(
        `문항 목록 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 문항 상세조회
  async getQuestion(surveyId: number, questionId: number): Promise<Question> {
    try {
      return await this.questionRepository.findOneOrFail({
        where: {
          survey: { id: surveyId },
          id: questionId,
        },
        relations: ['survey', 'options'],
      });
    } catch (error) {
      this.logger.error(
        `해당 문항 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 문항 수정
  async updateQuestion(
    surveyId: number,
    questionId: number,
    updateDto: UpdateQuestionDto,
  ): Promise<Question> {
    try {
      const question = await this.questionRepository.findOneOrFail({
        where: {
          survey: { id: surveyId },
          id: questionId,
        },
      });

      const existContent = await this.questionRepository.findOne({
        where: {
          survey: { id: surveyId },
          content: updateDto.content,
        },
      });
      if (existContent) {
        throw new BadRequestException(
          '중복된 내용의 다른 문항이 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }

      await this.questionRepository.save(
        new Question(Object.assign(question, updateDto)),
      );
      return await this.questionRepository.findOne({
        where: { id: questionId },
      });
    } catch (error) {
      this.logger.error(
        `해당 문항 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 문항 삭제
  async deleteQuestion(
    surveyId: number,
    questionId: number,
  ): Promise<EntityWithId> {
    try {
      const question = await this.questionRepository.findOneOrFail({
        where: {
          survey: { id: surveyId },
          id: questionId,
        },
      });
      await this.questionRepository.remove(question);
      return new EntityWithId(questionId);
    } catch (error) {
      this.logger.error(
        `해당 문항 삭제 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }
}
