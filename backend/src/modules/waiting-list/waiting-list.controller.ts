import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { WaitingListService } from './waiting-list.service';
import { AddToWaitingListDto } from './dto/add-to-waiting-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('waiting-list')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WaitingListController {
  constructor(private readonly waitingListService: WaitingListService) {}

  @Post()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  addToWaitingList(@Body() addToWaitingListDto: AddToWaitingListDto) {
    return this.waitingListService.addToWaitingList(
      addToWaitingListDto.patientId,
      addToWaitingListDto.doctorId,
      addToWaitingListDto.departmentId,
      addToWaitingListDto.priority,
    );
  }

  @Get()
  @Roles(Role.ADMIN, Role.DOCTOR)
  getWaitingList(@Query('doctorId') doctorId?: string) {
    return this.waitingListService.getWaitingList(
      doctorId ? parseInt(doctorId) : undefined,
    );
  }

  @Get('notify-next')
  @Roles(Role.ADMIN, Role.DOCTOR)
  notifyNextInLine(
    @Query('doctorId', ParseIntPipe) doctorId: number,
    @Query('date') date: string,
    @Query('time') time: string,
  ) {
    return this.waitingListService.notifyNextInLine(
      doctorId,
      new Date(date),
      new Date(time),
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DOCTOR)
  removeFromWaitingList(@Param('id', ParseIntPipe) id: number) {
    return this.waitingListService.removeFromWaitingList(id);
  }

  @Patch(':id/priority')
  @Roles(Role.ADMIN, Role.DOCTOR)
  updatePriority(
    @Param('id', ParseIntPipe) id: number,
    @Body('priority', ParseIntPipe) priority: number,
  ) {
    return this.waitingListService.updatePriority(id, priority);
  }
}
