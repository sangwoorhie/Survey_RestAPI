import { ApiProperty } from '@nestjs/swagger';
import { Question } from 'src/routes/question/entities/question.entity';
import { Survey } from 'src/routes/survey/entities/survey.entity';
import { User } from 'src/routes/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'Answer', name: 'Survey_RestAPI' })
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '답안번호' })
  @Column({ type: 'int', nullable: false })
  answerNumber: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;

  // 관계설정
  // Answers - Surveys : N : 1 관계
  @ManyToOne(() => Survey, (survey) => survey.answers)
  @JoinColumn({ name: 'surveyId' })
  survey: Promise<Survey>;
  @Column({ nullable: true })
  surveyId: number;

  // Answers - Questions : 1 : 1 관계
  @OneToOne(() => Question, (question) => question.answer)
  @JoinColumn({ name: 'questionId' })
  question: Question;
  @Column({ nullable: true })
  questionId: number;

  // Answer - User : N : 1 관계
  @ManyToOne(() => User, (user) => user.answers)
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;
  @Column({ nullable: true })
  userId: number;
}
