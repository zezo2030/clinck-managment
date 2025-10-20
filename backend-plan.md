# 🛠️ خطة تطوير الباك إند - نظام إدارة العيادات

## 📋 نظرة عامة على الباك إند

نظام API شامل مبني على **NestJS** مع **TypeScript** و **PostgreSQL** لإدارة جميع عمليات العيادة من المواعيد والاستشارات إلى المدفوعات والتحليلات.

---

## 🏗️ هيكل الباك إند

```
backend/
├── src/
│   ├── modules/                 # وحدات NestJS
│   │   ├── auth/               # وحدة المصادقة
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── strategies/      # استراتيجيات المصادقة
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   └── guards/          # حمايات المصادقة
│   │   │       ├── jwt-auth.guard.ts
│   │   │       └── roles.guard.ts
│   │   ├── users/              # وحدة المستخدمين
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── update-user.dto.ts
│   │   │   └── entities/       # كيانات قاعدة البيانات
│   │   │       └── user.entity.ts
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
│   │   ├── payments/          # وحدة المدفوعات
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   ├── payments.module.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   ├── notifications/     # وحدة الإشعارات
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── notifications.module.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   ├── consultations/     # وحدة الاستشارات
│   │   │   ├── consultations.controller.ts
│   │   │   ├── consultations.service.ts
│   │   │   ├── consultations.module.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   ├── analytics/         # وحدة التحليلات
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── analytics.module.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   └── waiting-list/      # وحدة قائمة الانتظار
│   │       ├── waiting-list.controller.ts
│   │       ├── waiting-list.service.ts
│   │       ├── waiting-list.module.ts
│   │       ├── dto/
│   │       └── entities/
│   ├── common/                # مكونات مشتركة
│   │   ├── decorators/        # ديكورات مخصصة
│   │   │   ├── roles.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── filters/           # مرشحات الأخطاء
│   │   │   ├── http-exception.filter.ts
│   │   │   └── validation-exception.filter.ts
│   │   ├── interceptors/      # المعترضات
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── pipes/             # الأنابيب
│   │   │   ├── validation.pipe.ts
│   │   │   └── parse-int.pipe.ts
│   │   ├── guards/            # الحمايات العامة
│   │   │   ├── auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   └── utils/             # أدوات مساعدة
│   │       ├── validation.util.ts
│   │       ├── date.util.ts
│   │       └── encryption.util.ts
│   ├── config/                # إعدادات النظام
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── redis.config.ts
│   │   ├── firebase.config.ts
│   │   └── app.config.ts
│   ├── database/              # إعدادات قاعدة البيانات
│   │   ├── migrations/        # ترحيل البيانات
│   │   ├── seeds/            # بيانات تجريبية
│   │   └── prisma/           # ملفات Prisma
│   │       ├── schema.prisma
│   │       └── client.ts
│   └── main.ts               # نقطة البداية
├── test/                     # ملفات الاختبار
│   ├── unit/                # اختبارات الوحدة
│   ├── integration/         # اختبارات التكامل
│   └── e2e/                 # اختبارات النهاية
├── docs/                    # التوثيق
│   ├── api/                 # توثيق API
│   └── database/            # توثيق قاعدة البيانات
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .env                     # متغيرات البيئة
```

---

## 🛠️ التقنيات المستخدمة

### **Core Framework:**
- **NestJS** - إطار عمل Node.js متقدم
- **TypeScript** - لغة البرمجة
- **Node.js** - بيئة التشغيل

### **Database:**
- **PostgreSQL** - قاعدة البيانات الرئيسية
- **Prisma** - ORM لإدارة قاعدة البيانات
- **Redis** - تخزين مؤقت وسريع

### **Authentication & Security:**
- **JWT** - نظام المصادقة
- **Bcrypt** - تشفير كلمات المرور
- **Passport** - استراتيجيات المصادقة
- **Helmet** - أمان HTTP

### **Real-time Communication:**
- **Socket.io** - الاتصال المباشر
- **WebSockets** - الاتصال المباشر

### **External Services:**
- **Firebase Admin SDK** - الإشعارات
- **Agora SDK** - مكالمات الفيديو
- **Stripe** - معالجة المدفوعات
- **SendGrid** - إرسال الإيميلات

