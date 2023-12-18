import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Survey } from 'src/survey/entities/survey.entity';
import { Repository } from 'typeorm';
import { Question } from 'src/question/entities/question.entity';
import { OptionService } from 'src/option/option.service';
import { Answer } from './entities/answer.entity';
import { EntityWithId } from 'src/survey.type';

@Injectable()
export class AnswerService {
  private readonly logger = new Logger(AnswerService.name);
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly optionService: OptionService,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  // 답안 생성
  async createAnswer(
    surveyId: number,
    questionId: number,
    createDto: CreateAnswerDto,
  ): Promise<Answer> {
    try {
      const question = await this.questionRepository.findOne({
        where: {
          survey: { id: surveyId },
          id: questionId,
        },
      });

      // 답변 생성 및 수정용 답안번호와 동일한 선택지번호 조회
      const { answerNumber } = createDto;
      const option = await this.optionService.optionNumber(
        surveyId,
        questionId,
        answerNumber,
      );

      const survey = await this.surveyRepository.findOne({
        where: {
          id: surveyId,
        },
      });

      const create = this.answerRepository.create({
        surveyId,
        questionId,
        answerNumber,
      });
      const answer = await this.answerRepository.save(create);

      // 답변된 문항 상태 true로 변경 및 선택된 옵션으로 점수부여
      if (option && answer) {
        question.isAnswered = true;

        question.questionScore = option.optionScore;
        await this.questionRepository.save(question);

        survey.totalScore += question.questionScore;
        await this.surveyRepository.save(survey);
      }
      return answer;
    } catch (error) {
      this.logger.error(
        `해당 답변 생성 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 답안 목록조회
  async getAnswers(surveyId: number, questionId: number): Promise<Answer[]> {
    try {
      const answers = await this.answerRepository.find({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
        },
        select: ['id', 'answerNumber'],
      });
      if (!answers.length) {
        throw new NotFoundException(
          '해당 문항의 답변이 아직 존재하지 않습니다.',
        );
      }
      return answers;
    } catch (error) {
      this.logger.error(
        `답변 목록 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 답안 상세조회
  async getAnswer(
    surveyId: number,
    questionId: number,
    answerId: number,
  ): Promise<Answer> {
    try {
      return await this.answerRepository.findOneOrFail({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          id: answerId,
        },
        relations: ['survey', 'question'],
        select: ['id', 'answerNumber'],
      });
    } catch (error) {
      this.logger.error(
        `해당 답변 조회 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 답안 수정
  async updateAnswer(
    surveyId: number,
    questionId: number,
    answerId: number,
    updateDto: UpdateAnswerDto,
  ): Promise<Answer> {
    try {
      const question = await this.questionRepository.findOne({
        where: {
          survey: { id: surveyId },
          id: questionId,
        },
      });
      const answer = await this.answerRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          id: answerId,
        },
      });

      const survey = await this.surveyRepository.findOne({
        where: {
          id: surveyId,
        },
      });

      if ((question.isAnswered = false) || !answer) {
        throw new BadRequestException('아직 답변이 완료되지 않은 문항입니다.');
      }

      const { answerNumber } = updateDto;

      // 답변 생성 및 수정용 답안번호와 동일한 선택지번호 조회
      const option = await this.optionService.optionNumber(
        surveyId,
        questionId,
        answerNumber,
      );
      const update = await this.answerRepository.update(
        { id: answerId },
        { answerNumber: answerNumber },
      );
      // 답변된 문항 상태 true로 변경 및 선택된 옵션으로 점수부여
      if (option && update) {
        survey.totalScore -= question.questionScore; // 설문지 기존값 제거

        question.isAnswered = true;
        question.questionScore = option.optionScore; // 문항 새로운값 부여
        await this.questionRepository.save(question);

        survey.totalScore += question.questionScore; // 설문지 새로운값 추가
        await this.surveyRepository.save(survey);
      }
      return await this.answerRepository.findOne({ where: { id: answerId } });
    } catch (error) {
      this.logger.error(
        `해당 답변 수정 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }

  // 답안 삭제
  async deleteAnswer(
    surveyId: number,
    questionId: number,
    answerId: number,
  ): Promise<EntityWithId> {
    try {
      const survey = await this.surveyRepository.findOne({
        where: {
          id: surveyId,
        },
      });

      const question = await this.questionRepository.findOne({
        where: {
          survey: { id: surveyId },
          id: questionId,
        },
      });
      const answer = await this.answerRepository.findOne({
        where: {
          survey: { id: surveyId },
          question: { id: questionId },
          id: answerId,
        },
      });
      // 답변 삭제된 문항 상태 false로 변경 및 0점처리
      const remove = await this.answerRepository.remove(answer);
      if (remove) {
        survey.isDone = false;
        survey.totalScore -= question.questionScore;
        await this.surveyRepository.save(survey);

        question.isAnswered = false;
        question.questionScore = 0;
        await this.questionRepository.save(question);
      }
      return new EntityWithId(answerId);
    } catch (error) {
      this.logger.error(
        `해당 답변 삭제 중 에러가 발생했습니다: ${error.message}`,
      );
      throw error;
    }
  }
}
