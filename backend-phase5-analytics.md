# 📊 المرحلة الخامسة: التحليلات والتقارير - نظام إدارة العيادات

## 📋 نظرة عامة على المرحلة الخامسة

هذه المرحلة تركز على تطوير نظام تحليلات شامل مع تقارير متقدمة ولوحات تحكم تفاعلية.

**المدة المقدرة:** 4 أسابيع  
**الهدف:** تطوير نظام تحليلات متكامل مع تقارير ذكية

---

## 🛠️ التقنيات المطلوبة

### **Core Framework:**
- **NestJS** - إطار عمل Node.js متقدم
- **TypeScript** - لغة البرمجة
- **Node.js** - بيئة التشغيل

### **Database:**
- **PostgreSQL** - قاعدة البيانات الرئيسية
- **Prisma** - ORM لإدارة قاعدة البيانات
- **Redis** - تخزين مؤقت للتحليلات

### **Analytics & Reporting:**
- **Chart.js** - الرسوم البيانية
- **D3.js** - الرسوم البيانية المتقدمة
- **Puppeteer** - توليد PDFs

### **Data Processing:**
- **Bull Queue** - معالجة البيانات
- **Cron Jobs** - التقارير المجدولة

---

## 🏗️ هيكل المشروع للمرحلة الخامسة

```
backend/
├── src/
│   ├── modules/
│   │   ├── analytics/         # وحدة التحليلات
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── analytics.module.ts
│   │   │   ├── dto/
│   │   │   │   ├── analytics-query.dto.ts
│   │   │   │   └── report-request.dto.ts
│   │   │   └── entities/
│   │   │       └── analytics.entity.ts
│   │   ├── reports/           # وحدة التقارير
│   │   │   ├── reports.controller.ts
│   │   │   ├── reports.service.ts
│   │   │   ├── reports.module.ts
│   │   │   ├── dto/
│   │   │   └── templates/
│   │   │       ├── appointment-report.template.ts
│   │   │       ├── financial-report.template.ts
│   │   │       └── doctor-report.template.ts
│   │   ├── dashboard/         # وحدة لوحة التحكم
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── dashboard.service.ts
│   │   │   └── dashboard.module.ts
│   │   └── export/           # وحدة التصدير
│   │       ├── export.controller.ts
│   │       ├── export.service.ts
│   │       └── export.module.ts
│   ├── common/
│   │   ├── schedulers/        # المهام المجدولة
│   │   │   ├── analytics.scheduler.ts
│   │   │   ├── reports.scheduler.ts
│   │   │   └── data-cleanup.scheduler.ts
│   │   ├── queues/            # طوابير المهام
│   │   │   ├── analytics.queue.ts
│   │   │   └── reports.queue.ts
│   │   └── utils/
│   │       ├── chart.util.ts
│   │       ├── pdf.util.ts
│   │       └── data.util.ts
│   └── config/
│       ├── analytics.config.ts
│       └── reports.config.ts
```

---

## 🗄️ قاعدة البيانات - المرحلة الخامسة

### **إضافة الجداول الجديدة**

