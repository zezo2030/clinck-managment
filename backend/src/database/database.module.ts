import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './typeorm.config';
import { Consultation } from './entities/consultation.entity';
import { Message } from './entities/message.entity';
import { Appointment } from './entities/appointment.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => typeOrmConfig(process.env),
    }),
    TypeOrmModule.forFeature([Consultation, Message, Appointment, User]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
