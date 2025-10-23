import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleEnum } from '../../database/enums/role.enum';
import { ActivityType, ActivitySeverity } from '../../database/entities/activity-log.entity';

@Controller('activity-log')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  @Roles(RoleEnum.ADMIN)
  async getActivityLogs(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('userId') userId?: string,
    @Query('type') type?: ActivityType,
    @Query('severity') severity?: ActivitySeverity,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return this.activityLogService.getActivityLogs(
      parseInt(page, 10),
      parseInt(limit, 10),
      userId ? parseInt(userId, 10) : undefined,
      type,
      severity,
      start,
      end
    );
  }

  @Get('stats')
  @Roles(RoleEnum.ADMIN)
  async getActivityStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: number,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return this.activityLogService.getActivityStats(start, end, userId);
  }

  @Get('recent/:userId')
  @Roles(RoleEnum.ADMIN)
  async getUserRecentActivities(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit') limit: string = '10',
  ) {
    return this.activityLogService.getUserRecentActivities(userId, parseInt(limit, 10));
  }

  @Get('critical')
  @Roles(RoleEnum.ADMIN)
  async getCriticalActivities(@Query('limit') limit: string = '20') {
    return this.activityLogService.getCriticalActivities(parseInt(limit, 10));
  }
}
