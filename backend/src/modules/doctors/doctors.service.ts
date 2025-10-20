import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async create(createDoctorDto: CreateDoctorDto) {
    return this.prisma.doctor.create({
      data: createDoctorDto,
      include: {
        user: {
          include: { profile: true },
        },
        clinic: true,
        department: true,
        schedules: true,
      },
    });
  }

  async findAll(query: any) {
    const { clinicId, departmentId, specialization, isAvailable } = query;
    
    return this.prisma.doctor.findMany({
      where: {
        ...(clinicId && { clinicId: parseInt(clinicId) }),
        ...(departmentId && { departmentId: parseInt(departmentId) }),
        ...(specialization && { specialization: { contains: specialization } }),
        ...(isAvailable !== undefined && { isAvailable: isAvailable === 'true' }),
      },
      include: {
        user: {
          include: { profile: true },
        },
        clinic: true,
        department: true,
        schedules: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          include: { profile: true },
        },
        clinic: true,
        department: true,
        schedules: true,
      },
    });
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return this.prisma.doctor.update({
      where: { id },
      data: updateDoctorDto,
      include: {
        user: {
          include: { profile: true },
        },
        clinic: true,
        department: true,
        schedules: true,
      },
    });
  }

  async setAvailability(id: number, isAvailable: boolean) {
    return this.prisma.doctor.update({
      where: { id },
      data: { isAvailable },
    });
  }

  async remove(id: number) {
    return this.prisma.doctor.delete({
      where: { id },
    });
  }
}
