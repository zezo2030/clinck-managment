import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialty } from '../../database/entities/specialty.entity';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}

  async create(createSpecialtyDto: CreateSpecialtyDto) {
    const specialty = this.specialtyRepository.create(createSpecialtyDto);
    const savedSpecialty = await this.specialtyRepository.save(specialty);
    return this.findOne(savedSpecialty.id);
  }

  async findAll() {
    return this.specialtyRepository.find({
      where: { isActive: true },
      relations: ['doctors'],
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number) {
    return this.specialtyRepository.findOne({
      where: { id },
      relations: ['doctors']
    });
  }

  async update(id: number, updateSpecialtyDto: UpdateSpecialtyDto) {
    await this.specialtyRepository.update(id, updateSpecialtyDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.specialtyRepository.update(id, { isActive: false });
    return { message: 'تم حذف التخصص بنجاح' };
  }

  async getSpecialtyStats() {
    const specialties = await this.specialtyRepository.find({
      relations: ['doctors', 'appointments']
    });

    return specialties.map(specialty => ({
      id: specialty.id,
      name: specialty.name,
      doctorsCount: specialty.doctors.length,
      appointmentsCount: specialty.appointments.length,
      services: specialty.services
    }));
  }
}
