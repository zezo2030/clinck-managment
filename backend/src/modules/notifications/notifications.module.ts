import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notification } from '../../database/entities/notification.entity';
import { User } from '../../database/entities/user.entity';
import { Appointment } from '../../database/entities/appointment.entity';
import { Consultation } from '../../database/entities/consultation.entity';
import { WaitingList } from '../../database/entities/waiting-list.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      User,
      Appointment,
      Consultation,
      WaitingList,
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
