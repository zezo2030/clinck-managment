# 💬 المرحلة الثالثة: الاستشارات الافتراضية - نظام إدارة العيادات

## 📋 نظرة عامة على المرحلة الثالثة

هذه المرحلة تركز على تطوير نظام الاستشارات الافتراضية مع دعم مكالمات الفيديو والدردشة المباشرة.

**المدة المقدرة:** 4 أسابيع  
**الهدف:** تطوير نظام استشارات افتراضية متكامل مع مكالمات الفيديو

---

## 🛠️ التقنيات المطلوبة

### **Core Framework:**
- **NestJS** - إطار عمل Node.js متقدم
- **TypeScript** - لغة البرمجة
- **Node.js** - بيئة التشغيل

### **Database:**
- **PostgreSQL** - قاعدة البيانات الرئيسية
- **Prisma** - ORM لإدارة قاعدة البيانات
- **Redis** - تخزين مؤقت للرسائل

### **Real-time Communication:**
- **Socket.io** - الاتصال المباشر
- **WebSockets** - الاتصال المباشر
- **Agora SDK** - مكالمات الفيديو

### **File Storage:**
- **AWS S3** - تخزين الملفات
- **Multer** - رفع الملفات

---

## 🏗️ هيكل المشروع للمرحلة الثالثة

```
backend/
├── src/
│   ├── modules/
│   │   ├── consultations/     # وحدة الاستشارات
│   │   │   ├── consultations.controller.ts
│   │   │   ├── consultations.service.ts
│   │   │   ├── consultations.module.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-consultation.dto.ts
│   │   │   │   ├── start-consultation.dto.ts
│   │   │   │   └── end-consultation.dto.ts
│   │   │   └── entities/
│   │   │       └── consultation.entity.ts
│   │   ├── messages/          # وحدة الرسائل
│   │   │   ├── messages.controller.ts
│   │   │   ├── messages.service.ts
│   │   │   ├── messages.module.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   ├── agora/             # وحدة Agora
│   │   │   ├── agora.service.ts
│   │   │   ├── agora.controller.ts
│   │   │   └── agora.module.ts
│   │   └── file-upload/       # وحدة رفع الملفات
│   │       ├── file-upload.service.ts
│   │       ├── file-upload.controller.ts
│   │       └── file-upload.module.ts
│   ├── common/
│   │   ├── gateways/          # WebSocket Gateways
│   │   │   ├── consultation.gateway.ts
│   │   │   └── message.gateway.ts
│   │   └── utils/
│   │       ├── agora.util.ts
│   │       └── file.util.ts
│   └── config/
│       ├── agora.config.ts
│       └── aws.config.ts
```

---

## 🗄️ قاعدة البيانات - المرحلة الثالثة

### **إضافة الجداول الجديدة**

```prisma
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

// Enums
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
```

---

## 🚀 خطوات التنفيذ

### **الأسبوع الأول: وحدة الاستشارات**

