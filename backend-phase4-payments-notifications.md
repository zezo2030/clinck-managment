# 💳 المرحلة الرابعة: المدفوعات والإشعارات - نظام إدارة العيادات

## 📋 نظرة عامة على المرحلة الرابعة

هذه المرحلة تركز على تطوير نظام المدفوعات الشامل مع دعم Stripe وإرسال الإشعارات المتقدمة.

**المدة المقدرة:** 4 أسابيع  
**الهدف:** تطوير نظام مدفوعات متكامل مع إشعارات ذكية

---

## 🛠️ التقنيات المطلوبة

### **Core Framework:**
- **NestJS** - إطار عمل Node.js متقدم
- **TypeScript** - لغة البرمجة
- **Node.js** - بيئة التشغيل

### **Database:**
- **PostgreSQL** - قاعدة البيانات الرئيسية
- **Prisma** - ORM لإدارة قاعدة البيانات
- **Redis** - تخزين مؤقت للإشعارات

### **Payment Processing:**
- **Stripe** - معالجة المدفوعات
- **PayPal** - معالجة المدفوعات البديلة

### **Notifications:**
- **Firebase Admin SDK** - الإشعارات
- **SendGrid** - إرسال الإيميلات
- **Twilio** - إرسال الرسائل النصية

### **Background Jobs:**
- **Bull Queue** - المهام في الخلفية
- **Cron Jobs** - المهام المجدولة

---

## 🏗️ هيكل المشروع للمرحلة الرابعة

```
backend/
├── src/
│   ├── modules/
│   │   ├── payments/          # وحدة المدفوعات
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   ├── payments.module.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-payment.dto.ts
│   │   │   │   ├── process-payment.dto.ts
│   │   │   │   └── refund-payment.dto.ts
│   │   │   └── entities/
│   │   │       └── payment.entity.ts
│   │   ├── notifications/     # وحدة الإشعارات
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── notifications.module.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   ├── stripe/            # وحدة Stripe
│   │   │   ├── stripe.service.ts
│   │   │   ├── stripe.controller.ts
│   │   │   └── stripe.module.ts
│   │   ├── firebase/          # وحدة Firebase
│   │   │   ├── firebase.service.ts
│   │   │   └── firebase.module.ts
│   │   └── email/             # وحدة الإيميل
│   │       ├── email.service.ts
│   │       ├── email.controller.ts
│   │       └── email.module.ts
│   ├── common/
│   │   ├── schedulers/        # المهام المجدولة
│   │   │   ├── payment-reminder.scheduler.ts
│   │   │   ├── appointment-reminder.scheduler.ts
│   │   │   └── notification.scheduler.ts
│   │   ├── queues/            # طوابير المهام
│   │   │   ├── payment.queue.ts
│   │   │   ├── notification.queue.ts
│   │   │   └── email.queue.ts
│   │   └── utils/
│   │       ├── payment.util.ts
│   │       └── notification.util.ts
│   └── config/
│       ├── stripe.config.ts
│       ├── firebase.config.ts
│       └── email.config.ts
```

---

## 🗄️ قاعدة البيانات - المرحلة الرابعة

### **إضافة الجداول الجديدة**

