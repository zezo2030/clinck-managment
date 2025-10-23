import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Clinic } from './entities/clinic.entity';
import { Specialty } from './entities/specialty.entity';
import { Department } from './entities/department.entity';
import { Doctor } from './entities/doctor.entity';
import { Schedule } from './entities/schedule.entity';
import { Rating } from './entities/rating.entity';
import { Appointment } from './entities/appointment.entity';
import { WaitingList } from './entities/waiting-list.entity';
import { Consultation } from './entities/consultation.entity';
import { Message } from './entities/message.entity';
import { Notification } from './entities/notification.entity';
import { ActivityLog } from './entities/activity-log.entity';

export const typeOrmConfig = (env: NodeJS.ProcessEnv): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: env.DB_HOST || 'localhost',
  port: env.DB_PORT ? parseInt(env.DB_PORT, 10) : 5432,
  username: env.DB_USERNAME || 'postgres',
  password: env.DB_PASSWORD || 'password',
  database: env.DB_NAME || 'clinic_db',
  entities: [
    User,
    Profile,
    Clinic,
    Specialty,
    Department,
    Doctor,
    Schedule,
    Rating,
    Appointment,
    WaitingList,
    Consultation,
    Message,
    Notification,
    ActivityLog,
  ],
  synchronize: env.NODE_ENV !== 'production',
  logging: env.NODE_ENV === 'development',
});


