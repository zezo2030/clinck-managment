import { IsString, IsInt, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateDoctorDto {
  @IsInt()
  userId: number;

  @IsInt()
  clinicId: number;

  @IsInt()
  departmentId: number;

  @IsString()
  specialization: string;

  @IsString()
  licenseNumber: string;

  @IsInt()
  experience: number;

  @IsNumber()
  consultationFee: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
