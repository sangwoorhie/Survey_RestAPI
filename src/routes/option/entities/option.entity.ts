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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'Option', name: 'Survey_RestAPI' })
export class Option {
  constructor(partial?: Partial<Option>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '선택지 번호' })
  @Column({ type: 'int' })
  optionNumber: number;

  @ApiProperty({ description: '선택지 내용' })
  @Column({
    type: 'varchar',
    // unique: true,
  })
  content: string;

  @ApiProperty({ description: '선택지 점수' })
  @Column({ type: 'int' })
  optionScore: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;

  // 관계설정
  // Options - Survey : N : 1 관계
  @ManyToOne(() => Survey, (survey) => survey.options)
  @JoinColumn({ name: 'surveyId' })
  survey: Promise<Survey>;
  @Column({ nullable: true })
  surveyId: number;

  // Options - Questions : N : 1 관계
  @ManyToOne(() => Question, (question) => question.options)
  @JoinColumn({ name: 'questionId' })
  question: Promise<Question>;
  @Column({ nullable: true })
  questionId: number;

  // Options - User : N : 1 관계
  @ManyToOne(() => User, (user) => user.options)
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;
  @Column({ nullable: true })
  userId: number;
}
