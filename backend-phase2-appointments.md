# 📅 المرحلة الثانية: نظام المواعيد - نظام إدارة العيادات

## 📋 نظرة عامة على المرحلة الثانية

هذه المرحلة تركز على تطوير نظام إدارة المواعيد الشامل مع دعم قائمة الانتظار والجدولة الذكية.

**المدة المقدرة:** 4 أسابيع  
**الهدف:** تطوير نظام مواعيد متكامل مع قائمة انتظار ذكية

---

## 🛠️ التقنيات المطلوبة

### **Core Framework:**
- **NestJS** - إطار عمل Node.js متقدم
- **TypeScript** - لغة البرمجة
- **Node.js** - بيئة التشغيل

### **Database:**
- **PostgreSQL** - قاعدة البيانات الرئيسية
- **Prisma** - ORM لإدارة قاعدة البيانات
- **Redis** - تخزين مؤقت للأوقات المتاحة

### **Real-time Communication:**
- **Socket.io** - الاتصال المباشر للإشعارات
- **WebSockets** - الاتصال المباشر

### **External Services:**
- **SendGrid** - إرسال الإيميلات
- **Twilio** - إرسال الرسائل النصية

---

## 🏗️ هيكل المشروع للمرحلة الثانية

```
backend/
├── src/
│   ├── modules/
│   │   ├── appointments/       # وحدة المواعيد
│   │   │   ├── appointments.controller.ts
│   │   │   ├── appointments.service.ts
│   │   │   ├── appointments.module.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-appointment.dto.ts
│   │   │   │   ├── update-appointment.dto.ts
│   │   │   │   └── appointment-query.dto.ts
│   │   │   └── entities/
│   │   │       └── appointment.entity.ts
│   │   ├── doctors/            # وحدة الأطباء
│   │   │   ├── doctors.controller.ts
│   │   │   ├── doctors.service.ts
│   │   │   ├── doctors.module.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   ├── clinics/           # وحدة العيادات
│   │   │   ├── clinics.controller.ts
│   │   │   ├── clinics.service.ts
│   │   │   ├── clinics.module.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   ├── departments/        # وحدة الأقسام
│   │   │   ├── departments.controller.ts
│   │   │   ├── departments.service.ts
│   │   │   ├── departments.module.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   └── waiting-list/      # وحدة قائمة الانتظار
│   │       ├── waiting-list.controller.ts
│   │       ├── waiting-list.service.ts
│   │       ├── waiting-list.module.ts
│   │       ├── dto/
│   │       └── entities/
│   ├── common/
│   │   ├── schedulers/         # المهام المجدولة
│   │   │   ├── appointment-reminder.scheduler.ts
│   │   │   └── waiting-list.scheduler.ts
│   │   └── utils/
│   │       ├── date.util.ts
│   │       └── notification.util.ts
│   └── config/
│       ├── redis.config.ts
│       └── email.config.ts
```

---

## 🗄️ قاعدة البيانات - المرحلة الثانية

### **إضافة الجداول الجديدة**

```prisma
// جدول العيادات
model Clinic {
  id          Int      @id @default(autoincrement())
  name        String
  address     String
  phone       String
  email       String
  workingHours Json
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // العلاقات
  departments   Department[]
  appointments  Appointment[]
  doctors       Doctor[]

  @@map("clinics")
}

// جدول الأقسام
model Department {
  id          Int      @id @default(autoincrement())
  clinicId    Int
  name        String
  description String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // العلاقات
  clinic       Clinic    @relation(fields: [clinicId], references: [id])
  doctors      Doctor[]
  appointments Appointment[]

  @@map("departments")
}

// جدول الأطباء
model Doctor {
  id           Int      @id @default(autoincrement())
  userId       Int      @unique
  clinicId     Int
  departmentId Int
  specialization String
  licenseNumber String
  experience   Int
  consultationFee Decimal @db.Decimal(10, 2)
  isAvailable  Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // العلاقات
  user         User         @relation(fields: [userId], references: [id])
  clinic       Clinic       @relation(fields: [clinicId], references: [id])
  department   Department   @relation(fields: [departmentId], references: [id])
  appointments Appointment[]
  schedules    Schedule[]
  ratings      Rating[]

  @@map("doctors")
}

// جدول المواعيد
model Appointment {
  id            Int            @id @default(autoincrement())
  patientId     Int
  doctorId      Int
  clinicId      Int
  departmentId  Int
  appointmentDate DateTime
  appointmentTime DateTime
  status        AppointmentStatus @default(SCHEDULED)
  reason        String?
  notes         String?
  isEmergency   Boolean        @default(false)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  // العلاقات
  patient       User           @relation("PatientAppointments", fields: [patientId], references: [id])
  doctor        User           @relation("DoctorAppointments", fields: [doctorId], references: [id])
  clinic        Clinic         @relation(fields: [clinicId], references: [id])
  department    Department     @relation(fields: [departmentId], references: [id])

  @@map("appointments")
}

// جدول قائمة الانتظار
model WaitingList {
  id           Int      @id @default(autoincrement())
  patientId    Int
  doctorId     Int
  departmentId Int
  priority     Int      @default(1)
  notified     Boolean  @default(false)
  createdAt    DateTime @default(now())

  // العلاقات
  patient    User       @relation(fields: [patientId], references: [id])
  doctor     User       @relation(fields: [doctorId], references: [id])
  department Department @relation(fields: [departmentId], references: [id])

  @@map("waiting_list")
}

// جدول الجداول الزمنية
model Schedule {
  id        Int      @id @default(autoincrement())
  doctorId  Int
  dayOfWeek Int      // 0-6 (الأحد-السبت)
  startTime DateTime
  endTime   DateTime
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  // العلاقات
  doctor Doctor @relation(fields: [doctorId], references: [id])

  @@map("schedules")
}

// Enums
enum AppointmentStatus {
  SCHEDULED
  CONFIRMED
  CANCELLED
  COMPLETED
  NO_SHOW
}
```

