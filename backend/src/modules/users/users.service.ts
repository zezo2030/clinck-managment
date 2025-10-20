import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role || 'PATIENT',
        profile: {
          create: {
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            phone: createUserDto.phone,
            address: createUserDto.address,
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        profile: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateData: any = {};
    
    if (updateUserDto.email) updateData.email = updateUserDto.email;
    if (updateUserDto.role) updateData.role = updateUserDto.role;
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        profile: updateUserDto.firstName || updateUserDto.lastName || updateUserDto.phone || updateUserDto.address ? {
          update: {
            ...(updateUserDto.firstName && { firstName: updateUserDto.firstName }),
            ...(updateUserDto.lastName && { lastName: updateUserDto.lastName }),
            ...(updateUserDto.phone && { phone: updateUserDto.phone }),
            ...(updateUserDto.address && { address: updateUserDto.address }),
          },
        } : undefined,
      },
      include: {
        profile: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
