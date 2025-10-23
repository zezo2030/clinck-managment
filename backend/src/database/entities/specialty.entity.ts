import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Doctor } from './doctor.entity';
import { Appointment } from './appointment.entity';

@Entity('specialties')
export class Specialty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column('text', { array: true, default: [] })
  services: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => Doctor, (doctor) => doctor.specialty)
  doctors: Doctor[];

  @OneToMany(() => Appointment, (appointment) => appointment.specialty)
  appointments: Appointment[];
}
