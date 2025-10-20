import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: createDepartmentDto,
      include: {
        clinic: true,
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

  async findAll(clinicId?: number) {
    return this.prisma.department.findMany({
      where: clinicId ? { clinicId } : {},
      include: {
        clinic: true,
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
    return this.prisma.department.findUnique({
      where: { id },
      include: {
        clinic: true,
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

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return this.prisma.department.update({
      where: { id },
      data: updateDepartmentDto,
      include: {
        clinic: true,
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
    return this.prisma.department.delete({
      where: { id },
    });
  }

  async setActive(id: number, isActive: boolean) {
    return this.prisma.department.update({
      where: { id },
      data: { isActive },
    });
  }
}
