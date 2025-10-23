import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto, @CurrentUser() user: any) {
    return this.messagesService.create(
      createMessageDto.consultationId,
      user.id,
      createMessageDto.message,
      createMessageDto.messageType,
      createMessageDto.fileUrl
    );
  }

  @Get('consultation/:consultationId')
  getMessagesByConsultation(@Param('consultationId', ParseIntPipe) consultationId: number) {
    return this.messagesService.getMessagesByConsultation(consultationId);
  }

  @Get('unread')
  getUnreadMessages(@CurrentUser() user: any) {
    return this.messagesService.getUnreadMessages(user.id);
  }

  @Get(':id')
  getMessageById(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.getMessageById(id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.markAsRead(id);
  }

  @Patch('consultation/:consultationId/read-all')
  markAllAsRead(
    @Param('consultationId', ParseIntPipe) consultationId: number,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.markAllAsRead(consultationId);
  }

  @Delete(':id')
  deleteMessage(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.messagesService.deleteMessage(id, user.id);
  }
}
