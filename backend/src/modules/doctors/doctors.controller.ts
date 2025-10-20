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
import { DoctorsService } from './doctors.service';
import { SchedulesService } from './schedules.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleEnum } from '../../database/enums/role.enum';

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorsController {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly schedulesService: SchedulesService,
  ) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR, RoleEnum.PATIENT)
  findAll(@Query() query: any) {
    return this.doctorsService.findAll(query);
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR, RoleEnum.PATIENT)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.remove(id);
  }

  @Patch(':id/availability')
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR)
  setAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.doctorsService.setAvailability(id, isAvailable);
  }

  // Schedule endpoints
  @Post(':id/schedules')
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR)
  createSchedule(
    @Param('id', ParseIntPipe) doctorId: number,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    return this.schedulesService.createSchedule(doctorId, createScheduleDto);
  }

  @Get(':id/schedules')
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR, RoleEnum.PATIENT)
  getDoctorSchedule(@Param('id', ParseIntPipe) doctorId: number) {
    return this.schedulesService.getDoctorSchedule(doctorId);
  }

  @Get('available')
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR, RoleEnum.PATIENT)
  getAvailableDoctors(
    @Query('date') date: string,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.schedulesService.getAvailableDoctors(
      new Date(date),
      departmentId ? parseInt(departmentId) : undefined,
    );
  }
}
