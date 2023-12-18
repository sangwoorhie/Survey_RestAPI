import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from 'src/survey/entities/survey.entity';
import { Question } from 'src/question/entities/question.entity';
import { Option } from './entities/option.entity';
import { EntityWithId } from 'src/survey.type';

@Injectable()
export class OptionService {
  private readonly logger = new Logger(OptionService.name);
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
  ) {}

  // 선택지 생성
  async createOption(
    surveyId: number,
    questionId: number,
    createDto: CreateOptionDto,
  ): Promise<Option> {
    try {
      await this.questionRepository.findOneOrFail({
        where: {
          survey: { id: surveyId },
          id: questionId,
        },
      });

      // 선택지 중복검사
      const option = await this.existOption(surveyId, questionId, createDto);
      if (option.existNumber) {
        throw new ConflictException(
          '중복된 번호의 다른 선택지가 이미 존재합니다. 다른 번호로 작성해주세요.',
        );
      }
      if (option.existContent) {
        throw new ConflictException(
          '중복된 내용의 다른 선택지가 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }
      if (option.existScore) {
        throw new ConflictException(
          '중복된 점수의 다른 선택지가 이미 존재합니다. 다른 점수로 작성해주세요.',
        );
      }

      const { optionNumber, content, optionScore } = createDto;
      const newOption = this.optionRepository.create({
        surveyId,
        questionId,
        optionNumber,
        content,
        optionScore,
      });
      return await this.optionRepository.save(newOption);
    } catch (error) {
      this.logger.error(
        `해당 선택지 생성 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 선택지 전체조회
  async getOptions(surveyId: number, questionId: number): Promise<Option[]> {
    try {
      const options = await this.optionRepository.find({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
        },
      });
      if (!options.length) {
        throw new NotFoundException('선택지가 아직 존재하지 않습니다.');
      }
      return options;
    } catch (error) {
      this.logger.error(
        `선택지 목록 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 선택지 상세조회
  async getOption(
    surveyId: number,
    questionId: number,
    optionId: number,
  ): Promise<Option> {
    try {
      return await this.optionRepository.findOneOrFail({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          id: optionId,
        },
        select: ['id', 'optionNumber', 'content', 'optionScore'],
        // relations: ['survey', 'question'],
      });
    } catch (error) {
      this.logger.error(
        `해당 선택지 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 선택지 수정
  async updateOption(
    surveyId: number,
    questionId: number,
    optionId: number,
    updateDto: UpdateOptionDto,
  ): Promise<Option> {
    try {
      const option = await this.optionRepository.findOneOrFail({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          id: optionId,
        },
      });

      const existContent = await this.optionRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          content: updateDto.content,
        },
      });

      if (existContent) {
        throw new BadRequestException(
          '중복된 내용의 다른 선택지가 이미 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }

      await this.optionRepository.update(
        { surveyId, questionId, id: optionId },
        { content: updateDto.content },
      );

      return await this.optionRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          id: optionId,
        },
      });
    } catch (error) {
      this.logger.error(
        `해당 선택지 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 선택지 삭제
  async deleteOption(
    surveyId: number,
    questionId: number,
    optionId: number,
  ): Promise<EntityWithId> {
    try {
      const option = await this.optionRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          id: optionId,
        },
      });
      await this.optionRepository.remove(option);
      return new EntityWithId(optionId);
    } catch (error) {
      this.logger.error(
        `해당 선택지 삭제 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 선택지 중복검사
  async existOption(
    surveyId: number,
    questionId: number,
    createDto: CreateOptionDto,
  ) {
    try {
      const { optionNumber, content, optionScore } = createDto;

      const existNumber = await this.optionRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          optionNumber: optionNumber,
        },
      });
      const existContent = await this.optionRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          content: content,
        },
      });
      const existScore = await this.optionRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          optionScore: optionScore,
        },
      });
      return { existNumber, existContent, existScore };
    } catch (error) {
      this.logger.error(
        `해당 선택지 생성을 위한 선택지 중복검사 중 에러가 발생했습니다: ${error.message}`,
      );
    }
  }

  // 답변 생성 및 수정용 답안번호와 동일한 선택지번호 조회
  async optionNumber(
    surveyId: number,
    questionId: number,
    answerNumber: number,
  ): Promise<Option> {
    try {
      const matching = await this.optionRepository.findOne({
        where: {
          surveyId,
          questionId,
          optionNumber: answerNumber,
        },
      });
      if (!matching) {
        throw new NotFoundException('해당 선택지 번호가 존재하지 않습니다.');
      }
      return matching;
    } catch (error) {
      this.logger.error(
        `답변 생성을 위한 선택지번호 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }
}
