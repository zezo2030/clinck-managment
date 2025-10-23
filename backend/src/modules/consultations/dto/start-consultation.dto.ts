import { IsOptional, IsString } from 'class-validator';

export class StartConsultationDto {
  @IsOptional()
  @IsString()
  notes?: string;
}
