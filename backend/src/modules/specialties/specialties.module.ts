import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialtiesService } from './specialties.service';
import { SpecialtiesController } from './specialties.controller';
import { DatabaseModule } from '../../database/database.module';
import { Specialty } from '../../database/entities/specialty.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Specialty])],
  controllers: [SpecialtiesController],
  providers: [SpecialtiesService],
  exports: [SpecialtiesService],
})
export class SpecialtiesModule {}
