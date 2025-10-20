import { IsString, IsEmail, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class CreateClinicDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsObject()
  workingHours: any;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
