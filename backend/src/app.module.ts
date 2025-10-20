import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './health/health.module';
import { ClinicsModule } from './modules/clinics/clinics.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { WaitingListModule } from './modules/waiting-list/waiting-list.module';
import { PrismaService } from './database/prisma.service';
import { AppointmentReminderScheduler } from './common/schedulers/appointment-reminder.scheduler';
import { WaitingListScheduler } from './common/schedulers/waiting-list.scheduler';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import emailConfig from './config/email.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, redisConfig, emailConfig],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    HealthModule,
    ClinicsModule,
    DepartmentsModule,
    DoctorsModule,
    AppointmentsModule,
    WaitingListModule,
  ],
  providers: [PrismaService, AppointmentReminderScheduler, WaitingListScheduler],
})
export class AppModule {}
