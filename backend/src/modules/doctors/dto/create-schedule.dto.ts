import { IsInt, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateScheduleDto {
  @IsInt()
  doctorId: number;

  @IsInt()
  dayOfWeek: number; // 0-6 (الأحد-السبت)

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
