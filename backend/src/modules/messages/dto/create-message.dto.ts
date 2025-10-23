import { IsEnum, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { MessageType } from '../../../database/entities/message.entity';

export class CreateMessageDto {
  @IsInt()
  consultationId: number;

  @IsInt()
  senderId: number;

  @IsString()
  message: string;

  @IsEnum(MessageType)
  messageType: MessageType;

  @IsOptional()
  @IsUrl()
  fileUrl?: string;
}
