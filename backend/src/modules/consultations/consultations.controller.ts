import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { StartConsultationDto } from './dto/start-consultation.dto';
import { EndConsultationDto } from './dto/end-consultation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RoleEnum } from '../../database/enums/role.enum';

@Controller('consultations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR)
  create(@Body() createConsultationDto: CreateConsultationDto) {
    return this.consultationsService.create(createConsultationDto);
  }

  @Get()
  async getConsultations(
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
    @CurrentUser() user?: any,
  ) {
    const patientIdNum = patientId ? parseInt(patientId) : undefined;
    const doctorIdNum = doctorId ? parseInt(doctorId) : undefined;

    // إذا لم يتم تحديد patientId أو doctorId، استخدم بيانات المستخدم الحالي
    let finalPatientId = patientIdNum;
    let finalDoctorId = doctorIdNum;

    if (user.role === 'PATIENT' && !finalPatientId) {
      finalPatientId = user.id;
    }

    if (user.role === 'DOCTOR' && !finalDoctorId) {
      finalDoctorId = user.id;
    }

    return this.consultationsService.getConsultationHistory(finalPatientId, finalDoctorId);
  }

  @Get(':id')
  getConsultationById(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.getConsultationById(id);
  }

  @Get(':id/messages')
  getConsultationMessages(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.getConsultationMessages(id);
  }

  @Patch(':id/start')
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR)
  startConsultation(
    @Param('id', ParseIntPipe) id: number,
    @Body() startConsultationDto: StartConsultationDto,
  ) {
    return this.consultationsService.startConsultation(id, startConsultationDto);
  }

  @Patch(':id/end')
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR)
  endConsultation(
    @Param('id', ParseIntPipe) id: number,
    @Body() endConsultationDto: EndConsultationDto,
  ) {
    return this.consultationsService.endConsultation(id, endConsultationDto);
  }

  @Patch(':id/cancel')
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR)
  cancelConsultation(@Param('id', ParseIntPipe) id: number) {
    return this.consultationsService.cancelConsultation(id);
  }

  @Post(':id/messages')
  async sendMessage(
    @Param('id', ParseIntPipe) consultationId: number,
    @Body() body: { message: string; messageType?: string; fileUrl?: string },
    @CurrentUser() user: any,
  ) {
    return this.consultationsService.sendMessage(
      consultationId,
      user.id,
      body.message,
      body.messageType || 'TEXT',
      body.fileUrl,
    );
  }
}
