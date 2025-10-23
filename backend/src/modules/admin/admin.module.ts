import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../../database/entities/user.entity';
import { Clinic } from '../../database/entities/clinic.entity';
import { Appointment } from '../../database/entities/appointment.entity';
import { Consultation } from '../../database/entities/consultation.entity';
import { Doctor } from '../../database/entities/doctor.entity';
import { Specialty } from '../../database/entities/specialty.entity';
import { WaitingList } from '../../database/entities/waiting-list.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Clinic,
      Appointment,
      Consultation,
      Doctor,
      Specialty,
      WaitingList,
    ]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
