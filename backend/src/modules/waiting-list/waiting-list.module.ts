import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaitingListService } from './waiting-list.service';
import { WaitingListController } from './waiting-list.controller';
import { DatabaseModule } from '../../database/database.module';
import { WaitingList } from '../../database/entities/waiting-list.entity';
import { User } from '../../database/entities/user.entity';
import { Department } from '../../database/entities/department.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([WaitingList, User, Department])],
  controllers: [WaitingListController],
  providers: [WaitingListService],
  exports: [WaitingListService],
})
export class WaitingListModule {}
