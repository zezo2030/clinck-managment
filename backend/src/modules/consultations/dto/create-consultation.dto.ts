import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ConsultationType } from '@prisma/client';

export class CreateConsultationDto {
  @IsInt()
  appointmentId: number;

  @IsEnum(ConsultationType)
  type: ConsultationType;

  @IsOptional()
  @IsString()
  notes?: string;
}
