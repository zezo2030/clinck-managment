import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../../database/entities/department.entity';
import { Clinic } from '../../database/entities/clinic.entity';
import { Doctor } from '../../database/entities/doctor.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Clinic) private readonly clinicRepository: Repository<Clinic>,
    @InjectRepository(Doctor) private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const dept = this.departmentRepository.create(createDepartmentDto as any);
    const savedDept = await this.departmentRepository.save(dept);
    return this.findOne((savedDept as any).id);
  }

  async findAll(clinicId?: number) {
    return this.departmentRepository.find({
      where: clinicId ? { clinicId } as any : {},
      relations: ['clinic', 'doctors', 'doctors.user', 'doctors.user.profile'],
    });
  }

  async findOne(id: number) {
    return this.departmentRepository.findOne({
      where: { id },
      relations: [
        'clinic',
        'doctors',
        'doctors.user',
        'doctors.user.profile',
        'doctors.schedules',
      ],
    });
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    await this.departmentRepository.update({ id }, updateDepartmentDto as any);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.departmentRepository.delete({ id });
    return { id } as any;
  }

  async setActive(id: number, isActive: boolean) {
    await this.departmentRepository.update({ id }, { isActive });
    return this.findOne(id);
  }
}
