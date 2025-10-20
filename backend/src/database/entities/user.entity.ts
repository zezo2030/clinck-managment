import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { RoleEnum } from '../enums/role.enum';
import { Profile } from './profile.entity';
import { Doctor } from './doctor.entity';
import { Appointment } from './appointment.entity';
import { WaitingList } from './waiting-list.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.PATIENT })
  role: RoleEnum;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile?: Profile;

  @OneToOne(() => Doctor, (doctor) => doctor.user)
  @JoinColumn()
  doctor?: Doctor;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  patientAppointments: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  doctorAppointments: Appointment[];

  @OneToMany(() => WaitingList, (waiting) => waiting.patient)
  waitingListPatient: WaitingList[];

  @OneToMany(() => WaitingList, (waiting) => waiting.doctor)
  waitingListDoctor: WaitingList[];
}


