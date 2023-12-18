import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { CompleteSurveyDto } from './dto/complete-survey.dto';
import { Survey } from './entities/survey.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/question/entities/question.entity';
import { EntityWithId } from 'src/survey.type';

@Injectable()
export class SurveyService {
  private readonly logger = new Logger(SurveyService.name);
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  // 설문지 생성
  async createSurvey(createDto: CreateSurveyDto): Promise<Survey> {
    try {
      const { title, description } = createDto;

      const existTitle = await this.surveyRepository.findOne({
        where: { title: title },
      });
      if (existTitle) {
        throw new BadRequestException(
          '중복된 제목의 설문지가 존재합니다. 다른 제목으로 작성해주세요.',
        );
      }
      const existDescription = await this.surveyRepository.findOne({
        where: { description: description },
      });
      if (existDescription) {
        throw new BadRequestException(
          '중복된 내용의 설문지가 존재합니다. 다른 내용으로 작성해주세요.',
        );
      }
      const survey = this.surveyRepository.create(createDto);
      return await this.surveyRepository.save(survey);
    } catch (error) {
      this.logger.error(
        `해당 설문지 생성 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 설문지 완료
  async completeSurvey(
    surveyId: number,
    completeDto: CompleteSurveyDto,
  ): Promise<Survey> {
    try {
      // 설문지없는경우 에러반환
      const survey = await this.surveyRepository.findOneOrFail({
        where: { id: surveyId },
      });

      if (survey.isDone === true) {
        throw new BadRequestException('이미 완료된 설문지입니다.');
      }

      const { isDone } = completeDto;
      if (isDone === false || isDone !== true) {
        throw new BadRequestException(
          `설문지 완료 여부를 기입해주세요. 설문지가 완료되었을 경우, "true"를 작성해주세요.`,
        );
      }

      const allQuestions = await this.questionRepository.find({
        where: { survey: { id: surveyId } },
      });
      if (!allQuestions.length) {
        throw new NotFoundException('해당 설문지에 문항이 존재하지 않습니다.');
      }

      const unAnsweredQuestions = allQuestions.some(
        (question) => question.isAnswered === false,
      );
      if (unAnsweredQuestions) {
        throw new BadRequestException(
          '아직 답변되지 않은 문항이 있습니다. 모두 답변해 주시고 설문지를 완료해주세요.',
        );
      }

      const allAnswered = allQuestions.every((question) => question.isAnswered);
      if (allAnswered && isDone === true) {
        await this.surveyRepository.update({ id: surveyId }, { isDone: true });
      }

      return await this.surveyRepository.findOne({ where: { id: surveyId } });
    } catch (error) {
      this.logger.error(
        `해당 설문지 완료 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 설문지 목록조회
  async getSurveys(): Promise<Survey[]> {
    try {
      const surveys = await this.surveyRepository.find();
      return surveys;
    } catch (error) {
      this.logger.error(
        `설문지 목록 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 완료 설문지 목록조회
  async getDoneSurveys(): Promise<Survey[]> {
    try {
      const surveys = await this.surveyRepository.find({
        where: {
          isDone: true,
        },
      });
      if (!surveys.length) {
        throw new NotFoundException('완료된 설문지가 아직 존재하지 않습니다.');
      }
      return surveys;
    } catch (error) {
      this.logger.error(
        `완료 설문지 목록 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 설문지 상세조회
  async getSurvey(surveyId: number): Promise<Survey> {
    try {
      return await this.surveyRepository.findOne({
        where: { id: surveyId },
      });
    } catch (error) {
      this.logger.error(
        `해당 설문지 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 설문지 수정
  async updateSurvey(
    surveyId: number,
    updateDto: UpdateSurveyDto,
  ): Promise<Survey> {
    try {
      // 설문지없는경우 에러반환
      const survey = await this.surveyRepository.findOneOrFail({
        where: { id: surveyId },
      });

      const { title, description } = updateDto;

      const existTitle = await this.surveyRepository.findOne({
        where: { title: title },
      });
      if (existTitle) {
        throw new BadRequestException(
          '중복된 제목의 설문지가 존재합니다. 다른 제목으로 수정해주세요.',
        );
      }
      const existDescription = await this.surveyRepository.findOne({
        where: { description: description },
      });
      if (existDescription) {
        throw new BadRequestException(
          '중복된 내용의 설문지가 존재합니다. 다른 내용으로 수정해주세요.',
        );
      }

      await this.surveyRepository.update(
        { id: surveyId },
        { title, description },
      );
      return await this.surveyRepository.findOne({ where: { id: surveyId } });
    } catch (error) {
      this.logger.error(
        `해당 설문지 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 설문지 삭제
  async deleteSurvey(surveyId: number): Promise<EntityWithId> {
    try {
      const survey = await this.surveyRepository.findOneOrFail({
        where: { id: surveyId },
      });

      await this.surveyRepository.remove(survey);
      return new EntityWithId(surveyId);
    } catch (error) {
      this.logger.error(
        `해당 설문지 삭제 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }
}
