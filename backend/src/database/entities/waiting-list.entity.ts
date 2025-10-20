import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';

@Entity('waiting_list')
export class WaitingList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientId: number;

  @ManyToOne(() => User, (user) => user.waitingListPatient)
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @Column()
  doctorId: number;

  @ManyToOne(() => User, (user) => user.waitingListDoctor)
  @JoinColumn({ name: 'doctorId' })
  doctor: User;

  @Column()
  departmentId: number;

  @ManyToOne(() => Department, (department) => department.waitingList)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ default: 1 })
  priority: number;

  @Column({ default: false })
  notified: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}


