import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateSpecialtyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