---

## 🚀 خطوات التنفيذ

### **الأسبوع الأول: وحدة الأطباء والعيادات**

#### **1.1 وحدة الأطباء**
```typescript
// src/modules/doctors/doctors.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async create(createDoctorDto: CreateDoctorDto) {
    return this.prisma.doctor.create({
      data: createDoctorDto,
      include: {
        user: {
          include: { profile: true },
        },
        clinic: true,
        department: true,
        schedules: true,
      },
    });
  }

  async findAll(query: any) {
    const { clinicId, departmentId, specialization, isAvailable } = query;
    
    return this.prisma.doctor.findMany({
      where: {
        ...(clinicId && { clinicId: parseInt(clinicId) }),
        ...(departmentId && { departmentId: parseInt(departmentId) }),
        ...(specialization && { specialization: { contains: specialization } }),
        ...(isAvailable !== undefined && { isAvailable: isAvailable === 'true' }),
      },
      include: {
        user: {
          include: { profile: true },
        },
        clinic: true,
        department: true,
        schedules: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          include: { profile: true },
        },
        clinic: true,
        department: true,
        schedules: true,
        appointments: {
          include: {
            patient: {
              include: { profile: true },
            },
          },
        },
      },
    });
  }

  async update(id: number, updateDoctorDto: any) {
    return this.prisma.doctor.update({
      where: { id },
      data: updateDoctorDto,
      include: {
        user: {
          include: { profile: true },
        },
        clinic: true,
        department: true,
        schedules: true,
      },
    });
  }

  async setAvailability(id: number, isAvailable: boolean) {
    return this.prisma.doctor.update({
      where: { id },
      data: { isAvailable },
    });
  }
}
```

#### **1.2 وحدة العيادات**
```typescript
// src/modules/clinics/clinics.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateClinicDto } from './dto/create-clinic.dto';

@Injectable()
export class ClinicsService {
  constructor(private prisma: PrismaService) {}

  async create(createClinicDto: CreateClinicDto) {
    return this.prisma.clinic.create({
      data: createClinicDto,
      include: {
        departments: true,
        doctors: {
          include: {
            user: {
              include: { profile: true },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.clinic.findMany({
      include: {
        departments: true,
        doctors: {
          include: {
            user: {
              include: { profile: true },
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.clinic.findUnique({
      where: { id },
      include: {
        departments: true,
        doctors: {
          include: {
            user: {
              include: { profile: true },
            },
            schedules: true,
          },
        },
        appointments: {
          include: {
            patient: {
              include: { profile: true },
            },
            doctor: {
              include: { profile: true },
            },
          },
        },
      },
    });
  }

  async update(id: number, updateClinicDto: any) {
    return this.prisma.clinic.update({
      where: { id },
      data: updateClinicDto,
      include: {
        departments: true,
        doctors: {
          include: {
            user: {
              include: { profile: true },
            },
          },
        },
      },
    });
  }
}
```

### **الأسبوع الثاني: وحدة المواعيد**

