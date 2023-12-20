import { User } from 'src/routes/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'RefreshToken', name: 'Survey_RestAPI' })
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  token: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;

  // User - RefreshToken: 1 : 1 관계
  @OneToOne(() => User, (user) => user.refreshToken)
  @JoinColumn({ name: 'userId' })
  user: User;
}
