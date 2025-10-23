import { IsOptional, IsString } from 'class-validator';

export class EndConsultationDto {
  @IsOptional()
  @IsString()
  notes?: string;
}
