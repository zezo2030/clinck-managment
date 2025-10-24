# Admin Dashboard - Docker Integration

## نظرة عامة

تم تكامل Admin Dashboard مع Docker الموجود للـ Backend والـ Website.

## البنية

```
Docker Network: clinic_network_dev
├── postgres-dev (5432) - قاعدة البيانات
├── redis-dev (6379) - Redis Cache
├── backend-dev (3000) - Backend API
├── website-dev (3001) - Website للمرضى
└── admin-dashboard-dev (3002) - Admin Dashboard للإدارة
```

## الملفات المضافة

- `Dockerfile.dev` - Dockerfile للـ Admin Dashboard
- `.dockerignore` - ملف تجاهل للملفات غير المطلوبة
- `env.docker` - متغيرات البيئة للـ Docker
- `env.local` - متغيرات البيئة للتطوير المحلي

## الملفات المحدثة

- `vite.config.ts` - تحديث المنفذ إلى 3002 وإضافة host: 0.0.0.0
- `docker-compose.dev.yml` - إضافة admin-dashboard-dev service

## أوامر التشغيل

### تشغيل جميع الخدمات
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### تشغيل Admin Dashboard فقط
```bash
docker-compose -f docker-compose.dev.yml up admin-dashboard-dev
```

### إعادة بناء Admin Dashboard
```bash
docker-compose -f docker-compose.dev.yml up --build admin-dashboard-dev
```

### عرض اللوجات
```bash
docker-compose -f docker-compose.dev.yml logs -f admin-dashboard-dev
```

### إيقاف جميع الخدمات
```bash
docker-compose -f docker-compose.dev.yml down
```

## الوصول

- **Backend API**: `http://localhost:3000`
- **Website**: `http://localhost:3001`
- **Admin Dashboard**: `http://localhost:3002`

## بيانات تسجيل الدخول

- **البريد الإلكتروني**: `admin@clinic.com`
- **كلمة المرور**: `admin123`

## ملاحظات

- Admin Dashboard يعمل على المنفذ 3002
- Hot reload يعمل بفضل volume mounting
- التوكنات والكوكيز تعمل بشكل صحيح مع `withCredentials: true`
- الخدمات تتواصل عبر أسماء الـ containers داخل Docker

