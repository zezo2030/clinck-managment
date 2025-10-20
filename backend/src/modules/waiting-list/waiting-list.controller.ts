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
import { RoleEnum } from '../../database/enums/role.enum';

@Controller('waiting-list')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WaitingListController {
  constructor(private readonly waitingListService: WaitingListService) {}

  @Post()
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR, RoleEnum.PATIENT)
  addToWaitingList(@Body() addToWaitingListDto: AddToWaitingListDto) {
    return this.waitingListService.addToWaitingList(
      addToWaitingListDto.patientId,
      addToWaitingListDto.doctorId,
      addToWaitingListDto.departmentId,
      addToWaitingListDto.priority,
    );
  }

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR)
  getWaitingList(@Query('doctorId') doctorId?: string) {
    return this.waitingListService.getWaitingList(
      doctorId ? parseInt(doctorId) : undefined,
    );
  }

  @Get('notify-next')
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR)
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
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR)
  removeFromWaitingList(@Param('id', ParseIntPipe) id: number) {
    return this.waitingListService.removeFromWaitingList(id);
  }

  @Patch(':id/priority')
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR)
  updatePriority(
    @Param('id', ParseIntPipe) id: number,
    @Body('priority', ParseIntPipe) priority: number,
  ) {
    return this.waitingListService.updatePriority(id, priority);
  }
}
