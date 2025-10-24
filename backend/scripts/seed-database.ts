import { DataSource } from 'typeorm';
import { seedDatabase } from '../src/database/seed';
import { User } from '../src/database/entities/user.entity';
import { Profile } from '../src/database/entities/profile.entity';
import { Clinic } from '../src/database/entities/clinic.entity';
import { Specialty } from '../src/database/entities/specialty.entity';
import { Department } from '../src/database/entities/department.entity';
import { Doctor } from '../src/database/entities/doctor.entity';
import { Schedule } from '../src/database/entities/schedule.entity';
import { Rating } from '../src/database/entities/rating.entity';
import { Appointment } from '../src/database/entities/appointment.entity';
import { WaitingList } from '../src/database/entities/waiting-list.entity';
import { Consultation } from '../src/database/entities/consultation.entity';
import { Message } from '../src/database/entities/message.entity';
import { Notification } from '../src/database/entities/notification.entity';
import { ActivityLog } from '../src/database/entities/activity-log.entity';

async function runSeed() {
  console.log('🌱 Starting database seeding...');
  
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'clinic_db',
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
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
  });
  
  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');
    
    await seedDatabase(dataSource);
    console.log('✅ Database seeded successfully');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('✅ Database connection closed');
  }
}

runSeed();
