import { IsInt, IsDateString, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  patientId: number;

  @IsInt()
  doctorId: number;

  @IsInt()
  clinicId: number;

  @IsInt()
  departmentId: number;

  @IsDateString()
  appointmentDate: string;

  @IsDateString()
  appointmentTime: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isEmergency?: boolean;
}
