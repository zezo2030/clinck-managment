# فصل نظام الأدمن - دليل التطبيق

## نظرة عامة

تم فصل نظام الأدمن بالكامل عن الموقع العادي للمرضى، مع إنشاء نظام مصادقة منفصل وآمن يعتمد على HTTP-only cookies.

## التغييرات المنجزة

### 1. Backend Changes

#### ملفات جديدة:
- `backend/src/modules/auth/guards/admin-auth.guard.ts` - حماية routes الأدمن

#### ملفات معدلة:
- `backend/src/modules/auth/auth.controller.ts` - إضافة endpoints للأدمن:
  - `POST /auth/admin/login` - تسجيل دخول الأدمن
  - `GET /auth/admin/verify` - التحقق من جلسة الأدمن
  - `POST /auth/admin/logout` - تسجيل خروج الأدمن
- `backend/src/modules/auth/auth.service.ts` - إضافة `generateAdminToken()`
- `backend/src/modules/auth/auth.module.ts` - إضافة `AdminAuthGuard`
- `backend/src/modules/admin/admin.controller.ts` - استخدام `AdminAuthGuard`

### 2. Frontend Changes

#### ملفات جديدة:
- `website/src/lib/contexts/AdminAuthContext.tsx` - Context منفصل للأدمن
- `website/src/lib/api/admin-auth.ts` - API client منفصل للأدمن
- `website/src/app/admin/login/page.tsx` - صفحة تسجيل دخول الأدمن
- `website/src/components/admin/AdminLoginForm.tsx` - فورم تسجيل دخول الأدمن

#### ملفات معدلة:
- `website/src/middleware.ts` - فصل routes الأدمن عن العادية
- `website/src/components/admin/AdminGuard.tsx` - التحقق من admin session عبر Backend
- `website/src/app/admin/layout.tsx` - استخدام `AdminAuthProvider`

## الميزات الجديدة

### 1. نظام مصادقة منفصل للأدمن
- استخدام HTTP-only cookies بدلاً من localStorage
- حماية من XSS attacks
- SameSite=Strict للحماية من CSRF
- توكنات منفصلة للأدمن والمرضى

### 2. صفحات منفصلة
- `/admin/login` - تسجيل دخول الأدمن
- `/admin/*` - جميع صفحات الأدمن محمية بـ AdminAuthGuard

### 3. منع التداخل
- الأدمن لا يمكنه الوصول للموقع العادي
- المرضى لا يمكنهم الوصول للوحة الأدمن
- إعادة توجيه تلقائية للصفحات الصحيحة

## كيفية الاستخدام

### للأدمن:
1. اذهب إلى `/admin/login`
2. أدخل بيانات الأدمن
3. سيتم حفظ الجلسة في HTTP-only cookie
4. الوصول لجميع صفحات `/admin/*`

### للمرضى:
1. اذهب إلى `/login` (العادي)
2. أدخل بيانات المريض
3. الوصول لصفحات المرضى العادية

## الأمان

### HTTP-only Cookies
- لا يمكن الوصول للتوكنات من JavaScript
- حماية من XSS attacks
- SameSite=Strict للحماية من CSRF

### فصل كامل للسيشنات
- `admin_token` للأدمن
- `auth_token` للمرضى
- لا تداخل بين النظامين

### التحقق على Backend
- كل request يتم التحقق منه على Backend
- لا اعتماد على localStorage للأدمن
- حماية من التلاعب بالتوكنات

## API Endpoints الجديدة

### الأدمن:
- `POST /api/v1/auth/admin/login` - تسجيل دخول الأدمن
- `GET /api/v1/auth/admin/verify` - التحقق من جلسة الأدمن
- `POST /api/v1/auth/admin/logout` - تسجيل خروج الأدمن

### الحماية:
- جميع `/admin/*` routes محمية بـ `AdminAuthGuard`
- التحقق من `admin_token` cookie
- منع الوصول للمستخدمين غير الأدمن

## ملاحظات مهمة

1. **لا استخدام localStorage للأدمن**: جميع البيانات محفوظة في HTTP-only cookies
2. **فصل كامل**: لا يمكن للأدمن الوصول للموقع العادي والعكس
3. **أمان عالي**: حماية من XSS و CSRF attacks
4. **سهولة الصيانة**: نظام منفصل يسهل التطوير والصيانة

## اختبار النظام

1. شغل Backend: `cd backend && npm run start:dev`
2. شغل Frontend: `cd website && npm run dev`
3. اذهب إلى `/admin/login` للأدمن
4. اذهب إلى `/login` للمرضى
5. تأكد من عدم إمكانية الوصول المتقاطع

## إصلاح مشكلة AdminAuthGuard

تم حل مشكلة `AdminAuthGuard` التي كانت تظهر خطأ:
```
Nest can't resolve dependencies of the AdminAuthGuard (?). Please make sure that the argument JwtService at index [0] is available in the AdminModule context.
```

**الحل:**
- إضافة `AuthModule` إلى imports في `AdminModule`
- هذا يضمن أن `JwtService` متاح لـ `AdminAuthGuard`

**الملف المُحدث:**
```typescript
// backend/src/modules/admin/admin.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([...]),
    AuthModule, // ← تم إضافته
  ],
  // ...
})
```
