import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateDepartmentDto {
  @IsInt()
  clinicId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
