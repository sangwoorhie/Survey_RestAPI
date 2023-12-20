import { Answer } from 'src/routes/answer/entities/answer.entity';
import { Survey } from 'src/routes/survey/entities/survey.entity';
import { Option } from 'src/routes/option/entities/option.entity';
import { User } from 'src/routes/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'Question', name: 'Survey_RestAPI' })
export class Question {
  constructor(partial?: Partial<Question>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '문항 번호' })
  @Column({ type: 'int', nullable: false })
  questionNumber: number;

  @ApiProperty({ description: '문항 내용' })
  @Column({
    type: 'varchar',
  })
  content: string;

  @ApiProperty({ description: '문항 답변여부' })
  @Column({
    type: 'boolean',
    default: false,
  })
  isAnswered: boolean;

  @ApiProperty({ description: '문항 점수' })
  @Column({ default: 0 })
  questionScore: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;

  // 관계설정
  // Question - Survey : N : 1 관계
  @ManyToOne(() => Survey, (survey) => survey.questions)
  @JoinColumn({ name: 'surveyId' })
  survey: Promise<Survey>; // Lazy Relations
  @Column({ nullable: true })
  surveyId: number;

  // Question - Option : 1 : N 관계
  @OneToMany(() => Option, (options) => options.question, {
    cascade: true,
  })
  options: Promise<Option[]>; // Lazy Relations

  // Question - Answer : 1 : 1 관계
  @OneToOne(() => Answer, (answer) => answer.question, {
    cascade: false,
  })
  @JoinColumn({ name: 'answerId' })
  answer: Answer;

  // Question - User : N : 1 관계
  @ManyToOne(() => User, (user) => user.questions)
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;
  @Column({ nullable: true })
  userId: number;
}
