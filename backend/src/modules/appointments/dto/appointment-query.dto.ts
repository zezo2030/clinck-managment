import { IsOptional, IsString, IsInt, IsEnum } from 'class-validator';
import { AppointmentStatusEnum } from '../../../database/enums/appointment-status.enum';

export class AppointmentQueryDto {
  @IsOptional()
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @IsInt()
  limit?: number = 10;

  @IsOptional()
  @IsEnum(AppointmentStatusEnum)
  status?: AppointmentStatusEnum;

  @IsOptional()
  @IsInt()
  doctorId?: number;

  @IsOptional()
  @IsInt()
  patientId?: number;

  @IsOptional()
  @IsInt()
  clinicId?: number;

  @IsOptional()
  @IsString()
  date?: string;
}
