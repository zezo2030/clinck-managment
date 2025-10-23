import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum ActivityType {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  APPOINTMENT_CREATED = 'APPOINTMENT_CREATED',
  APPOINTMENT_UPDATED = 'APPOINTMENT_UPDATED',
  APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED',
  APPOINTMENT_COMPLETED = 'APPOINTMENT_COMPLETED',
  CONSULTATION_STARTED = 'CONSULTATION_STARTED',
  CONSULTATION_ENDED = 'CONSULTATION_ENDED',
  DOCTOR_ADDED = 'DOCTOR_ADDED',
  DOCTOR_UPDATED = 'DOCTOR_UPDATED',
  DOCTOR_REMOVED = 'DOCTOR_REMOVED',
  CLINIC_CREATED = 'CLINIC_CREATED',
  CLINIC_UPDATED = 'CLINIC_UPDATED',
  CLINIC_DELETED = 'CLINIC_DELETED',
  DEPARTMENT_CREATED = 'DEPARTMENT_CREATED',
  DEPARTMENT_UPDATED = 'DEPARTMENT_UPDATED',
  DEPARTMENT_DELETED = 'DEPARTMENT_DELETED',
  SPECIALTY_CREATED = 'SPECIALTY_CREATED',
  SPECIALTY_UPDATED = 'SPECIALTY_UPDATED',
  SPECIALTY_DELETED = 'SPECIALTY_DELETED',
  WAITING_LIST_ADDED = 'WAITING_LIST_ADDED',
  WAITING_LIST_REMOVED = 'WAITING_LIST_REMOVED',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  SECURITY_VIOLATION = 'SECURITY_VIOLATION',
}

export enum ActivitySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @Column()
  description: string;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: ActivitySeverity, default: ActivitySeverity.LOW })
  severity: ActivitySeverity;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  oldValues?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  newValues?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
