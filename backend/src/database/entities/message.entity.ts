import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Consultation } from './consultation.entity';
import { User } from './user.entity';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  consultationId: number;

  @Column()
  senderId: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: MessageType, default: MessageType.TEXT })
  messageType: MessageType;

  @Column({ type: 'text', nullable: true })
  fileUrl: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Consultation, consultation => consultation.messages)
  consultation: Consultation;

  @ManyToOne(() => User)
  sender: User;
}
