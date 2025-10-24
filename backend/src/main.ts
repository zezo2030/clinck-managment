import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // إضافة cookie parser
  app.use(cookieParser());

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Global exception filters
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new ValidationExceptionFilter());

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:3002',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3002',
      process.env.FRONTEND_URL || 'http://localhost:3001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cookie',
      'Set-Cookie'
    ],
    exposedHeaders: ['Set-Cookie'],
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('نظام إدارة العيادات')
    .setDescription('API لإدارة العمليات الطبية والعيادات')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // تشغيل الـ seed في بيئة التطوير - مؤقتاً معطل
  // if (process.env.NODE_ENV === 'development') {
  //   try {
  //     const dataSource = await getDataSource();
  //     await seedDatabase(dataSource);
  //     console.log('✅ Database seeded successfully');
  //   } catch (error) {
  //     console.log('⚠️ Seed data already exists or error occurred:', error.message);
  //   }
  // }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
