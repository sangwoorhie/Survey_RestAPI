import { Answer } from 'src/answer/entities/answer.entity';
import { Survey } from 'src/survey/entities/survey.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../userinfo';

@Entity({ schema: 'User', name: 'Survey_RestAPI' })
export class User {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({ type: 'varchar', length: 30 })
  password: string;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({ type: 'enum', enum: Status, default: Status.TEACHER })
  status: Status;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;

  // 관계설정
  // User - Survey : N : N 관계
  @ManyToMany(() => Survey, (surveys) => surveys.users, {
    cascade: false,
  })
  @JoinTable()
  surveys: Survey[];

  // User - Answer : 1 : N 관계
  @OneToMany(() => Answer, (answers) => answers.user, {
    cascade: false,
  })
  answers: Promise<Answer[]>; // Lazy Relations
}
