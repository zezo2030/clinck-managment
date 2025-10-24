import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Doctor } from '../../database/entities/doctor.entity';
import { User } from '../../database/entities/user.entity';
import { Profile } from '../../database/entities/profile.entity';
import { Clinic } from '../../database/entities/clinic.entity';
import { Department } from '../../database/entities/department.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor) private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Clinic) private readonly clinicRepository: Repository<Clinic>,
    @InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto, avatarFile?: Express.Multer.File) {
    const doctor = this.doctorRepository.create(createDoctorDto as any);
    const savedDoctor = await this.doctorRepository.save(doctor);
    
    // رفع الصورة الشخصية إذا تم إرسالها
    if (avatarFile) {
      const uploadResult = await this.fileUploadService.uploadFile(avatarFile, 'doctors');
      
      // تحديث الصورة الشخصية في Profile
      await this.profileRepository.update(
        { userId: createDoctorDto.userId },
        { avatar: uploadResult.url }
      );
    }
    
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
      relations: ['user', 'user.profile', 'clinic', 'department', 'specialty', 'schedules', 'ratings', 'ratings.patient', 'ratings.patient.profile'],
    });
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto, avatarFile?: Express.Multer.File) {
    await this.doctorRepository.update({ id }, updateDoctorDto as any);
    
    // رفع الصورة الشخصية إذا تم إرسالها
    if (avatarFile) {
      const uploadResult = await this.fileUploadService.uploadFile(avatarFile, 'doctors');
      
      // الحصول على الطبيب لتحديث Profile
      const doctor = await this.doctorRepository.findOne({ where: { id } });
      if (doctor) {
        await this.profileRepository.update(
          { userId: doctor.userId },
          { avatar: uploadResult.url }
        );
      }
    }
    
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
