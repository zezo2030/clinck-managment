import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { SchedulesService } from './schedules.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DoctorsController],
  providers: [DoctorsService, SchedulesService],
  exports: [DoctorsService, SchedulesService],
})
export class DoctorsModule {}
