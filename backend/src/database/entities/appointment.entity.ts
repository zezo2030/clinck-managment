import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Clinic } from './clinic.entity';
import { Department } from './department.entity';
import { AppointmentStatusEnum } from '../enums/appointment-status.enum';
import { Consultation } from './consultation.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientId: number;

  @ManyToOne(() => User, (user) => user.patientAppointments)
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @Column()
  doctorId: number;

  @ManyToOne(() => User, (user) => user.doctorAppointments)
  @JoinColumn({ name: 'doctorId' })
  doctor: User;

  @Column()
  clinicId: number;

  @ManyToOne(() => Clinic, (clinic) => clinic.appointments)
  @JoinColumn({ name: 'clinicId' })
  clinic: Clinic;

  @Column()
  departmentId: number;

  @ManyToOne(() => Department, (department) => department.appointments)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ type: 'timestamp with time zone' })
  appointmentDate: Date;

  @Column({ type: 'timestamp with time zone' })
  appointmentTime: Date;

  @Column({ type: 'enum', enum: AppointmentStatusEnum, default: AppointmentStatusEnum.SCHEDULED })
  status: AppointmentStatusEnum;

  @Column({ nullable: true })
  reason?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ default: false })
  isEmergency: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => Consultation, consultation => consultation.appointment)
  consultations: Consultation[];
}


