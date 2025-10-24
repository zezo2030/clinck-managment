import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { SchedulesService } from './schedules.service';
import { DatabaseModule } from '../../database/database.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { Doctor } from '../../database/entities/doctor.entity';
import { Schedule } from '../../database/entities/schedule.entity';
import { User } from '../../database/entities/user.entity';
import { Profile } from '../../database/entities/profile.entity';
import { Clinic } from '../../database/entities/clinic.entity';
import { Department } from '../../database/entities/department.entity';

@Module({
  imports: [DatabaseModule, FileUploadModule, TypeOrmModule.forFeature([Doctor, Schedule, User, Profile, Clinic, Department])],
  controllers: [DoctorsController],
  providers: [DoctorsService, SchedulesService],
  exports: [DoctorsService, SchedulesService],
})
export class DoctorsModule {}
