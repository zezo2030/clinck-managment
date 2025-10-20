import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  doctorId: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.ratings)
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @Column('int')
  patientId: number;

  @Column('int')
  rating: number; // 1-5

  @Column({ nullable: true })
  comment?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}


