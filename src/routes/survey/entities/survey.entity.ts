import { ApiProperty } from '@nestjs/swagger';
import { Answer } from 'src/routes/answer/entities/answer.entity';
import { Option } from 'src/routes/option/entities/option.entity';
import { Question } from 'src/routes/question/entities/question.entity';
import { User } from 'src/routes/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'Survey', name: 'Survey_RestAPI' })
export class Survey {
  @PrimaryColumn()
  id: number;

  @ApiProperty({ description: '설문지 제목' })
  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @ApiProperty({ description: '설문지 내용' })
  @Column({
    type: 'varchar',
    nullable: false,
  })
  description: string;

  @ApiProperty({ description: '설문지 완료여부' })
  @Column({
    type: 'boolean',
    default: false,
  })
  isDone: boolean;

  @ApiProperty({ description: '설문지 총점' })
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

  // Survey - User : N : 1 관계
  @ManyToOne(() => User, (user) => user.surveys, {
    cascade: false,
  })
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;
  @Column({ nullable: true })
  userId: number;
}
