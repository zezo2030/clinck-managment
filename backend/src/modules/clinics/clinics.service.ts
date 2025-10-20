import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@Injectable()
export class ClinicsService {
  constructor(private prisma: PrismaService) {}

  async create(createClinicDto: CreateClinicDto) {
    return this.prisma.clinic.create({
      data: createClinicDto,
      include: {
        departments: true,
        doctors: {
          include: {
            user: {
              include: { profile: true },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.clinic.findMany({
      include: {
        departments: true,
        doctors: {
          include: {
            user: {
              include: { profile: true },
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.clinic.findUnique({
      where: { id },
      include: {
        departments: true,
        doctors: {
          include: {
            user: {
              include: { profile: true },
            },
            schedules: true,
          },
        },
        appointments: {
          include: {
            patient: {
              include: { profile: true },
            },
            doctor: {
              include: { profile: true },
            },
          },
        },
      },
    });
  }

  async update(id: number, updateClinicDto: UpdateClinicDto) {
    return this.prisma.clinic.update({
      where: { id },
      data: updateClinicDto,
      include: {
        departments: true,
        doctors: {
          include: {
            user: {
              include: { profile: true },
            },
          },
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.clinic.delete({
      where: { id },
    });
  }

  async setActive(id: number, isActive: boolean) {
    return this.prisma.clinic.update({
      where: { id },
      data: { isActive },
    });
  }
}