#### **2.1 وحدة المواعيد الأساسية**
```typescript
// src/modules/appointments/appointments.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    // التحقق من توفر الموعد
    const isAvailable = await this.checkAvailability(
      createAppointmentDto.doctorId,
      createAppointmentDto.appointmentDate,
      createAppointmentDto.appointmentTime,
    );

    if (!isAvailable) {
      throw new Error('الموعد غير متاح');
    }

    return this.prisma.appointment.create({
      data: createAppointmentDto,
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
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, status, doctorId, patientId, clinicId } = query;
    
    return this.prisma.appointment.findMany({
      where: {
        ...(status && { status }),
        ...(doctorId && { doctorId: parseInt(doctorId) }),
        ...(patientId && { patientId: parseInt(patientId) }),
        ...(clinicId && { clinicId: parseInt(clinicId) }),
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
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { appointmentDate: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.appointment.findUnique({
      where: { id },
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
  }

  async update(id: number, updateAppointmentDto: any) {
    return this.prisma.appointment.update({
      where: { id },
      data: updateAppointmentDto,
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
  }

  async cancel(id: number, reason?: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        notes: reason,
      },
    });
  }

  async confirm(id: number) {
    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
      },
    });
  }

  async complete(id: number) {
    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: 'COMPLETED',
      },
    });
  }
}
```

#### **2.2 فحص توفر المواعيد**
```typescript
// src/modules/appointments/appointments.service.ts (استكمال)

async checkAvailability(doctorId: number, date: Date, time: Date) {
  const existingAppointment = await this.prisma.appointment.findFirst({
    where: {
      doctorId,
      appointmentDate: date,
      appointmentTime: time,
      status: {
        in: ['SCHEDULED', 'CONFIRMED'],
      },
    },
  });

  return !existingAppointment;
}

async getAvailableSlots(doctorId: number, date: Date) {
  // الحصول على جدول الطبيب
  const doctor = await this.prisma.doctor.findUnique({
    where: { id: doctorId },
    include: { schedules: true },
  });

  if (!doctor) {
    throw new Error('الطبيب غير موجود');
  }

  const dayOfWeek = date.getDay();
  const schedule = doctor.schedules.find(s => s.dayOfWeek === dayOfWeek);

  if (!schedule) {
    return [];
  }

  // الحصول على المواعيد المحجوزة
  const bookedAppointments = await this.prisma.appointment.findMany({
    where: {
      doctorId,
      appointmentDate: date,
      status: {
        in: ['SCHEDULED', 'CONFIRMED'],
      },
    },
  });

  // إنشاء قائمة الأوقات المتاحة
  const availableSlots = [];
  const startTime = new Date(date);
  startTime.setHours(schedule.startTime.getHours(), schedule.startTime.getMinutes());
  
  const endTime = new Date(date);
  endTime.setHours(schedule.endTime.getHours(), schedule.endTime.getMinutes());

  const slotDuration = 30; // 30 دقيقة لكل موعد

  while (startTime < endTime) {
    const slotTime = new Date(startTime);
    const isBooked = bookedAppointments.some(appointment => 
      appointment.appointmentTime.getTime() === slotTime.getTime()
    );

    if (!isBooked) {
      availableSlots.push(new Date(slotTime));
    }

    startTime.setMinutes(startTime.getMinutes() + slotDuration);
  }

  return availableSlots;
}
```

### **الأسبوع الثالث: قائمة الانتظار**

#### **3.1 وحدة قائمة الانتظار**
```typescript
// src/modules/waiting-list/waiting-list.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class WaitingListService {
  constructor(private prisma: PrismaService) {}

  async addToWaitingList(patientId: number, doctorId: number, departmentId: number) {
    // التحقق من وجود المريض في قائمة الانتظار
    const existingEntry = await this.prisma.waitingList.findFirst({
      where: {
        patientId,
        doctorId,
      },
    });

    if (existingEntry) {
      throw new Error('المريض موجود بالفعل في قائمة الانتظار');
    }

    return this.prisma.waitingList.create({
      data: {
        patientId,
        doctorId,
        departmentId,
        priority: 1,
      },
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
        department: true,
      },
    });
  }

  async getWaitingList(doctorId?: number) {
    return this.prisma.waitingList.findMany({
      where: doctorId ? { doctorId } : {},
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
        department: true,
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async notifyNextInLine(doctorId: number, availableDate: Date, availableTime: Date) {
    const nextInLine = await this.prisma.waitingList.findFirst({
      where: {
        doctorId,
        notified: false,
      },
      include: {
        patient: {
          include: { profile: true },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
    });

    if (nextInLine) {
      // إرسال إشعار للمريض
      await this.sendNotification(nextInLine.patientId, {
        title: 'موعد متاح',
        message: `موعد متاح مع الطبيب في ${availableDate.toLocaleDateString()} الساعة ${availableTime.toLocaleTimeString()}`,
        type: 'APPOINTMENT',
      });

      // تحديث حالة الإشعار
      await this.prisma.waitingList.update({
        where: { id: nextInLine.id },
        data: { notified: true },
      });
    }

    return nextInLine;
  }

  async removeFromWaitingList(id: number) {
    return this.prisma.waitingList.delete({
      where: { id },
    });
  }

  async updatePriority(id: number, priority: number) {
    return this.prisma.waitingList.update({
      where: { id },
      data: { priority },
    });
  }

  private async sendNotification(userId: number, notification: any) {
    // منطق إرسال الإشعارات
    // سيتم تطويره في المرحلة الرابعة
  }
}
```

