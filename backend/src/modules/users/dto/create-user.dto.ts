import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'البريد الإلكتروني',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'كلمة المرور',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'دور المستخدم',
    enum: Role,
    example: 'PATIENT',
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({
    description: 'الاسم الأول',
    example: 'أحمد',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'الاسم الأخير',
    example: 'محمد',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'رقم الهاتف',
    example: '+966501234567',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'العنوان',
    example: 'الرياض، المملكة العربية السعودية',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;
}
