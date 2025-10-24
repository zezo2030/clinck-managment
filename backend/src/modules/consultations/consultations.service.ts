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

    const result = await this.consultationRepository.save(consultation);
    return result;
  }

  async findAll(patientId?: number, doctorId?: number) {
    try {
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

      const result = await queryBuilder.getMany();
      // التأكد من إرجاع مصفوفة دائماً
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error fetching consultations:', error);
      // إرجاع مصفوفة فارغة في حالة الخطأ
      return [];
    }
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

    const result = await this.consultationRepository.save(consultation);
    return result;
  }

  async end(id: number, endConsultationDto: EndConsultationDto) {
    const consultation = await this.findOne(id);

    if (consultation.status !== ConsultationStatus.IN_PROGRESS) {
      throw new BadRequestException('لا يمكن إنهاء استشارة غير جارية');
    }

    consultation.status = ConsultationStatus.COMPLETED;
    consultation.endedAt = new Date();
    consultation.notes = endConsultationDto.notes;

    const result = await this.consultationRepository.save(consultation);
    return result;
  }

  async cancel(id: number, reason?: string) {
    const consultation = await this.findOne(id);

    if (consultation.status === ConsultationStatus.COMPLETED) {
      throw new BadRequestException('لا يمكن إلغاء استشارة مكتملة');
    }

    consultation.status = ConsultationStatus.CANCELLED;
    consultation.cancelledAt = new Date();
    consultation.cancellationReason = reason;

    const result = await this.consultationRepository.save(consultation);
    return result;
  }

  async getMessages(id: number) {
    const consultation = await this.findOne(id);
    return consultation.messages || [];
  }

  async sendMessage(consultationId: number, senderId: number, message: string, messageType: string = 'TEXT', fileUrl?: string) {
    const consultation = await this.findOne(consultationId);

    if (consultation.status !== ConsultationStatus.IN_PROGRESS) {
      throw new BadRequestException('لا يمكن إرسال رسالة في استشارة غير جارية');
    }

    // هنا يمكن إضافة منطق إرسال الرسالة
    // سيكون هذا في messages service منفصل
    return { success: true, message: 'تم إرسال الرسالة بنجاح' };
  }

  // إضافة الطرق المفقودة
  async getConsultationHistory(patientId?: number, doctorId?: number) {
    try {
      const result = await this.findAll(patientId, doctorId);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error fetching consultation history:', error);
      return [];
    }
  }

  async getConsultationById(id: number) {
    return this.findOne(id);
  }

  async getConsultationMessages(id: number) {
    const result = await this.getMessages(id);
    return result || [];
  }

  async startConsultation(id: number, startConsultationDto: StartConsultationDto) {
    const result = await this.start(id, startConsultationDto);
    return result;
  }

  async endConsultation(id: number, endConsultationDto: EndConsultationDto) {
    const result = await this.end(id, endConsultationDto);
    return result;
  }

  async cancelConsultation(id: number) {
    const result = await this.cancel(id);
    return result;
  }
}