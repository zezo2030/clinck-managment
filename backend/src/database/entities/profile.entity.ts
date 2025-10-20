import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { GenderEnum } from '../enums/gender.enum';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  user: User;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  dateOfBirth?: Date;

  @Column({ type: 'enum', enum: GenderEnum, nullable: true })
  gender?: GenderEnum;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  avatar?: string;
}


