import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  APPOINTMENT_PENDING = 'APPOINTMENT_PENDING',
  APPOINTMENT_CONFIRMED = 'APPOINTMENT_CONFIRMED',
  APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED',
  CONSULTATION_STARTED = 'CONSULTATION_STARTED',
  CONSULTATION_ENDED = 'CONSULTATION_ENDED',
  WAITING_LIST_UPDATE = 'WAITING_LIST_UPDATE',
  NEW_USER_REGISTERED = 'NEW_USER_REGISTERED',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  DOCTOR_AVAILABILITY = 'DOCTOR_AVAILABILITY',
  CLINIC_UPDATE = 'CLINIC_UPDATE',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({ type: 'enum', enum: NotificationPriority, default: NotificationPriority.MEDIUM })
  priority: NotificationPriority;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  actionUrl?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
