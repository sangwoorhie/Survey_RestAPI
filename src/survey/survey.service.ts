import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { CompleteSurveyDto } from './dto/complete-survey.dto';
import { Survey } from './entities/survey.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/question/entities/question.entity';
import { EntityWithId } from 'src/survey.type';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SurveyService {
  private readonly logger = new Logger(SurveyService.name);
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 설문지 생성
  async createSurvey(createDto: CreateSurveyDto, user: User): Promise<Survey> {
    try {
      if (user.status !== 'teacher') {
        throw new UnauthorizedException(
          '선생님만 설문지를 생성할 수 있습니다.',
        );
      }
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

      const survey = this.surveyRepository.create({
        userId: user.id,
        title: title,
        description: description,
      });
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
    user: User,
  ): Promise<Survey> {
    try {
      // 설문지없는경우 에러반환
      const survey = await this.surveyRepository.findOneOrFail({
        where: { id: surveyId },
      });
      // 설문지 완료는 학생만 가능함
      if (user.status !== 'student') {
        throw new UnauthorizedException('학생만 설문지를 완료할 수 있습니다.');
      }

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
    user: User,
  ): Promise<Survey> {
    try {
      // 설문지없는경우 에러반환
      const survey = await this.surveyRepository.findOneOrFail({
        where: { id: surveyId },
        relations: ['user'],
      });
      // 설문지 생성자만 수정가능, (생성자가 선생님이라는것은 생성시 이미 검증됨)
      if (survey.userId !== user.id) {
        throw new ForbiddenException(
          '설문지를 생성한 본인만 수정이 가능합니다.',
        );
      }

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
  async deleteSurvey(surveyId: number, user: User): Promise<EntityWithId> {
    try {
      const survey = await this.surveyRepository.findOneOrFail({
        where: { id: surveyId },
        relations: ['user'],
      });
      // 설문지 생성자만 삭제가능  (생성자가 선생님이라는것은 생성시 이미 검증됨)
      if (survey.userId !== user.id) {
        throw new ForbiddenException(
          '설문지를 생성한 본인만 삭제가 가능합니다.',
        );
      }
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