```prisma
// جدول التحليلات المخزنة
model AnalyticsCache {
  id          Int      @id @default(autoincrement())
  type        String   // 'doctor_stats', 'clinic_stats', 'revenue_stats'
  entityId    Int?     // ID of doctor, clinic, etc.
  period      String   // 'daily', 'weekly', 'monthly', 'yearly'
  data        Json     // Cached analytics data
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([type, entityId, period])
  @@map("analytics_cache")
}

// جدول التقارير
model Report {
  id          Int      @id @default(autoincrement())
  name        String
  type        ReportType
  parameters  Json     // Report parameters
  status      ReportStatus @default(PENDING)
  fileUrl     String?
  generatedBy Int
  createdAt   DateTime @default(now())
  completedAt DateTime?

  // العلاقات
  user User @relation(fields: [generatedBy], references: [id])

  @@map("reports")
}

// جدول إعدادات لوحة التحكم
model DashboardSettings {
  id          Int      @id @default(autoincrement())
  userId      Int      @unique
  widgets     Json     // Dashboard widget configuration
  layout      Json     // Dashboard layout
  filters     Json     // Default filters
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // العلاقات
  user User @relation(fields: [userId], references: [id])

  @@map("dashboard_settings")
}

// Enums
enum ReportType {
  APPOINTMENT
  FINANCIAL
  DOCTOR_PERFORMANCE
  PATIENT_ANALYSIS
  REVENUE
  CUSTOM
}

enum ReportStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

---

## 🚀 خطوات التنفيذ

### **الأسبوع الأول: وحدة التحليلات**

#### **1.1 خدمة التحليلات الأساسية**
```typescript
// src/modules/analytics/analytics.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDoctorStats(doctorId: number, startDate: Date, endDate: Date) {
    // التحقق من وجود البيانات في الكاش
    const cachedData = await this.getCachedAnalytics('doctor_stats', doctorId, startDate, endDate);
    if (cachedData) {
      return cachedData;
    }

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const consultations = await this.prisma.consultation.findMany({
      where: {
        appointment: {
          doctorId,
          appointmentDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
    });

    const ratings = await this.prisma.rating.findMany({
      where: {
        doctorId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(a => a.status === 'COMPLETED').length;
    const cancelledAppointments = appointments.filter(a => a.status === 'CANCELLED').length;
    const noShowAppointments = appointments.filter(a => a.status === 'NO_SHOW').length;

    const totalConsultations = consultations.length;
    const completedConsultations = consultations.filter(c => c.status === 'COMPLETED').length;
    const totalDuration = consultations.reduce((sum, c) => sum + (c.duration || 0), 0);

    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0;

    const stats = {
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      noShowAppointments,
      completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0,
      totalConsultations,
      completedConsultations,
      totalDuration,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length,
    };

    // حفظ البيانات في الكاش
    await this.cacheAnalytics('doctor_stats', doctorId, startDate, endDate, stats);

    return stats;
  }

  async getClinicStats(clinicId: number, startDate: Date, endDate: Date) {
    const cachedData = await this.getCachedAnalytics('clinic_stats', clinicId, startDate, endDate);
    if (cachedData) {
      return cachedData;
    }

    const appointments = await this.prisma.appointment.findMany({
      where: {
        clinicId,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        payment: true,
      },
    });

    const doctors = await this.prisma.doctor.findMany({
      where: { clinicId },
    });

    const totalAppointments = appointments.length;
    const totalRevenue = appointments
      .filter(a => a.payment?.status === 'COMPLETED')
      .reduce((sum, a) => sum + Number(a.payment?.amount || 0), 0);

    const departmentStats = await this.prisma.department.findMany({
      where: { clinicId },
      include: {
        appointments: {
          where: {
            appointmentDate: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    const stats = {
      totalAppointments,
      totalRevenue,
      totalDoctors: doctors.length,
      departmentStats: departmentStats.map(dept => ({
        name: dept.name,
        appointments: dept.appointments.length,
      })),
    };

    await this.cacheAnalytics('clinic_stats', clinicId, startDate, endDate, stats);
    return stats;
  }

  async getPatientStats(patientId: number, startDate: Date, endDate: Date) {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        patientId,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        doctor: {
          include: { profile: true },
        },
        department: true,
      },
    });

    const consultations = await this.prisma.consultation.findMany({
      where: {
        appointment: {
          patientId,
          appointmentDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
    });

    return {
      totalAppointments: appointments.length,
      completedAppointments: appointments.filter(a => a.status === 'COMPLETED').length,
      totalConsultations: consultations.length,
      completedConsultations: consultations.filter(c => c.status === 'COMPLETED').length,
      favoriteDoctors: this.getFavoriteDoctors(appointments),
      favoriteDepartments: this.getFavoriteDepartments(appointments),
    };
  }

  async getRevenueAnalytics(startDate: Date, endDate: Date) {
    const payments = await this.prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        appointment: {
          include: {
            doctor: {
              include: { profile: true },
            },
            clinic: true,
          },
        },
      },
    });

    const dailyRevenue = this.calculateDailyRevenue(payments);
    const monthlyRevenue = this.calculateMonthlyRevenue(payments);
    const paymentMethodStats = this.calculatePaymentMethodStats(payments);

    return {
      totalRevenue: payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + Number(p.amount), 0),
      totalRefunds: payments
        .filter(p => p.status === 'REFUNDED')
        .reduce((sum, p) => sum + Number(p.refundAmount || 0), 0),
      dailyRevenue,
      monthlyRevenue,
      paymentMethodStats,
    };
  }

  private getFavoriteDoctors(appointments: any[]) {
    const doctorCounts = appointments.reduce((acc, appointment) => {
      const doctorName = `${appointment.doctor.profile.firstName} ${appointment.doctor.profile.lastName}`;
      acc[doctorName] = (acc[doctorName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(doctorCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5);
  }

  private getFavoriteDepartments(appointments: any[]) {
    const departmentCounts = appointments.reduce((acc, appointment) => {
      const deptName = appointment.department.name;
      acc[deptName] = (acc[deptName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(departmentCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5);
  }

  private calculateDailyRevenue(payments: any[]) {
    const dailyRevenue = {};
    payments
      .filter(p => p.status === 'COMPLETED')
      .forEach(payment => {
        const date = payment.createdAt.toISOString().split('T')[0];
        dailyRevenue[date] = (dailyRevenue[date] || 0) + Number(payment.amount);
      });
    return dailyRevenue;
  }

  private calculateMonthlyRevenue(payments: any[]) {
    const monthlyRevenue = {};
    payments
      .filter(p => p.status === 'COMPLETED')
      .forEach(payment => {
        const month = payment.createdAt.toISOString().substring(0, 7);
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(payment.amount);
      });
    return monthlyRevenue;
  }

  private calculatePaymentMethodStats(payments: any[]) {
    const methodStats = {};
    payments
      .filter(p => p.status === 'COMPLETED')
      .forEach(payment => {
        const method = payment.paymentMethod;
        if (!methodStats[method]) {
          methodStats[method] = { count: 0, total: 0 };
        }
        methodStats[method].count++;
        methodStats[method].total += Number(payment.amount);
      });
    return methodStats;
  }

  private async getCachedAnalytics(type: string, entityId: number, startDate: Date, endDate: Date) {
    const cache = await this.prisma.analyticsCache.findUnique({
      where: {
        type_entityId_period: {
          type,
          entityId,
          period: this.getPeriodKey(startDate, endDate),
        },
      },
    });

    if (cache && this.isCacheValid(cache.updatedAt)) {
      return cache.data;
    }

    return null;
  }

  private async cacheAnalytics(type: string, entityId: number, startDate: Date, endDate: Date, data: any) {
    await this.prisma.analyticsCache.upsert({
      where: {
        type_entityId_period: {
          type,
          entityId,
          period: this.getPeriodKey(startDate, endDate),
        },
      },
      update: { data },
      create: {
        type,
        entityId,
        period: this.getPeriodKey(startDate, endDate),
        data,
      },
    });
  }

  private getPeriodKey(startDate: Date, endDate: Date): string {
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'daily';
    if (diffDays <= 7) return 'weekly';
    if (diffDays <= 30) return 'monthly';
    return 'yearly';
  }

  private isCacheValid(updatedAt: Date): boolean {
    const now = new Date();
    const diffTime = now.getTime() - updatedAt.getTime();
    const diffHours = diffTime / (1000 * 60 * 60);
    return diffHours < 1; // Cache valid for 1 hour
  }
}
```

#### **1.2 Analytics Controller**
```typescript
// src/modules/analytics/analytics.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('doctor/:doctorId')
  @Roles('ADMIN', 'DOCTOR')
  async getDoctorStats(
    @Param('doctorId') doctorId: number,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getDoctorStats(
      doctorId,
      new Date(query.startDate),
      new Date(query.endDate),
    );
  }

  @Get('clinic/:clinicId')
  @Roles('ADMIN')
  async getClinicStats(
    @Param('clinicId') clinicId: number,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getClinicStats(
      clinicId,
      new Date(query.startDate),
      new Date(query.endDate),
    );
  }

  @Get('patient/:patientId')
  @Roles('ADMIN', 'DOCTOR', 'PATIENT')
  async getPatientStats(
    @Param('patientId') patientId: number,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getPatientStats(
      patientId,
      new Date(query.startDate),
      new Date(query.endDate),
    );
  }

  @Get('revenue')
  @Roles('ADMIN')
  async getRevenueAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getRevenueAnalytics(
      new Date(query.startDate),
      new Date(query.endDate),
    );
  }
}
```

### **الأسبوع الثاني: وحدة التقارير**

#### **2.1 خدمة التقارير**
```typescript
// src/modules/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PDFService } from '../export/pdf.service';
import { ReportRequestDto } from './dto/report-request.dto';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PDFService,
  ) {}

  async generateReport(reportRequest: ReportRequestDto, userId: number) {
    // إنشاء سجل التقرير
    const report = await this.prisma.report.create({
      data: {
        name: reportRequest.name,
        type: reportRequest.type,
        parameters: reportRequest.parameters,
        generatedBy: userId,
        status: 'PENDING',
      },
    });

    // معالجة التقرير في الخلفية
    this.processReport(report.id, reportRequest);

    return report;
  }

  async processReport(reportId: number, reportRequest: ReportRequestDto) {
    try {
      // تحديث حالة التقرير
      await this.prisma.report.update({
        where: { id: reportId },
        data: { status: 'PROCESSING' },
      });

      let reportData;
      let template;

      switch (reportRequest.type) {
        case 'APPOINTMENT':
          reportData = await this.generateAppointmentReport(reportRequest.parameters);
          template = 'appointment-report';
          break;
        case 'FINANCIAL':
          reportData = await this.generateFinancialReport(reportRequest.parameters);
          template = 'financial-report';
          break;
        case 'DOCTOR_PERFORMANCE':
          reportData = await this.generateDoctorPerformanceReport(reportRequest.parameters);
          template = 'doctor-report';
          break;
        default:
          throw new Error('نوع التقرير غير مدعوم');
      }

      // توليد ملف PDF
      const pdfBuffer = await this.pdfService.generatePDF(template, reportData);
      
      // رفع الملف إلى التخزين السحابي
      const fileUrl = await this.uploadReportFile(reportId, pdfBuffer);

      // تحديث التقرير
      await this.prisma.report.update({
        where: { id: reportId },
        data: {
          status: 'COMPLETED',
          fileUrl,
          completedAt: new Date(),
        },
      });

    } catch (error) {
      await this.prisma.report.update({
        where: { id: reportId },
        data: { status: 'FAILED' },
      });
      throw error;
    }
  }

  async generateAppointmentReport(parameters: any) {
    const { startDate, endDate, clinicId, doctorId } = parameters;

    const appointments = await this.prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        ...(clinicId && { clinicId }),
        ...(doctorId && { doctorId }),
      },
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
        clinic: true,
        department: true,
      },
    });

    const stats = {
      totalAppointments: appointments.length,
      completedAppointments: appointments.filter(a => a.status === 'COMPLETED').length,
      cancelledAppointments: appointments.filter(a => a.status === 'CANCELLED').length,
      noShowAppointments: appointments.filter(a => a.status === 'NO_SHOW').length,
      completionRate: appointments.length > 0 
        ? (appointments.filter(a => a.status === 'COMPLETED').length / appointments.length) * 100 
        : 0,
    };

    return {
      title: 'تقرير المواعيد',
      period: `${startDate} - ${endDate}`,
      stats,
      appointments: appointments.map(appointment => ({
        id: appointment.id,
        patientName: `${appointment.patient.profile.firstName} ${appointment.patient.profile.lastName}`,
        doctorName: `${appointment.doctor.profile.firstName} ${appointment.doctor.profile.lastName}`,
        clinicName: appointment.clinic.name,
        departmentName: appointment.department.name,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        status: appointment.status,
      })),
    };
  }

  async generateFinancialReport(parameters: any) {
    const { startDate, endDate, clinicId } = parameters;

    const payments = await this.prisma.payment.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        ...(clinicId && {
          appointment: { clinicId },
        }),
      },
      include: {
        appointment: {
          include: {
            clinic: true,
            doctor: {
              include: { profile: true },
            },
          },
        },
      },
    });

    const totalRevenue = payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const totalRefunds = payments
      .filter(p => p.status === 'REFUNDED')
      .reduce((sum, p) => sum + Number(p.refundAmount || 0), 0);

    const paymentMethodStats = this.calculatePaymentMethodStats(payments);

    return {
      title: 'التقرير المالي',
      period: `${startDate} - ${endDate}`,
      totalRevenue,
      totalRefunds,
      netRevenue: totalRevenue - totalRefunds,
      paymentMethodStats,
      payments: payments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        createdAt: payment.createdAt,
        clinicName: payment.appointment.clinic.name,
        doctorName: `${payment.appointment.doctor.profile.firstName} ${payment.appointment.doctor.profile.lastName}`,
      })),
    };
  }

  async generateDoctorPerformanceReport(parameters: any) {
    const { startDate, endDate, doctorId } = parameters;

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        user: {
          include: { profile: true },
        },
        clinic: true,
        department: true,
      },
    });

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    const consultations = await this.prisma.consultation.findMany({
      where: {
        appointment: {
          doctorId,
          appointmentDate: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      },
    });

    const ratings = await this.prisma.rating.findMany({
      where: {
        doctorId,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    const stats = {
      totalAppointments: appointments.length,
      completedAppointments: appointments.filter(a => a.status === 'COMPLETED').length,
      totalConsultations: consultations.length,
      completedConsultations: consultations.filter(c => c.status === 'COMPLETED').length,
      averageRating: ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0,
      totalRatings: ratings.length,
    };

    return {
      title: 'تقرير أداء الطبيب',
      period: `${startDate} - ${endDate}`,
      doctor: {
        name: `${doctor.user.profile.firstName} ${doctor.user.profile.lastName}`,
        specialization: doctor.specialization,
        clinic: doctor.clinic.name,
        department: doctor.department.name,
      },
      stats,
      ratings: ratings.map(rating => ({
        rating: rating.rating,
        review: rating.review,
        createdAt: rating.createdAt,
      })),
    };
  }

  private calculatePaymentMethodStats(payments: any[]) {
    const methodStats = {};
    payments
      .filter(p => p.status === 'COMPLETED')
      .forEach(payment => {
        const method = payment.paymentMethod;
        if (!methodStats[method]) {
          methodStats[method] = { count: 0, total: 0 };
        }
        methodStats[method].count++;
        methodStats[method].total += Number(payment.amount);
      });
    return methodStats;
  }

  private async uploadReportFile(reportId: number, buffer: Buffer): Promise<string> {
    // منطق رفع الملف إلى التخزين السحابي
    // يمكن استخدام AWS S3 أو Google Cloud Storage
    return `https://storage.example.com/reports/${reportId}.pdf`;
  }

  async getUserReports(userId: number) {
    return this.prisma.report.findMany({
      where: { generatedBy: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getReport(reportId: number) {
    return this.prisma.report.findUnique({
      where: { id: reportId },
    });
  }
}
```

### **الأسبوع الثالث: وحدة لوحة التحكم**

#### **3.1 خدمة لوحة التحكم**
```typescript
// src/modules/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private analyticsService: AnalyticsService,
  ) {}

  async getDashboardData(userId: number, userRole: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    switch (userRole) {
      case 'ADMIN':
        return this.getAdminDashboard(userId, startOfMonth, endOfMonth);
      case 'DOCTOR':
        return this.getDoctorDashboard(userId, startOfMonth, endOfMonth);
      case 'PATIENT':
        return this.getPatientDashboard(userId, startOfMonth, endOfMonth);
      default:
        throw new Error('دور المستخدم غير مدعوم');
    }
  }

  async getAdminDashboard(userId: number, startDate: Date, endDate: Date) {
    const [
      totalAppointments,
      totalRevenue,
      totalPatients,
      totalDoctors,
      recentAppointments,
      revenueChart,
      appointmentChart,
    ] = await Promise.all([
      this.getTotalAppointments(startDate, endDate),
      this.getTotalRevenue(startDate, endDate),
      this.getTotalPatients(),
      this.getTotalDoctors(),
      this.getRecentAppointments(10),
      this.getRevenueChart(startDate, endDate),
      this.getAppointmentChart(startDate, endDate),
    ]);

    return {
      summary: {
        totalAppointments,
        totalRevenue,
        totalPatients,
        totalDoctors,
      },
      charts: {
        revenue: revenueChart,
        appointments: appointmentChart,
      },
      recentAppointments,
    };
  }

  async getDoctorDashboard(userId: number, startDate: Date, endDate: Date) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      throw new Error('الطبيب غير موجود');
    }

    const [
      myStats,
      myAppointments,
      myConsultations,
      myRatings,
    ] = await Promise.all([
      this.analyticsService.getDoctorStats(doctor.id, startDate, endDate),
      this.getMyAppointments(doctor.id, 10),
      this.getMyConsultations(doctor.id, 10),
      this.getMyRatings(doctor.id, 10),
    ]);

    return {
      stats: myStats,
      recentAppointments: myAppointments,
      recentConsultations: myConsultations,
      recentRatings: myRatings,
    };
  }

  async getPatientDashboard(userId: number, startDate: Date, endDate: Date) {
    const [
      myStats,
      myAppointments,
      myConsultations,
      myPayments,
    ] = await Promise.all([
      this.analyticsService.getPatientStats(userId, startDate, endDate),
      this.getMyAppointments(userId, 10),
      this.getMyConsultations(userId, 10),
      this.getMyPayments(userId, 10),
    ]);

    return {
      stats: myStats,
      recentAppointments: myAppointments,
      recentConsultations: myConsultations,
      recentPayments: myPayments,
    };
  }

  private async getTotalAppointments(startDate: Date, endDate: Date) {
    return this.prisma.appointment.count({
      where: {
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  private async getTotalRevenue(startDate: Date, endDate: Date) {
    const payments = await this.prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: 'COMPLETED',
      },
    });

    return payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  }

  private async getTotalPatients() {
    return this.prisma.user.count({
      where: { role: 'PATIENT' },
    });
  }

  private async getTotalDoctors() {
    return this.prisma.doctor.count();
  }

  private async getRecentAppointments(limit: number) {
    return this.prisma.appointment.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
        clinic: true,
      },
    });
  }

  private async getRevenueChart(startDate: Date, endDate: Date) {
    const payments = await this.prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: 'COMPLETED',
      },
    });

    const dailyRevenue = {};
    payments.forEach(payment => {
      const date = payment.createdAt.toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + Number(payment.amount);
    });

    return Object.entries(dailyRevenue).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  }

  private async getAppointmentChart(startDate: Date, endDate: Date) {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const dailyAppointments = {};
    appointments.forEach(appointment => {
      const date = appointment.appointmentDate.toISOString().split('T')[0];
      dailyAppointments[date] = (dailyAppointments[date] || 0) + 1;
    });

    return Object.entries(dailyAppointments).map(([date, count]) => ({
      date,
      count,
    }));
  }

  private async getMyAppointments(doctorId: number, limit: number) {
    return this.prisma.appointment.findMany({
      where: { doctorId },
      take: limit,
      orderBy: { appointmentDate: 'desc' },
      include: {
        patient: {
          include: { profile: true },
        },
        clinic: true,
        department: true,
      },
    });
  }

  private async getMyConsultations(doctorId: number, limit: number) {
    return this.prisma.consultation.findMany({
      where: {
        appointment: { doctorId },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        appointment: {
          include: {
            patient: {
              include: { profile: true },
            },
          },
        },
      },
    });
  }

  private async getMyRatings(doctorId: number, limit: number) {
    return this.prisma.rating.findMany({
      where: { doctorId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: {
          include: { profile: true },
        },
        appointment: true,
      },
    });
  }

  private async getMyPayments(patientId: number, limit: number) {
    return this.prisma.payment.findMany({
      where: {
        appointment: { patientId },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        appointment: {
          include: {
            doctor: {
              include: { profile: true },
            },
            clinic: true,
          },
        },
      },
    });
  }
}
```

### **الأسبوع الرابع: اختبارات وتحسينات**

#### **4.1 اختبارات التحليلات**
```typescript
// test/unit/analytics.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from '../../src/modules/analytics/analytics.service';
import { PrismaService } from '../../src/database/prisma.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: PrismaService,
          useValue: {
            appointment: {
              findMany: jest.fn(),
            },
            consultation: {
              findMany: jest.fn(),
            },
            rating: {
              findMany: jest.fn(),
            },
            analyticsCache: {
              findUnique: jest.fn(),
              upsert: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get doctor stats', async () => {
    const mockAppointments = [
      { id: 1, status: 'COMPLETED' },
      { id: 2, status: 'CANCELLED' },
    ];
    const mockConsultations = [
      { id: 1, status: 'COMPLETED', duration: 30 },
    ];
    const mockRatings = [
      { id: 1, rating: 5 },
      { id: 2, rating: 4 },
    ];

    jest.spyOn(prismaService.appointment, 'findMany').mockResolvedValue(mockAppointments);
    jest.spyOn(prismaService.consultation, 'findMany').mockResolvedValue(mockConsultations);
    jest.spyOn(prismaService.rating, 'findMany').mockResolvedValue(mockRatings);
    jest.spyOn(prismaService.analyticsCache, 'findUnique').mockResolvedValue(null);

    const result = await service.getDoctorStats(1, new Date(), new Date());
    
    expect(result.totalAppointments).toBe(2);
    expect(result.completedAppointments).toBe(1);
    expect(result.averageRating).toBe(4.5);
  });
});
```

#### **4.2 اختبارات التقارير**
```typescript
// test/unit/reports.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from '../../src/modules/reports/reports.service';
import { PrismaService } from '../../src/database/prisma.service';
import { PDFService } from '../../src/modules/export/pdf.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let prismaService: PrismaService;
  let pdfService: PDFService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: {
            report: {
              create: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
            appointment: {
              findMany: jest.fn(),
            },
            payment: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: PDFService,
          useValue: {
            generatePDF: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    prismaService = module.get<PrismaService>(PrismaService);
    pdfService = module.get<PDFService>(PDFService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a report', async () => {
    const reportRequest = {
      name: 'Test Report',
      type: 'APPOINTMENT',
      parameters: {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      },
    };

    const expectedResult = { id: 1, ...reportRequest, status: 'PENDING' };
    jest.spyOn(prismaService.report, 'create').mockResolvedValue(expectedResult);

    const result = await service.generateReport(reportRequest, 1);
    expect(result).toEqual(expectedResult);
  });
});
```

---

## 🔧 إعدادات البيئة

### **متغيرات البيئة الإضافية**
```env
# Analytics
ANALYTICS_CACHE_TTL=3600  # 1 hour in seconds
ANALYTICS_BATCH_SIZE=1000

