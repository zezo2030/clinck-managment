import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Clinic } from './clinic.entity';
import { Doctor } from './doctor.entity';
import { Appointment } from './appointment.entity';
import { WaitingList } from './waiting-list.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  clinicId: number;

  @ManyToOne(() => Clinic, (clinic) => clinic.departments)
  clinic: Clinic;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => Doctor, (doctor) => doctor.department)
  doctors: Doctor[];

  @OneToMany(() => Appointment, (appointment) => appointment.department)
  appointments: Appointment[];

  @OneToMany(() => WaitingList, (waiting) => waiting.department)
  waitingList: WaitingList[];
}