### **Development Tools:**
- **Swagger** - توثيق API
- **Jest** - الاختبارات
- **ESLint** - فحص الكود
- **Prettier** - تنسيق الكود

---

## 🗄️ قاعدة البيانات - Prisma Schema

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// جدول المستخدمين
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  role      Role     @default(PATIENT)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // العلاقات
  profile        Profile?
  appointments   Appointment[] @relation("PatientAppointments")
  doctorAppointments Appointment[] @relation("DoctorAppointments")
  consultations  Consultation[]
  messages       Message[]
  ratings        Rating[]
  waitingList    WaitingList[]
  payments       Payment[]

  @@map("users")
}

// جدول الملفات الشخصية
model Profile {
  id          Int      @id @default(autoincrement())
  userId      Int      @unique
  firstName   String
  lastName    String
  phone       String?
  dateOfBirth DateTime?
  gender      Gender?
  address     String?
  avatar      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // العلاقات
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

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
  consultation  Consultation?
  payment       Payment?

  @@map("appointments")
}

// جدول الاستشارات
model Consultation {
  id            Int              @id @default(autoincrement())
  appointmentId Int              @unique
  type          ConsultationType
  status        ConsultationStatus @default(SCHEDULED)
  startTime     DateTime?
  endTime       DateTime?
  duration      Int?             // بالدقائق
  notes         String?
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  // العلاقات
  appointment Appointment @relation(fields: [appointmentId], references: [id])
  messages    Message[]

  @@map("consultations")
}

// جدول الرسائل
model Message {
  id             Int      @id @default(autoincrement())
  consultationId Int
  senderId       Int
  message        String
  messageType    MessageType @default(TEXT)
  fileUrl        String?
  createdAt      DateTime @default(now())

  // العلاقات
  consultation Consultation @relation(fields: [consultationId], references: [id])
  sender       User         @relation(fields: [senderId], references: [id])

  @@map("messages")
}