#### **1.1 وحدة الاستشارات الأساسية**
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

  async getConsultationHistory(patientId: number, doctorId?: number) {
    return this.prisma.consultation.findMany({
      where: {
        appointment: {
          patientId,
          ...(doctorId && { doctorId }),
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
        messages: {
          include: {
            sender: {
              include: { profile: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
```

#### **1.2 وحدة الرسائل**
```typescript
// src/modules/messages/messages.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      data: createMessageDto,
      include: {
        sender: {
          include: { profile: true },
        },
        consultation: {
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
        },
      },
    });
  }

  async getMessagesByConsultation(consultationId: number) {
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

  async getUnreadMessages(userId: number) {
    return this.prisma.message.findMany({
      where: {
        consultation: {
          appointment: {
            OR: [
              { patientId: userId },
              { doctorId: userId },
            ],
          },
        },
        senderId: { not: userId },
        // إضافة منطق للرسائل غير المقروءة
      },
      include: {
        sender: {
          include: { profile: true },
        },
        consultation: {
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
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(messageId: number) {
    // منطق تحديد الرسائل كمقروءة
    // يمكن إضافة جدول منفصل لتتبع حالة القراءة
    return { success: true };
  }
}
```

### **الأسبوع الثاني: تكامل Agora للفيديو**

#### **2.1 خدمة Agora**
```typescript
// src/modules/agora/agora.service.ts
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

  async generateChannelName(consultationId: number) {
    return `consultation_${consultationId}`;
  }

  async getRecordingCredentials(channelName: string) {
    // إعداد تسجيل المكالمات
    return {
      channel: channelName,
      recordingConfig: {
        maxIdleTime: 30,
        streamTypes: 2,
        audioProfile: 1,
        videoStreamType: 0,
        channelType: 0,
        subscribeVideoUids: [],
        subscribeAudioUids: [],
        subscribeUidGroup: 0,
      },
    };
  }

  private createToken(appId: string, appCertificate: string, channelName: string, uid: number, role: string) {
    // منطق إنشاء Agora token
    // هذا يتطلب تثبيت Agora SDK
    const agora = require('agora-access-token');
    
    const token = new agora.RtcTokenBuilder()
      .setAppId(appId)
      .setAppCertificate(appCertificate)
      .setChannelName(channelName)
      .setUid(uid)
      .setRole(role)
      .setPrivilegeExpiredTs(Math.floor(Date.now() / 1000) + 3600)
      .build();

    return token;
  }
}
```

#### **2.2 Agora Controller**
```typescript
// src/modules/agora/agora.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AgoraService } from './agora.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('agora')
@UseGuards(JwtAuthGuard)
export class AgoraController {
  constructor(private agoraService: AgoraService) {}

  @Post('token')
  async generateToken(@Body() body: { channelName: string; uid: number; role?: string }) {
    return this.agoraService.generateToken(body.channelName, body.uid, body.role);
  }

  @Post('channel')
  async createChannel(@Body() body: { consultationId: number }) {
    const channelName = await this.agoraService.generateChannelName(body.consultationId);
    return { channelName };
  }

  @Post('recording')
  async startRecording(@Body() body: { channelName: string }) {
    return this.agoraService.getRecordingCredentials(body.channelName);
  }
}
```

### **الأسبوع الثالث: WebSocket Gateways**

#### **3.1 Consultation Gateway**
```typescript
// src/common/gateways/consultation.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/consultation',
})
export class ConsultationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // إزالة المستخدم من قائمة المستخدمين المتصلين
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('join-consultation')
  handleJoinConsultation(
    @MessageBody() data: { consultationId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `consultation_${data.consultationId}`;
    client.join(room);
    this.connectedUsers.set(data.userId.toString(), client.id);
    
    // إشعار المشاركين الآخرين
    client.to(room).emit('user-joined', {
      userId: data.userId,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('leave-consultation')
  handleLeaveConsultation(
    @MessageBody() data: { consultationId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `consultation_${data.consultationId}`;
    client.leave(room);
    this.connectedUsers.delete(data.userId.toString());
    
    // إشعار المشاركين الآخرين
    client.to(room).emit('user-left', {
      userId: data.userId,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('start-consultation')
  handleStartConsultation(
    @MessageBody() data: { consultationId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `consultation_${data.consultationId}`;
    this.server.to(room).emit('consultation-started', {
      consultationId: data.consultationId,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('end-consultation')
  handleEndConsultation(
    @MessageBody() data: { consultationId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `consultation_${data.consultationId}`;
    this.server.to(room).emit('consultation-ended', {
      consultationId: data.consultationId,
      timestamp: new Date(),
    });
  }

  // إرسال إشعارات للمستخدمين
  sendNotificationToUser(userId: number, notification: any) {
    const socketId = this.connectedUsers.get(userId.toString());
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }

  // إرسال إشعارات لغرفة الاستشارة
  sendNotificationToConsultation(consultationId: number, notification: any) {
    const room = `consultation_${consultationId}`;
    this.server.to(room).emit('consultation-notification', notification);
  }
}
```

#### **3.2 Message Gateway**
```typescript
// src/common/gateways/message.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/messages',
})
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('send-message')
  handleSendMessage(
    @MessageBody() data: { consultationId: number; message: string; senderId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `consultation_${data.consultationId}`;
    
    // إرسال الرسالة لجميع المشاركين في الاستشارة
    this.server.to(room).emit('new-message', {
      consultationId: data.consultationId,
      message: data.message,
      senderId: data.senderId,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { consultationId: number; userId: number; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `consultation_${data.consultationId}`;
    client.to(room).emit('user-typing', {
      userId: data.userId,
      isTyping: data.isTyping,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('message-read')
  handleMessageRead(
    @MessageBody() data: { messageId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    // منطق تحديد الرسالة كمقروءة
    this.server.emit('message-read-status', {
      messageId: data.messageId,
      userId: data.userId,
      timestamp: new Date(),
    });
  }
}
```

### **الأسبوع الرابع: رفع الملفات والتقييمات**

#### **4.1 وحدة رفع الملفات**
```typescript
// src/modules/file-upload/file-upload.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'consultations') {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    return {
      fileName,
      url: `https://${this.configService.get('AWS_S3_BUCKET')}.s3.amazonaws.com/${fileName}`,
    };
  }

  async uploadMultipleFiles(files: Express.Multer.File[], folder: string = 'consultations') {
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteFile(fileName: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: fileName,
    });

    await this.s3Client.send(command);
    return { success: true };
  }
}
```

#### **4.2 وحدة التقييمات**
```typescript
// src/modules/ratings/ratings.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async create(createRatingDto: CreateRatingDto) {
    // التحقق من وجود التقييم مسبقاً
    const existingRating = await this.prisma.rating.findUnique({
      where: { appointmentId: createRatingDto.appointmentId },
    });

    if (existingRating) {
      throw new Error('تم تقييم هذا الموعد مسبقاً');
    }

    return this.prisma.rating.create({
      data: createRatingDto,
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
        appointment: true,
      },
    });
  }

  async getDoctorRatings(doctorId: number) {
    const ratings = await this.prisma.rating.findMany({
      where: { doctorId },
      include: {
        patient: {
          include: { profile: true },
        },
        appointment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
      : 0;

    return {
      ratings,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length,
    };
  }

  async getPatientRatings(patientId: number) {
    return this.prisma.rating.findMany({
      where: { patientId },
      include: {
        doctor: {
          include: { profile: true },
        },
        appointment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateRating(ratingId: number, updateData: any) {
    return this.prisma.rating.update({
      where: { id: ratingId },
      data: updateData,
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
        appointment: true,
      },
    });
  }

  async deleteRating(ratingId: number) {
    return this.prisma.rating.delete({
      where: { id: ratingId },
    });
  }
}
```

---

## 🔧 إعدادات البيئة

### **متغيرات البيئة الإضافية**
```env
# Agora
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_BUCKET=your_s3_bucket_name

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf,text/plain
```

---

## 📊 مؤشرات النجاح

### **المخرجات المطلوبة:**
1. ✅ نظام استشارات افتراضية يعمل
2. ✅ مكالمات الفيديو تعمل مع Agora
3. ✅ نظام الرسائل المباشرة يعمل
4. ✅ رفع الملفات يعمل
5. ✅ نظام التقييمات يعمل
6. ✅ WebSocket Gateways تعمل

### **الاختبارات المطلوبة:**
- [ ] بدء استشارة جديدة
- [ ] إرسال رسائل في الاستشارة
- [ ] مكالمة فيديو
- [ ] رفع ملفات
- [ ] تقييم الطبيب
- [ ] إشعارات مباشرة

---

## 🚀 الخطوات التالية

بعد إكمال المرحلة الثالثة، ستكون جاهزاً للانتقال إلى:
- **المرحلة الرابعة:** المدفوعات والإشعارات
- **المرحلة الخامسة:** التحليلات والتقارير
- **المرحلة السادسة:** النشر والإنتاج

---

*هذه المرحلة تضيف القيمة الأساسية للنظام مع الاستشارات الافتراضية*
