import { IsInt, IsOptional } from 'class-validator';

export class AddToWaitingListDto {
  @IsInt()
  patientId: number;

  @IsInt()
  doctorId: number;

  @IsInt()
  departmentId: number;

  @IsOptional()
  @IsInt()
  priority?: number = 1;
}
