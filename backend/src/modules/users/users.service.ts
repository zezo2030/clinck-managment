import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Profile } from '../../database/entities/profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
      role: (createUserDto.role as any) || 'PATIENT',
      isActive: true,
    });
    const savedUser = await this.userRepository.save(user);

    const profile = this.profileRepository.create({
      userId: savedUser.id,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phone: createUserDto.phone,
      address: createUserDto.address,
    });
    await this.profileRepository.save(profile);

    return this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ['profile'],
    });
  }

  async findAll() {
    return this.userRepository.find({ relations: ['profile'] });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['profile'] });
    return this.formatUserWithFullName(user);
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email }, relations: ['profile'] });
    return this.formatUserWithFullName(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const partial: Partial<User> = {};
    if (updateUserDto.email) partial.email = updateUserDto.email;
    if (updateUserDto.role) partial.role = updateUserDto.role as any;
    if (updateUserDto.password) partial.password = await bcrypt.hash(updateUserDto.password, 10);

    if (Object.keys(partial).length > 0) {
      await this.userRepository.update({ id }, partial);
    }

    const profilePartial: Partial<Profile> = {};
    if (updateUserDto.firstName) profilePartial.firstName = updateUserDto.firstName;
    if (updateUserDto.lastName) profilePartial.lastName = updateUserDto.lastName;
    if (updateUserDto.phone) profilePartial.phone = updateUserDto.phone;
    if (updateUserDto.address) profilePartial.address = updateUserDto.address;

    if (Object.keys(profilePartial).length > 0) {
      await this.profileRepository.update({ userId: id }, profilePartial);
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.userRepository.delete({ id });
    return { id } as any;
  }

  private formatUserWithFullName(user: any) {
    if (!user) return null;
    return {
      ...user,
      name: user.profile ? `${user.profile.firstName} ${user.profile.lastName}`.trim() : undefined,
    };
  }
}