```prisma
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

// جدول إعدادات الإشعارات
model NotificationSettings {
  id                    Int      @id @default(autoincrement())
  userId                Int      @unique
  emailNotifications    Boolean  @default(true)
  smsNotifications      Boolean  @default(true)
  pushNotifications     Boolean  @default(true)
  appointmentReminders  Boolean  @default(true)
  paymentReminders      Boolean  @default(true)
  systemUpdates         Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  // العلاقات
  user User @relation(fields: [userId], references: [id])

  @@map("notification_settings")
}

// Enums
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

## 🚀 خطوات التنفيذ

### **الأسبوع الأول: نظام المدفوعات**

#### **1.1 وحدة المدفوعات**
```typescript
// src/modules/payments/payments.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    // إنشاء payment intent في Stripe
    const paymentIntent = await this.stripeService.createPaymentIntent(
      createPaymentDto.amount,
      createPaymentDto.currency,
      createPaymentDto.paymentMethod,
    );

    return this.prisma.payment.create({
      data: {
        appointmentId: createPaymentDto.appointmentId,
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency,
        paymentMethod: createPaymentDto.paymentMethod,
        transactionId: paymentIntent.id,
        status: 'PENDING',
      },
    });
  }

  async confirmPayment(paymentId: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('الدفعة غير موجودة');
    }

    // تأكيد الدفع في Stripe
    await this.stripeService.confirmPaymentIntent(payment.transactionId);

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

  async getPaymentHistory(userId: number) {
    return this.prisma.payment.findMany({
      where: {
        appointment: {
          OR: [
            { patientId: userId },
            { doctorId: userId },
          ],
        },
      },
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPaymentStats(startDate: Date, endDate: Date) {
    const payments = await this.prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalRevenue = payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const totalRefunds = payments
      .filter(p => p.status === 'REFUNDED')
      .reduce((sum, p) => sum + Number(p.refundAmount || 0), 0);

    return {
      totalPayments: payments.length,
      completedPayments: payments.filter(p => p.status === 'COMPLETED').length,
      failedPayments: payments.filter(p => p.status === 'FAILED').length,
      refundedPayments: payments.filter(p => p.status === 'REFUNDED').length,
      totalRevenue,
      totalRefunds,
      netRevenue: totalRevenue - totalRefunds,
    };
  }
}
```

#### **1.2 خدمة Stripe**
```typescript
// src/modules/stripe/stripe.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(amount: number, currency: string, paymentMethod: string) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // تحويل إلى سنت
      currency: currency.toLowerCase(),
      payment_method_types: [paymentMethod.toLowerCase()],
      metadata: {
        source: 'clinic_management_system',
      },
    });

    return paymentIntent;
  }

  async confirmPaymentIntent(paymentIntentId: string) {
    return this.stripe.paymentIntents.confirm(paymentIntentId);
  }

  async createRefund(paymentIntentId: string, amount: number) {
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(amount * 100),
    });
  }

  async createCustomer(email: string, name: string) {
    return this.stripe.customers.create({
      email,
      name,
    });
  }

  async createSetupIntent(customerId: string) {
    return this.stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });
  }

  async getPaymentMethods(customerId: string) {
    return this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
  }

  async webhookHandler(payload: string, signature: string) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      return this.handleStripeEvent(event);
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }
  }

  private async handleStripeEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    // منطق معالجة الدفع الناجح
    console.log('Payment succeeded:', paymentIntent.id);
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    // منطق معالجة فشل الدفع
    console.log('Payment failed:', paymentIntent.id);
  }
}
```

### **الأسبوع الثاني: نظام الإشعارات**

#### **2.1 وحدة الإشعارات**
```typescript
// src/modules/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { FirebaseService } from '../firebase/firebase.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private firebaseService: FirebaseService,
    private emailService: EmailService,
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

    // إرسال إيميل إذا كان مفعل
    const settings = await this.getNotificationSettings(userId);
    if (settings.emailNotifications) {
      await this.emailService.sendEmail(userId, {
        subject: notification.title,
        body: notification.message,
      });
    }

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

  async sendBulkNotification(userIds: number[], notification: any) {
    const notifications = userIds.map(userId => ({
      userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
    }));

    await this.prisma.notification.createMany({
      data: notifications,
    });

    // إرسال إشعارات Firebase
    await Promise.all(
      userIds.map(userId => 
        this.firebaseService.sendNotification(userId, notification)
      )
    );
  }

  async getUserNotifications(userId: number, page: number = 1, limit: number = 10) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async markAsRead(notificationId: number) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async getNotificationSettings(userId: number) {
    let settings = await this.prisma.notificationSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await this.prisma.notificationSettings.create({
        data: { userId },
      });
    }

    return settings;
  }

  async updateNotificationSettings(userId: number, settings: any) {
    return this.prisma.notificationSettings.upsert({
      where: { userId },
      update: settings,
      create: { userId, ...settings },
    });
  }
}
```

#### **2.2 خدمة Firebase**
```typescript
// src/modules/firebase/firebase.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(private configService: ConfigService) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: this.configService.get('FIREBASE_PROJECT_ID'),
          privateKey: this.configService.get('FIREBASE_PRIVATE_KEY'),
          clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
        }),
      });
    }
  }

  async sendNotification(userId: number, notification: any) {
    try {
      // الحصول على FCM token للمستخدم
      const user = await this.getUserFCMToken(userId);
      
      if (!user.fcmToken) {
        console.log(`No FCM token for user ${userId}`);
        return;
      }

      const message = {
        token: user.fcmToken,
        notification: {
          title: notification.title,
          body: notification.message,
        },
        data: {
          type: notification.type,
          userId: userId.toString(),
        },
        android: {
          notification: {
            icon: 'ic_notification',
            color: '#FF6B6B',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      
      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async sendToTopic(topic: string, notification: any) {
    const message = {
      topic,
      notification: {
        title: notification.title,
        body: notification.message,
      },
      data: {
        type: notification.type,
      },
    };

    return admin.messaging().send(message);
  }

  async subscribeToTopic(token: string, topic: string) {
    return admin.messaging().subscribeToTopic(token, topic);
  }

  async unsubscribeFromTopic(token: string, topic: string) {
    return admin.messaging().unsubscribeFromTopic(token, topic);
  }

  private async getUserFCMToken(userId: number) {
    // منطق الحصول على FCM token من قاعدة البيانات
    // يمكن إضافة جدول منفصل لتخزين FCM tokens
    return { fcmToken: null };
  }
}
```

### **الأسبوع الثالث: المهام المجدولة**

#### **3.1 Scheduler للمدفوعات**
```typescript
// src/common/schedulers/payment-reminder.scheduler.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../../modules/notifications/notifications.service';

@Injectable()
export class PaymentReminderScheduler {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendPaymentReminders() {
    // البحث عن المدفوعات المعلقة لأكثر من 24 ساعة
    const pendingPayments = await this.prisma.payment.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lte: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 ساعة مضت
        },
      },
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

    for (const payment of pendingPayments) {
      await this.notificationsService.sendNotification(payment.appointment.patientId, {
        title: 'تذكير بالدفع',
        message: `لديك دفعة معلقة بقيمة ${payment.amount} دولار. يرجى إكمال الدفع في أقرب وقت.`,
        type: 'PAYMENT',
      });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailyPaymentReport() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const payments = await this.prisma.payment.findMany({
      where: {
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
    });

    const totalRevenue = payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    // إرسال تقرير يومي للإدارة
    console.log(`Daily revenue: $${totalRevenue}`);
  }
}
```

#### **3.2 Scheduler للمواعيد**
```typescript
// src/common/schedulers/appointment-reminder.scheduler.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../../modules/notifications/notifications.service';

@Injectable()
export class AppointmentReminderScheduler {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendAppointmentReminders() {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    // البحث عن المواعيد في الساعة القادمة
    const upcomingAppointments = await this.prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: oneHourFromNow,
          lte: twoHoursFromNow,
        },
        status: 'CONFIRMED',
      },
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
      },
    });

    for (const appointment of upcomingAppointments) {
      await this.notificationsService.sendNotification(appointment.patientId, {
        title: 'تذكير بالموعد',
        message: `موعدك مع د. ${appointment.doctor.profile.firstName} سيبدأ خلال ساعة`,
        type: 'APPOINTMENT',
      });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendDailyAppointmentSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysAppointments = await this.prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
      },
    });

    // إرسال ملخص للمرضى
    for (const appointment of todaysAppointments) {
      await this.notificationsService.sendNotification(appointment.patientId, {
        title: 'ملخص مواعيد اليوم',
        message: `لديك موعد مع د. ${appointment.doctor.profile.firstName} في ${appointment.appointmentTime.toLocaleTimeString()}`,
        type: 'APPOINTMENT',
      });
    }
  }
}
```

### **الأسبوع الرابع: اختبارات وتحسينات**

#### **4.1 اختبارات المدفوعات**
```typescript
// test/unit/payments.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../../src/modules/payments/payments.service';
import { PrismaService } from '../../src/database/prisma.service';
import { StripeService } from '../../src/modules/stripe/stripe.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prismaService: PrismaService;
  let stripeService: StripeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: {
            payment: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: StripeService,
          useValue: {
            createPaymentIntent: jest.fn(),
            confirmPaymentIntent: jest.fn(),
            createRefund: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prismaService = module.get<PrismaService>(PrismaService);
    stripeService = module.get<StripeService>(StripeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a payment', async () => {
    const createPaymentDto = {
      appointmentId: 1,
      amount: 100,
      currency: 'USD',
      paymentMethod: 'CARD',
    };

    const expectedResult = { id: 1, ...createPaymentDto };
    jest.spyOn(prismaService.payment, 'create').mockResolvedValue(expectedResult);
    jest.spyOn(stripeService, 'createPaymentIntent').mockResolvedValue({ id: 'pi_123' });

    const result = await service.createPayment(createPaymentDto);
    expect(result).toEqual(expectedResult);
  });

  it('should confirm a payment', async () => {
    const payment = { id: 1, transactionId: 'pi_123', status: 'PENDING' };
    jest.spyOn(prismaService.payment, 'findUnique').mockResolvedValue(payment);
    jest.spyOn(stripeService, 'confirmPaymentIntent').mockResolvedValue({});
    jest.spyOn(prismaService.payment, 'update').mockResolvedValue({ ...payment, status: 'COMPLETED' });

    const result = await service.confirmPayment(1);
    expect(result.status).toBe('COMPLETED');
  });
});
```

#### **4.2 اختبارات الإشعارات**
```typescript
// test/unit/notifications.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../../src/modules/notifications/notifications.service';
import { PrismaService } from '../../src/database/prisma.service';
import { FirebaseService } from '../../src/modules/firebase/firebase.service';
import { EmailService } from '../../src/modules/email/email.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prismaService: PrismaService;
  let firebaseService: FirebaseService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: PrismaService,
          useValue: {
            notification: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
            notificationSettings: {
              findUnique: jest.fn(),
              upsert: jest.fn(),
            },
          },
        },
        {
          provide: FirebaseService,
          useValue: {
            sendNotification: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    prismaService = module.get<PrismaService>(PrismaService);
    firebaseService = module.get<FirebaseService>(FirebaseService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a notification', async () => {
    const notification = {
      title: 'Test Notification',
      message: 'Test message',
      type: 'SYSTEM',
    };

    const expectedResult = { id: 1, userId: 1, ...notification };
    jest.spyOn(prismaService.notification, 'create').mockResolvedValue(expectedResult);
    jest.spyOn(firebaseService, 'sendNotification').mockResolvedValue({});

    const result = await service.sendNotification(1, notification);
    expect(result).toEqual(expectedResult);
  });
});
```

---

## 🔧 إعدادات البيئة

### **متغيرات البيئة الإضافية**
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# SMS
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Background Jobs
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

---

## 📊 مؤشرات النجاح

### **المخرجات المطلوبة:**
1. ✅ نظام مدفوعات متكامل مع Stripe
2. ✅ إشعارات Firebase تعمل
3. ✅ إرسال الإيميلات يعمل
4. ✅ المهام المجدولة تعمل
5. ✅ إدارة الإشعارات تعمل
6. ✅ اختبارات شاملة تعمل

### **الاختبارات المطلوبة:**
- [ ] معالجة الدفع
- [ ] تأكيد الدفع
- [ ] استرداد المدفوعات
- [ ] إرسال الإشعارات
- [ ] المهام المجدولة
- [ ] إدارة الإعدادات

---

## 🚀 الخطوات التالية

بعد إكمال المرحلة الرابعة، ستكون جاهزاً للانتقال إلى:
- **المرحلة الخامسة:** التحليلات والتقارير
- **المرحلة السادسة:** النشر والإنتاج

---

*هذه المرحلة تضيف القيمة المالية للنظام مع المدفوعات والإشعارات الذكية*
