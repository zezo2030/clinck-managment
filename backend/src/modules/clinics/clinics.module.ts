import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicsService } from './clinics.service';
import { ClinicsController } from './clinics.controller';
import { DatabaseModule } from '../../database/database.module';
import { Clinic } from '../../database/entities/clinic.entity';
import { Department } from '../../database/entities/department.entity';
import { Doctor } from '../../database/entities/doctor.entity';
import { Appointment } from '../../database/entities/appointment.entity';
import { User } from '../../database/entities/user.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Clinic, Department, Doctor, Appointment, User])],
  controllers: [ClinicsController],
  providers: [ClinicsService],
  exports: [ClinicsService],
})
export class ClinicsModule {}
