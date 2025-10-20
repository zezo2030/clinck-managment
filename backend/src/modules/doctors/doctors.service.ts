import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Doctor } from '../../database/entities/doctor.entity';
import { User } from '../../database/entities/user.entity';
import { Clinic } from '../../database/entities/clinic.entity';
import { Department } from '../../database/entities/department.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor) private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Clinic) private readonly clinicRepository: Repository<Clinic>,
    @InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const doctor = this.doctorRepository.create(createDoctorDto as any);
    const savedDoctor = await this.doctorRepository.save(doctor);
    return this.findOne((savedDoctor as any).id);
  }

  async findAll(query: any) {
    const { clinicId, departmentId, specialization, isAvailable } = query;
    return this.doctorRepository.find({
      where: {
        ...(clinicId && { clinicId: parseInt(clinicId, 10) } as any),
        ...(departmentId && { departmentId: parseInt(departmentId, 10) } as any),
        ...(specialization && { specialization: ILike(`%${specialization}%`) } as any),
        ...(isAvailable !== undefined && { isAvailable: String(isAvailable) === 'true' } as any),
      },
      relations: ['user', 'user.profile', 'clinic', 'department', 'schedules'],
    });
  }

  async findOne(id: number) {
    return this.doctorRepository.findOne({
      where: { id },
      relations: ['user', 'user.profile', 'clinic', 'department', 'schedules'],
    });
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    await this.doctorRepository.update({ id }, updateDoctorDto as any);
    return this.findOne(id);
  }

  async setAvailability(id: number, isAvailable: boolean) {
    await this.doctorRepository.update({ id }, { isAvailable });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.doctorRepository.delete({ id });
    return { id } as any;
  }
}
