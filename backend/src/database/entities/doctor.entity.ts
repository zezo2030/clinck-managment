import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Clinic } from './clinic.entity';
import { Specialty } from './specialty.entity';
import { Department } from './department.entity';
import { Schedule } from './schedule.entity';
import { Rating } from './rating.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: number;

  @OneToOne(() => User, (user) => user.doctor)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  clinicId: number;

  @ManyToOne(() => Clinic, (clinic) => clinic.doctors)
  @JoinColumn({ name: 'clinicId' })
  clinic: Clinic;

  @Column()
  specialtyId: number;

  @ManyToOne(() => Specialty, (specialty) => specialty.doctors)
  @JoinColumn({ name: 'specialtyId' })
  specialty: Specialty;

  @Column()
  departmentId: number;

  @ManyToOne(() => Department, (department) => department.doctors)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column()
  specialization: string;

  @Column()
  licenseNumber: string;

  @Column('int')
  experience: number;

  @Column('decimal', { precision: 10, scale: 2 })
  consultationFee: string;

  @Column({ default: true })
  isAvailable: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => Schedule, (schedule) => schedule.doctor)
  schedules: Schedule[];

  @OneToMany(() => Rating, (rating) => rating.doctor)
  ratings: Rating[];
}


