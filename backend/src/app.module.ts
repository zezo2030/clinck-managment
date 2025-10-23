import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './health/health.module';
import { ClinicsModule } from './modules/clinics/clinics.module';
import { SpecialtiesModule } from './modules/specialties/specialties.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { WaitingListModule } from './modules/waiting-list/waiting-list.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AgoraModule } from './modules/agora/agora.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { AppointmentReminderScheduler } from './common/schedulers/appointment-reminder.scheduler';
import { WaitingListScheduler } from './common/schedulers/waiting-list.scheduler';
import { ConsultationGateway } from './common/gateways/consultation.gateway';
import { MessageGateway } from './common/gateways/message.gateway';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import emailConfig from './config/email.config';
import agoraConfig from './config/agora.config';
import { typeOrmConfig } from './database/typeorm.config';
import { Appointment } from './database/entities/appointment.entity';
import { WaitingList } from './database/entities/waiting-list.entity';
import { Department } from './database/entities/department.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, redisConfig, emailConfig, agoraConfig],
    }),
    TypeOrmModule.forRoot(typeOrmConfig(process.env)),
    // Repositories needed by schedulers
    TypeOrmModule.forFeature([Appointment, WaitingList, Department]),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    HealthModule,
    ClinicsModule,
    SpecialtiesModule,
    DoctorsModule,
    AppointmentsModule,
    WaitingListModule,
    ConsultationsModule,
    MessagesModule,
    AgoraModule,
    FileUploadModule,
  ],
  providers: [
    AppointmentReminderScheduler, 
    WaitingListScheduler,
    ConsultationGateway,
    MessageGateway,
  ],
})
export class AppModule {}
