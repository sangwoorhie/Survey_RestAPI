import { Answer } from 'src/routes/answer/entities/answer.entity';
import { Survey } from 'src/routes/survey/entities/survey.entity';
import { Option } from 'src/routes/option/entities/option.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../userinfo';
import { Question } from 'src/routes/question/entities/question.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RefreshToken } from 'src/auth/entities/refreshToken.entity';

@Entity({ schema: 'User', name: 'Survey_RestAPI' })
export class User {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'E-mail' })
  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @ApiProperty({ description: '비밀번호' })
  @Column({ type: 'varchar', length: 30 })
  password: string;

  @ApiProperty({ description: '이름' })
  @Column({
    type: 'varchar',
  })
  name: string;

  @ApiProperty({ description: '사용자 신분', example: 'teacher' })
  @Column({ type: 'enum', enum: Status, default: Status.TEACHER })
  status: Status;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;

  // 관계설정
  // User - Survey : 1 : N 관계
  @OneToMany(() => Survey, (surveys) => surveys.user, {
    cascade: false,
  })
  surveys: Promise<Survey[]>;

  // User - Answer : 1 : N 관계
  @OneToMany(() => Answer, (answers) => answers.user, {
    cascade: false,
  })
  answers: Promise<Answer[]>; // Lazy Relations

  // User - Option : 1 : N 관계
  @OneToMany(() => Option, (options) => options.user, {
    cascade: true,
  })
  options: Promise<Option[]>;

  // User - Question : 1 : N 관계
  @OneToMany(() => Question, (questions) => questions.user, {
    cascade: true,
  })
  questions: Promise<Question[]>;

  // User - RefreshToken : 1 : 1 관계
  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshToken: RefreshToken;
}