#### **3.2 إدارة الجداول الزمنية**
```typescript
// src/modules/doctors/schedules.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async createSchedule(doctorId: number, scheduleData: any) {
    return this.prisma.schedule.create({
      data: {
        doctorId,
        ...scheduleData,
      },
    });
  }

  async getDoctorSchedule(doctorId: number) {
    return this.prisma.schedule.findMany({
      where: {
        doctorId,
        isActive: true,
      },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async updateSchedule(scheduleId: number, updateData: any) {
    return this.prisma.schedule.update({
      where: { id: scheduleId },
      data: updateData,
    });
  }

  async deleteSchedule(scheduleId: number) {
    return this.prisma.schedule.delete({
      where: { id: scheduleId },
    });
  }

  async getAvailableDoctors(date: Date, departmentId?: number) {
    const dayOfWeek = date.getDay();
    
    return this.prisma.doctor.findMany({
      where: {
        isAvailable: true,
        ...(departmentId && { departmentId }),
        schedules: {
          some: {
            dayOfWeek,
            isActive: true,
          },
        },
      },
      include: {
        user: {
          include: { profile: true },
        },
        department: true,
        schedules: {
          where: {
            dayOfWeek,
            isActive: true,
          },
        },
      },
    });
  }
}
```

### **الأسبوع الرابع: الاختبارات والتحسينات**

#### **4.1 اختبارات المواعيد**
```typescript
// test/unit/appointments.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from '../../src/modules/appointments/appointments.service';
import { PrismaService } from '../../src/database/prisma.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: PrismaService,
          useValue: {
            appointment: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an appointment', async () => {
    const createAppointmentDto = {
      patientId: 1,
      doctorId: 2,
      clinicId: 1,
      departmentId: 1,
      appointmentDate: new Date(),
      appointmentTime: new Date(),
    };

    const expectedResult = { id: 1, ...createAppointmentDto };
    jest.spyOn(prismaService.appointment, 'create').mockResolvedValue(expectedResult);
    jest.spyOn(service, 'checkAvailability').mockResolvedValue(true);

    const result = await service.create(createAppointmentDto);
    expect(result).toEqual(expectedResult);
  });

  it('should check availability correctly', async () => {
    jest.spyOn(prismaService.appointment, 'findFirst').mockResolvedValue(null);
    
    const result = await service.checkAvailability(1, new Date(), new Date());
    expect(result).toBe(true);
  });
});
```

#### **4.2 اختبارات التكامل**
```typescript
// test/integration/appointments.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Appointments (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/appointments (POST)', () => {
    return request(app.getHttpServer())
      .post('/appointments')
      .send({
        patientId: 1,
        doctorId: 2,
        clinicId: 1,
        departmentId: 1,
        appointmentDate: '2024-01-15',
        appointmentTime: '10:00:00',
      })
      .expect(201);
  });

  it('/appointments (GET)', () => {
    return request(app.getHttpServer())
      .get('/appointments')
      .expect(200);
  });

  it('/appointments/:id/cancel (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/appointments/1/cancel')
      .send({ reason: 'Patient request' })
      .expect(200);
  });
});
```

---

## 🔧 إعدادات البيئة

### **متغيرات البيئة الإضافية**
```env
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# SMS
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

---

## 📊 مؤشرات النجاح

### **المخرجات المطلوبة:**
1. ✅ نظام مواعيد متكامل يعمل
2. ✅ قائمة انتظار ذكية تعمل
3. ✅ فحص توفر المواعيد يعمل
4. ✅ إدارة الجداول الزمنية تعمل
5. ✅ إشعارات المواعيد تعمل
6. ✅ اختبارات شاملة تعمل

### **الاختبارات المطلوبة:**
- [ ] حجز موعد جديد
- [ ] إلغاء موعد
- [ ] تأكيد موعد
- [ ] إضافة لقائمة الانتظار
- [ ] إشعارات المواعيد
- [ ] فحص الأوقات المتاحة

---

## 🚀 الخطوات التالية

بعد إكمال المرحلة الثانية، ستكون جاهزاً للانتقال إلى:
- **المرحلة الثالثة:** الاستشارات الافتراضية
- **المرحلة الرابعة:** المدفوعات والإشعارات
- **المرحلة الخامسة:** التحليلات والتقارير

---

*هذه المرحلة تشكل العمود الفقري للنظام وتضمن إدارة فعالة للمواعيد*
