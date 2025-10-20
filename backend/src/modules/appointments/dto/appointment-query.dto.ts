import { IsOptional, IsString, IsInt, IsEnum } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class AppointmentQueryDto {
  @IsOptional()
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @IsInt()
  limit?: number = 10;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

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
