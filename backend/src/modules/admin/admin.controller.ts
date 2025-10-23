import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats/overview')
  async getOverviewStats() {
    return this.adminService.getOverviewStats();
  }

  @Get('stats/appointments')
  async getAppointmentsStats(
    @Query('period') period: 'day' | 'week' | 'month' = 'day'
  ) {
    return this.adminService.getAppointmentsStats(period);
  }

  @Get('stats/doctors')
  async getDoctorsStats() {
    return this.adminService.getDoctorsStats();
  }

  @Get('stats/users-growth')
  async getUsersGrowthStats(
    @Query('period') period: 'week' | 'month' | 'year' = 'month'
  ) {
    return this.adminService.getUsersGrowthStats(period);
  }

  @Get('stats/waiting-list')
  async getWaitingListStats() {
    return this.adminService.getWaitingListStats();
  }

  @Get('stats/consultations')
  async getConsultationsStats() {
    return this.adminService.getConsultationsStats();
  }
}
