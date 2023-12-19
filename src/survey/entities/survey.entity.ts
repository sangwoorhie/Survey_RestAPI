import { Answer } from 'src/answer/entities/answer.entity';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';
import { Option } from 'src/option/entities/option.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'Survey', name: 'Survey_RestAPI' })
export class Survey {
  @PrimaryColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDone: boolean;

  @Column({ default: 0 })
  totalScore: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;

  // 관계설정
  // Survey - Question : 1 : N 관계
  @OneToMany(() => Question, (questions) => questions.survey, {
    cascade: true,
  })
  questions: Promise<Question[]>; // Lazy Relations

  // Survey - Option : 1 : N 관계
  @OneToMany(() => Option, (options) => options.survey, {
    cascade: true,
  })
  options: Promise<Option[]>; // Lazy Relations

  // Survey - Answer : 1 : N 관계
  @OneToMany(() => Answer, (answers) => answers.survey, {
    cascade: false,
  })
  answers: Promise<Answer[]>; // Lazy Relations

  // Survey - User : N : N 관계
  @ManyToMany(() => User, (users) => users.surveys, {
    cascade: false,
  })
  @JoinTable()
  users: User[];
}
