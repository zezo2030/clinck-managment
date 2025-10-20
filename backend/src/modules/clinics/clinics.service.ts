import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from '../../database/entities/clinic.entity';
import { Department } from '../../database/entities/department.entity';
import { Doctor } from '../../database/entities/doctor.entity';
import { Appointment } from '../../database/entities/appointment.entity';
import { User } from '../../database/entities/user.entity';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic) private readonly clinicRepository: Repository<Clinic>,
    @InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Doctor) private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Appointment) private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createClinicDto: CreateClinicDto) {
    const clinic = this.clinicRepository.create(createClinicDto as any);
    const savedClinic = await this.clinicRepository.save(clinic);
    return this.findOne((savedClinic as any).id);
  }

  async findAll() {
    return this.clinicRepository.find({
      relations: [
        'departments',
        'doctors',
        'doctors.user',
        'doctors.user.profile',
      ],
    });
  }

  async findOne(id: number) {
    return this.clinicRepository.findOne({
      where: { id },
      relations: [
        'departments',
        'doctors',
        'doctors.user',
        'doctors.user.profile',
        'doctors.schedules',
        'appointments',
        'appointments.patient',
        'appointments.patient.profile',
        'appointments.doctor',
        'appointments.doctor.profile',
      ],
    });
  }

  async update(id: number, updateClinicDto: UpdateClinicDto) {
    await this.clinicRepository.update({ id }, updateClinicDto as any);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.clinicRepository.delete({ id });
    return { id } as any;
  }

  async setActive(id: number, isActive: boolean) {
    await this.clinicRepository.update({ id }, { isActive });
    return this.findOne(id);
  }
}
