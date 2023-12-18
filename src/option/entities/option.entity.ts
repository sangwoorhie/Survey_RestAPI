import { Question } from 'src/question/entities/question.entity';
import { Survey } from 'src/survey/entities/survey.entity';
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

  @Column({ type: 'int', nullable: false })
  surveyId: number;

  @Column({ type: 'int', nullable: false })
  questionId: number;

  @Column({ type: 'int' })
  optionNumber: number;

  @Column({
    type: 'varchar',
    // unique: true,
  })
  content: string;

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

  // Options - Questions : N : 1 관계
  @ManyToOne(() => Question, (question) => question.options)
  @JoinColumn({ name: 'questionId' })
  question: Promise<Question>;
}