# Reports
REPORTS_STORAGE_PATH=/tmp/reports
REPORTS_RETENTION_DAYS=30

# Dashboard
DASHBOARD_CACHE_TTL=1800  # 30 minutes in seconds
DASHBOARD_MAX_WIDGETS=20

# Export
PDF_GENERATION_TIMEOUT=30000  # 30 seconds
EXPORT_MAX_FILE_SIZE=10485760  # 10MB
```

---

## 📊 مؤشرات النجاح

### **المخرجات المطلوبة:**
1. ✅ نظام تحليلات متكامل يعمل
2. ✅ تقارير PDF تولد بنجاح
3. ✅ لوحة تحكم تفاعلية تعمل
4. ✅ تصدير البيانات يعمل
5. ✅ المهام المجدولة تعمل
6. ✅ اختبارات شاملة تعمل

### **الاختبارات المطلوبة:**
- [ ] تحليلات الأطباء
- [ ] تحليلات العيادات
- [ ] تحليلات المرضى
- [ ] تقارير المواعيد
- [ ] التقارير المالية
- [ ] لوحة التحكم

---

## 🚀 الخطوات التالية

بعد إكمال المرحلة الخامسة، ستكون جاهزاً للانتقال إلى:
- **المرحلة السادسة:** النشر والإنتاج

---

*هذه المرحلة تضيف القيمة التحليلية للنظام مع التقارير والتحليلات المتقدمة*