// جدول المدفوعات
model Payment {
  id            Int         @id @default(autoincrement())
  appointmentId Int         @unique
  amount        Decimal     @db.Decimal(10, 2)
  currency      String      @default("USD")
  paymentMethod PaymentMethod
  status        PaymentStatus @default(PENDING)
  transactionId String?
  refundAmount  Decimal?    @db.Decimal(10, 2)
  refundReason  String?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  // العلاقات
  appointment Appointment @relation(fields: [appointmentId], references: [id])

  @@map("payments")
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

// جدول التقييمات
model Rating {
  id          Int      @id @default(autoincrement())
  appointmentId Int    @unique
  patientId   Int
  doctorId    Int
  rating      Int      // 1-5
  review      String?
  createdAt   DateTime @default(now())

  // العلاقات
  appointment Appointment @relation(fields: [appointmentId], references: [id])
  patient     User       @relation(fields: [patientId], references: [id])
  doctor      Doctor     @relation(fields: [doctorId], references: [id])

  @@map("ratings")
}

// جدول الإشعارات
model Notification {
  id        Int      @id @default(autoincrement())
  userId    Int
  title     String
  message   String
  type      NotificationType
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  // العلاقات
  user User @relation(fields: [userId], references: [id])

  @@map("notifications")
}

// Enums
enum Role {
  PATIENT
  DOCTOR
  ADMIN
}

enum Gender {
  MALE
  FEMALE
}

enum AppointmentStatus {
  SCHEDULED
  CONFIRMED
  CANCELLED
  COMPLETED
  NO_SHOW
}

enum ConsultationType {
  VIDEO
  CHAT
}

enum ConsultationStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum MessageType {
  TEXT
  IMAGE
  FILE
}

enum PaymentMethod {
  CARD
  PAYPAL
  CASH
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum NotificationType {
  APPOINTMENT
  PAYMENT
  MESSAGE
  SYSTEM
}
```

---

## 🚀 مراحل تطوير الباك إند

## **المرحلة الأولى: الأساسيات (أسابيع 1-4)**

### **1.1 إعداد البيئة**
```bash
# إنشاء مشروع NestJS
nest new clinic-backend
cd clinic-backend

# تثبيت الحزم المطلوبة
npm install @nestjs/typeorm @nestjs/jwt @nestjs/passport
npm install @nestjs/websockets @nestjs/platform-socket.io
npm install prisma @prisma/client
npm install bcryptjs @types/bcryptjs
npm install passport passport-jwt passport-local
npm install socket.io
npm install class-validator class-transformer
npm install @nestjs/swagger swagger-ui-express
npm install redis ioredis
npm install firebase-admin
npm install stripe
npm install @nestjs/config
npm install multer @types/multer
npm install nodemailer @types/nodemailer

# تثبيت حزم التطوير
npm install -D @types/node @types/jest
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

### **1.2 إعداد قاعدة البيانات**
```typescript
// src/config/database.config.ts
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (configService: ConfigService) => ({
  type: 'postgresql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
});
```

### **1.3 وحدة المصادقة**
```typescript
// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }
}
```

### **1.4 وحدة المستخدمين**
```typescript
// src/modules/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
      include: {
        profile: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        profile: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        profile: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
```

---

## **المرحلة الثانية: نظام المواعيد (أسابيع 5-8)**

### **2.1 وحدة المواعيد**
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
    const { page = 1, limit = 10, status, doctorId, patientId } = query;
    
    return this.prisma.appointment.findMany({
      where: {
        ...(status && { status }),
        ...(doctorId && { doctorId }),
        ...(patientId && { patientId }),
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
      take: limit,
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
        consultation: true,
        payment: true,
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
    // منطق الحصول على الأوقات المتاحة
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
}
```

### **2.2 وحدة قائمة الانتظار**
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
}
```

---

## **المرحلة الثالثة: الاستشارات الافتراضية (أسابيع 9-12)**

### **3.1 وحدة الاستشارات**
```typescript
// src/modules/consultations/consultations.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';

@Injectable()
export class ConsultationsService {
  constructor(private prisma: PrismaService) {}

  async create(createConsultationDto: CreateConsultationDto) {
    return this.prisma.consultation.create({
      data: createConsultationDto,
      include: {
        appointment: {
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

  async startConsultation(consultationId: number) {
    return this.prisma.consultation.update({
      where: { id: consultationId },
      data: {
        status: 'IN_PROGRESS',
        startTime: new Date(),
      },
    });
  }

  async endConsultation(consultationId: number, notes?: string) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation) {
      throw new Error('الاستشارة غير موجودة');
    }

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - consultation.startTime.getTime()) / (1000 * 60));

    return this.prisma.consultation.update({
      where: { id: consultationId },
      data: {
        status: 'COMPLETED',
        endTime,
        duration,
        notes,
      },
    });
  }

  async getConsultationMessages(consultationId: number) {
    return this.prisma.message.findMany({
      where: { consultationId },
      include: {
        sender: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(consultationId: number, senderId: number, message: string, messageType: string = 'TEXT') {
    return this.prisma.message.create({
      data: {
        consultationId,
        senderId,
        message,
        messageType,
      },
      include: {
        sender: {
          include: { profile: true },
        },
      },
    });
  }
}
```

### **3.2 تكامل Agora للفيديو**
```typescript
// src/modules/consultations/agora.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AgoraService {
  constructor(private configService: ConfigService) {}

  async generateToken(channelName: string, uid: number, role: string = 'publisher') {
    const appId = this.configService.get('AGORA_APP_ID');
    const appCertificate = this.configService.get('AGORA_APP_CERTIFICATE');
    
    // إنشاء Agora token
    const token = this.createToken(appId, appCertificate, channelName, uid, role);
    
    return {
      appId,
      channel: channelName,
      token,
      uid,
    };
  }

  private createToken(appId: string, appCertificate: string, channelName: string, uid: number, role: string) {
    // منطق إنشاء Agora token
    // هذا يتطلب تثبيت Agora SDK
    return 'generated_token';
  }
}
```

---

## **المرحلة الرابعة: المدفوعات والإشعارات (أسابيع 13-16)**

### **4.1 وحدة المدفوعات**
```typescript
// src/modules/payments/payments.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async createPayment(appointmentId: number, amount: number, paymentMethod: string) {
    // إنشاء payment intent في Stripe
    const paymentIntent = await this.stripeService.createPaymentIntent(amount, paymentMethod);

    return this.prisma.payment.create({
      data: {
        appointmentId,
        amount,
        paymentMethod,
        transactionId: paymentIntent.id,
        status: 'PENDING',
      },
    });
  }

  async confirmPayment(paymentId: number) {
    return this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'COMPLETED',
      },
    });
  }

  async refundPayment(paymentId: number, amount?: number, reason?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('الدفعة غير موجودة');
    }

    const refundAmount = amount || payment.amount;

    // معالجة الاسترداد في Stripe
    await this.stripeService.createRefund(payment.transactionId, refundAmount);

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'REFUNDED',
        refundAmount,
        refundReason: reason,
      },
    });
  }
}
```

### **4.2 وحدة الإشعارات**
```typescript
// src/modules/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { FirebaseService } from './firebase.service';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private firebaseService: FirebaseService,
  ) {}

  async sendNotification(userId: number, notification: any) {
    // حفظ الإشعار في قاعدة البيانات
    const savedNotification = await this.prisma.notification.create({
      data: {
        userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
      },
    });

    // إرسال إشعار Firebase
    await this.firebaseService.sendNotification(userId, notification);

    return savedNotification;
  }

  async sendAppointmentReminder(appointmentId: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
      },
    });

    if (!appointment) {
      throw new Error('الموعد غير موجود');
    }

    const notification = {
      title: 'تذكير بالموعد',
      message: `موعدك مع د. ${appointment.doctor.profile.firstName} في ${appointment.appointmentDate.toLocaleDateString()} الساعة ${appointment.appointmentTime.toLocaleTimeString()}`,
      type: 'APPOINTMENT',
    };

    return this.sendNotification(appointment.patientId, notification);
  }

  async sendPaymentConfirmation(paymentId: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
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

    if (!payment) {
      throw new Error('الدفعة غير موجودة');
    }

    const notification = {
      title: 'تأكيد الدفع',
      message: `تم تأكيد دفع مبلغ ${payment.amount} دولار بنجاح`,
      type: 'PAYMENT',
    };

    return this.sendNotification(payment.appointment.patientId, notification);
  }
}
```

---

## **المرحلة الخامسة: التحليلات والتقارير (أسابيع 17-20)**

### **5.1 وحدة التحليلات**
```typescript
// src/modules/analytics/analytics.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDoctorStats(doctorId: number, startDate: Date, endDate: Date) {
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

    return {
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      noShowAppointments,
      completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0,
      totalConsultations,
      completedConsultations,
      totalDuration,
      averageRating,
      totalRatings: ratings.length,
    };
  }

  async getClinicStats(clinicId: number, startDate: Date, endDate: Date) {
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

    return {
      totalAppointments,
      totalRevenue,
      totalDoctors: doctors.length,
      departmentStats: departmentStats.map(dept => ({
        name: dept.name,
        appointments: dept.appointments.length,
      })),
    };
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
}
```

---

## 🔧 إعدادات البيئة

### **متغيرات البيئة (.env)**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/clinic_db"
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=clinic_db

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Agora
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# App
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
```

---

## 🧪 الاختبارات

### **اختبارات الوحدة**
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
              delete: jest.fn(),
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

    const result = await service.create(createAppointmentDto);
    expect(result).toEqual(expectedResult);
  });
});
```

### **اختبارات التكامل**
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
});
```

---

## 📊 مراقبة الأداء

### **Health Check**
```typescript
// src/common/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database'),
    ]);
  }
}
```

### **Logging**
```typescript
// src/common/interceptors/logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        console.log(`${method} ${url} - ${Date.now() - now}ms`);
      }),
    );
  }
}
```

---

## 🚀 النشر والإنتاج

### **Docker Configuration**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

### **Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/clinic_db
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=clinic_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## 📝 ملاحظات مهمة

1. **الأمان**: تطبيق أعلى معايير الأمان لحماية البيانات الطبية
2. **الأداء**: تحسين الاستعلامات واستخدام Redis للتخزين المؤقت
3. **القابلية للتوسع**: تصميم يدعم آلاف المستخدمين المتزامنين
4. **المراقبة**: نظام مراقبة شامل للأداء والأخطاء
5. **النسخ الاحتياطي**: نظام نسخ احتياطي منتظم للبيانات

---

*تم إعداد هذه الخطة بناءً على المتطلبات المحددة ويمكن تعديلها حسب الحاجة*
