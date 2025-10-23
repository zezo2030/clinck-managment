import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleEnum } from '../../database/enums/role.enum';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('unreadOnly') unreadOnly: string = 'false',
  ) {
    // TODO: Get userId from JWT token
    const userId = 1; // This should come from the authenticated user
    return this.notificationsService.getUserNotifications(
      userId, 
      parseInt(page, 10), 
      parseInt(limit, 10), 
      unreadOnly === 'true'
    );
  }

  @Get('count')
  async getUnreadCount() {
    // TODO: Get userId from JWT token
    const userId = 1; // This should come from the authenticated user
    return this.notificationsService.getUnreadCount(userId);
  }

  @Get('stats')
  @Roles(RoleEnum.ADMIN)
  async getNotificationStats(@Query('userId') userId?: number) {
    return this.notificationsService.getNotificationStats(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    // TODO: Get userId from JWT token
    const userId = 1; // This should come from the authenticated user
    return this.notificationsService.markAsRead(id, userId);
  }

  @Patch('read-all')
  async markAllAsRead() {
    // TODO: Get userId from JWT token
    const userId = 1; // This should come from the authenticated user
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  async deleteNotification(@Param('id', ParseIntPipe) id: number) {
    // TODO: Get userId from JWT token
    const userId = 1; // This should come from the authenticated user
    return this.notificationsService.deleteNotification(id, userId);
  }

  @Delete('old')
  @Roles(RoleEnum.ADMIN)
  async deleteOldNotifications() {
    return this.notificationsService.deleteOldNotifications();
  }
}
