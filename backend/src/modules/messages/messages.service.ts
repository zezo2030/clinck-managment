import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, MessageType } from '../../database/entities/message.entity';
import { Consultation } from '../../database/entities/consultation.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,
  ) {}

  async create(consultationId: number, senderId: number, message: string, messageType: MessageType = MessageType.TEXT, fileUrl?: string) {
    const consultation = await this.consultationRepository.findOne({
      where: { id: consultationId },
    });

    if (!consultation) {
      throw new NotFoundException('الاستشارة غير موجودة');
    }

    const newMessage = this.messageRepository.create({
      consultationId,
      senderId,
      message,
      messageType,
      fileUrl,
    });

    return this.messageRepository.save(newMessage);
  }

  async findByConsultation(consultationId: number) {
    return this.messageRepository.find({
      where: { consultationId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async markAsRead(messageId: number) {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('الرسالة غير موجودة');
    }

    message.isRead = true;
    message.readAt = new Date();

    return this.messageRepository.save(message);
  }

  async markAllAsRead(consultationId: number) {
    await this.messageRepository.update(
      { consultationId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return { success: true };
  }

  async delete(messageId: number) {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('الرسالة غير موجودة');
    }

    await this.messageRepository.remove(message);
    return { success: true };
  }

  // إضافة الطرق المفقودة
  async getMessagesByConsultation(consultationId: number) {
    return this.findByConsultation(consultationId);
  }

  async getUnreadMessages(userId: number) {
    return this.messageRepository.find({
      where: { 
        senderId: userId,
        isRead: false 
      },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
    });
  }

  async getMessageById(id: number) {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender'],
    });

    if (!message) {
      throw new NotFoundException('الرسالة غير موجودة');
    }

    return message;
  }

  async deleteMessage(messageId: number, userId: number) {
    const message = await this.messageRepository.findOne({
      where: { id: messageId, senderId: userId },
    });

    if (!message) {
      throw new NotFoundException('الرسالة غير موجودة أو ليس لديك صلاحية لحذفها');
    }

    await this.messageRepository.remove(message);
    return { success: true };
  }
}