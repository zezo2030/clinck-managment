# 🚀 المرحلة الأولى: الأساسيات - نظام إدارة العيادات

## 📋 نظرة عامة على المرحلة الأولى

هذه المرحلة تركز على إعداد البيئة الأساسية للنظام وتطوير الوحدات الأساسية مثل المصادقة والمستخدمين.

**المدة المقدرة:** 4 أسابيع  
**الهدف:** إعداد البيئة الأساسية وتطوير نظام المصادقة وإدارة المستخدمين

---

## 🛠️ التقنيات المطلوبة

### **Core Framework:**
- **NestJS** - إطار عمل Node.js متقدم
- **TypeScript** - لغة البرمجة
- **Node.js** - بيئة التشغيل

### **Database:**
- **PostgreSQL** - قاعدة البيانات الرئيسية
- **Prisma** - ORM لإدارة قاعدة البيانات

### **Authentication & Security:**
- **JWT** - نظام المصادقة
- **Bcrypt** - تشفير كلمات المرور
- **Passport** - استراتيجيات المصادقة

### **Development Tools:**
- **Swagger** - توثيق API
- **Jest** - الاختبارات
- **ESLint** - فحص الكود
- **Prettier** - تنسيق الكود

---

## 🏗️ هيكل المشروع للمرحلة الأولى

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/               # وحدة المصادقة
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   └── guards/
│   │   │       ├── jwt-auth.guard.ts
│   │   │       └── roles.guard.ts
│   │   └── users/              # وحدة المستخدمين
│   │       ├── users.controller.ts
│   │       ├── users.service.ts
│   │       ├── users.module.ts
│   │       ├── dto/
│   │       │   ├── create-user.dto.ts
│   │       │   └── update-user.dto.ts
│   │       └── entities/
│   │           └── user.entity.ts
│   ├── common/                # مكونات مشتركة
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── filters/
│   │   │   ├── http-exception.filter.ts
│   │   │   └── validation-exception.filter.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   └── utils/
│   │       ├── validation.util.ts
│   │       └── encryption.util.ts
│   ├── config/                # إعدادات النظام
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   ├── database/              # إعدادات قاعدة البيانات
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── client.ts
│   └── main.ts               # نقطة البداية
├── test/                     # ملفات الاختبار
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                    # التوثيق
│   ├── api/
│   └── database/
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .env                     # متغيرات البيئة
```

---

## 🗄️ قاعدة البيانات - المرحلة الأولى

### **Prisma Schema الأساسي**

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
```

---

## 🚀 خطوات التنفيذ

### **الأسبوع الأول: إعداد البيئة**

#### **1.1 إنشاء المشروع**
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
npm install class-validator class-transformer
npm install @nestjs/swagger swagger-ui-express
npm install @nestjs/config

# تثبيت حزم التطوير
npm install -D @types/node @types/jest
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

#### **1.2 إعداد قاعدة البيانات**
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

#### **1.3 إعداد Prisma**
```typescript
// src/database/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

### **الأسبوع الثاني: وحدة المصادقة**

#### **2.1 إنشاء وحدة المصادقة**
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

#### **2.2 إنشاء JWT Strategy**
```typescript
// src/modules/auth/strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
```

#### **2.3 إنشاء Auth Controller**
```typescript
// src/modules/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

### **الأسبوع الثالث: وحدة المستخدمين**

#### **3.1 إنشاء Users Service**
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

#### **3.2 إنشاء DTOs**
```typescript
// src/modules/users/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
```

#### **3.3 إنشاء Users Controller**
```typescript
// src/modules/users/users.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
```

### **الأسبوع الرابع: الاختبارات والتوثيق**

#### **4.1 اختبارات الوحدة**
```typescript
// test/unit/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/modules/auth/auth.service';
import { UsersService } from '../../src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user with correct credentials', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'PATIENT',
    };

    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await service.validateUser('test@example.com', 'password');
    expect(result).toEqual({
      id: 1,
      email: 'test@example.com',
      role: 'PATIENT',
    });
  });
});
```

#### **4.2 اختبارات التكامل**
```typescript
// test/integration/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      })
      .expect(201);
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(200);
  });
});
```

#### **4.3 إعداد Swagger**
```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Clinic Management API')
    .setDescription('API for managing clinic operations')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
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

# App
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
```

---

## 📊 مؤشرات النجاح

### **المخرجات المطلوبة:**
1. ✅ مشروع NestJS يعمل بنجاح
2. ✅ قاعدة بيانات PostgreSQL متصلة
3. ✅ نظام مصادقة JWT يعمل
4. ✅ وحدات المستخدمين والمصادقة مكتملة
5. ✅ اختبارات الوحدة والتكامل تعمل
6. ✅ توثيق API متاح على `/api`

### **الاختبارات المطلوبة:**
- [ ] تسجيل مستخدم جديد
- [ ] تسجيل دخول مستخدم موجود
- [ ] حماية المسارات المطلوبة
- [ ] إدارة الملفات الشخصية
- [ ] اختبارات الأداء الأساسية

---

## 🚀 الخطوات التالية

بعد إكمال المرحلة الأولى، ستكون جاهزاً للانتقال إلى:
- **المرحلة الثانية:** نظام المواعيد
- **المرحلة الثالثة:** الاستشارات الافتراضية
- **المرحلة الرابعة:** المدفوعات والإشعارات

---

*هذه المرحلة تشكل الأساس القوي للنظام وتضمن الأمان والاستقرار للمراحل التالية*
