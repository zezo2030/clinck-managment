# إعداد الـ Backend للمصادقة

## المشاكل المحتملة والحلول

### 1. مشكلة "TypeError: Failed to fetch"

#### السبب:
- الـ Frontend يحاول الاتصال بـ `/auth/login` لكن الـ Backend يستخدم global prefix `api/v1`
- المسار الصحيح يجب أن يكون `/api/v1/auth/login`

#### الحلول:

**أ. إنشاء ملف .env في مجلد backend:**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=clinic_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=development
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001
```

**ب. تشغيل PostgreSQL:**
```bash
# على Windows
# 1. قم بتثبيت PostgreSQL إذا لم يكن مُثبت
# 2. أنشئ قاعدة بيانات جديدة باسم "clinic_db"
# 3. أو استخدم Docker:

docker run --name postgres-clinic -e POSTGRES_PASSWORD=password -e POSTGRES_DB=clinic_db -p 5432:5432 -d postgres:13
```

**ج. تشغيل الـ Backend:**
```bash
cd backend

# تثبيت المكتبات
npm install

# تشغيل قاعدة البيانات
npm run prisma:generate

# تشغيل الخادم
npm run start:dev
```

**د. التحقق من عمل الـ Backend:**
- اذهب إلى: `http://localhost:3000/api/docs`
- يجب أن ترى واجهة Swagger
- جرب API endpoint: `POST /api/v1/auth/login`

### 2. مشكلة CORS

#### السبب:
- الـ Frontend يعمل على `localhost:3001`
- الـ Backend يعمل على `localhost:3000`
- CORS غير مُعد للسماح بالاتصال

#### الحل:
تم إعداد CORS في `backend/src/main.ts` للسماح بالاتصال من:
- `http://localhost:3001`
- `http://localhost:3000`
- `http://127.0.0.1:3001`
- `http://127.0.0.1:3000`

### 3. مشكلة قاعدة البيانات

#### السبب:
- قاعدة البيانات غير موجودة أو غير متصلة
- متغيرات البيئة غير صحيحة

#### الحل:
```bash
# 1. تأكد من وجود PostgreSQL
psql --version

# 2. أنشئ قاعدة البيانات
createdb clinic_db

# 3. أو استخدم Docker
docker run --name postgres-clinic -e POSTGRES_PASSWORD=password -e POSTGRES_DB=clinic_db -p 5432:5432 -d postgres:13

# 4. حدث ملف .env بالبيانات الصحيحة
```

### 4. اختبار النظام

#### اختبار API endpoints:
```bash
# 1. تأكد من أن الـ Backend يعمل
curl http://localhost:3000/api/docs

# 2. اختبار تسجيل مستخدم جديد
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "PATIENT",
    "firstName": "أحمد",
    "lastName": "محمد",
    "phone": "+966501234567",
    "address": "الرياض، السعودية"
  }'

# 3. اختبار تسجيل الدخول
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 5. استكشاف الأخطاء الشائعة

#### "Connection refused":
- تأكد من أن PostgreSQL يعمل
- تحقق من إعدادات الاتصال في .env

#### "JWT_SECRET is required":
- أضف JWT_SECRET في ملف .env

#### "Entity not found":
- شغل `npm run prisma:generate`

#### "CORS error":
- تحقق من FRONTEND_URL في .env
- تأكد من أن الـ Frontend يعمل على البورت الصحيح

### 6. الخطوات التفصيلية للتشغيل:

#### الخطوة 1: إعداد قاعدة البيانات
```bash
# إنشاء ملف .env
# (انسخ من .env.example وعدل البيانات)

# تشغيل PostgreSQL
docker run --name postgres-clinic -e POSTGRES_PASSWORD=password -e POSTGRES_DB=clinic_db -p 5432:5432 -d postgres:13

# أو إذا كان PostgreSQL مُثبت محلياً:
createdb clinic_db
```

#### الخطوة 2: تشغيل الـ Backend
```bash
cd backend
npm install
npm run prisma:generate  # إنشاء Prisma client
npm run start:dev        # تشغيل الخادم
```

#### الخطوة 3: التحقق من العمل
- اذهب إلى: `http://localhost:3000/api/docs`
- يجب أن ترى واجهة Swagger
- جرب إنشاء مستخدم جديد من خلال Swagger

#### الخطوة 4: تشغيل الـ Frontend
```bash
cd website
npm install

# إنشاء ملف .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1" > .env.local

npm run dev
```

#### الخطوة 5: اختبار النظام
1. اذهب إلى `http://localhost:3001`
2. اضغط "إنشاء حساب"
3. أدخل البيانات وجرب التسجيل
4. جرب تسجيل الدخول
5. اذهب إلى `/dashboard` للتحقق من الحماية

### 7. ملاحظات مهمة

- **Global Prefix**: جميع API endpoints تبدأ بـ `api/v1`
- **CORS**: مُعد للسماح من `localhost:3001`
- **Database**: يستخدم TypeORM مع PostgreSQL
- **JWT**: يتم توقيع التوكنز باستخدام JWT_SECRET
- **Validation**: يستخدم class-validator للتحقق من البيانات

### 8. في حالة استمرار المشاكل:

1. **تحقق من console logs** في الـ Backend
2. **تحقق من Network tab** في Developer Tools
3. **تأكد من صحة الـ API URL** في الـ Frontend
4. **تحقق من إعدادات CORS** في الـ Backend
5. **تأكد من عمل قاعدة البيانات**
