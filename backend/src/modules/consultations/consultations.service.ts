import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation, ConsultationStatus } from '../../database/entities/consultation.entity';
import { Appointment } from '../../database/entities/appointment.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { StartConsultationDto } from './dto/start-consultation.dto';
import { EndConsultationDto } from './dto/end-consultation.dto';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createConsultationDto: CreateConsultationDto) {
    // التحقق من وجود الموعد
    const appointment = await this.appointmentRepository.findOne({
      where: { id: createConsultationDto.appointmentId },
      relations: ['patient', 'doctor'],
    });

    if (!appointment) {
      throw new NotFoundException('الموعد غير موجود');
    }

    // التحقق من عدم وجود استشارة مسبقة لهذا الموعد
    const existingConsultation = await this.consultationRepository.findOne({
      where: { appointmentId: createConsultationDto.appointmentId },
    });

    if (existingConsultation) {
      throw new BadRequestException('يوجد استشارة مسبقة لهذا الموعد');
    }

    const consultation = this.consultationRepository.create({
      appointmentId: createConsultationDto.appointmentId,
      status: ConsultationStatus.PENDING,
      notes: createConsultationDto.notes,
    });

    return this.consultationRepository.save(consultation);
  }

  async findAll(patientId?: number, doctorId?: number) {
    const queryBuilder = this.consultationRepository
      .createQueryBuilder('consultation')
      .leftJoinAndSelect('consultation.appointment', 'appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor');

    if (patientId) {
      queryBuilder.andWhere('patient.id = :patientId', { patientId });
    }

    if (doctorId) {
      queryBuilder.andWhere('doctor.id = :doctorId', { doctorId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number) {
    const consultation = await this.consultationRepository.findOne({
      where: { id },
      relations: ['appointment', 'appointment.patient', 'appointment.doctor', 'messages'],
    });

    if (!consultation) {
      throw new NotFoundException('الاستشارة غير موجودة');
    }

    return consultation;
  }

  async start(id: number, startConsultationDto: StartConsultationDto) {
    const consultation = await this.findOne(id);

    if (consultation.status !== ConsultationStatus.PENDING) {
      throw new BadRequestException('لا يمكن بدء استشارة غير معلقة');
    }

    consultation.status = ConsultationStatus.IN_PROGRESS;
    consultation.startedAt = new Date();
    consultation.notes = startConsultationDto.notes;

    return this.consultationRepository.save(consultation);
  }

  async end(id: number, endConsultationDto: EndConsultationDto) {
    const consultation = await this.findOne(id);

    if (consultation.status !== ConsultationStatus.IN_PROGRESS) {
      throw new BadRequestException('لا يمكن إنهاء استشارة غير جارية');
    }

    consultation.status = ConsultationStatus.COMPLETED;
    consultation.endedAt = new Date();
    consultation.notes = endConsultationDto.notes;

    return this.consultationRepository.save(consultation);
  }

  async cancel(id: number, reason?: string) {
    const consultation = await this.findOne(id);

    if (consultation.status === ConsultationStatus.COMPLETED) {
      throw new BadRequestException('لا يمكن إلغاء استشارة مكتملة');
    }

    consultation.status = ConsultationStatus.CANCELLED;
    consultation.cancelledAt = new Date();
    consultation.cancellationReason = reason;

    return this.consultationRepository.save(consultation);
  }

  async getMessages(id: number) {
    const consultation = await this.findOne(id);
    return consultation.messages;
  }

  async sendMessage(consultationId: number, senderId: number, message: string, messageType: string = 'TEXT', fileUrl?: string) {
    const consultation = await this.findOne(consultationId);

    if (consultation.status !== ConsultationStatus.IN_PROGRESS) {
      throw new BadRequestException('لا يمكن إرسال رسالة في استشارة غير جارية');
    }

    // هنا يمكن إضافة منطق إرسال الرسالة
    // سيكون هذا في messages service منفصل
    return { success: true };
  }

  // إضافة الطرق المفقودة
  async getConsultationHistory(patientId?: number, doctorId?: number) {
    return this.findAll(patientId, doctorId);
  }

  async getConsultationById(id: number) {
    return this.findOne(id);
  }

  async getConsultationMessages(id: number) {
    return this.getMessages(id);
  }

  async startConsultation(id: number, startConsultationDto: StartConsultationDto) {
    return this.start(id, startConsultationDto);
  }

  async endConsultation(id: number, endConsultationDto: EndConsultationDto) {
    return this.end(id, endConsultationDto);
  }

  async cancelConsultation(id: number) {
    return this.cancel(id);
  }
}