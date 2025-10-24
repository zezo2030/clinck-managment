# Admin Dashboard

لوحة تحكم إدارية متقدمة لنظام إدارة العيادات الطبية.

## الميزات

- 🔐 نظام مصادقة آمن للأدمن
- 📊 لوحة تحكم شاملة مع الإحصائيات
- 👥 إدارة المستخدمين (مرضى، أطباء، أدمن)
- 🩺 إدارة الأطباء والتخصصات
- 🏥 إدارة العيادات والأقسام
- 📅 إدارة المواعيد
- 💬 إدارة الاستشارات
- 📈 تقارير وإحصائيات مفصلة
- 📱 تصميم متجاوب
- 🌙 وضع ليلي ونهاري
- 🔄 تحديثات فورية

## التقنيات المستخدمة

- **React 18** مع TypeScript
- **Vite** للبناء السريع
- **React Router v6** للتنقل
- **Tailwind CSS** للتصميم
- **shadcn/ui** للمكونات
- **TanStack Query** لإدارة البيانات
- **React Hook Form** للنماذج
- **Zod** للتحقق من البيانات
- **Recharts** للرسوم البيانية
- **Axios** للـ API calls
- **Lucide React** للأيقونات

## التثبيت

1. تثبيت المكتبات:
```bash
npm install
```

2. إنشاء ملف البيئة:
```bash
cp env.example .env.local
```

3. تحديث متغيرات البيئة في `.env.local`:
```
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Admin Dashboard
```

## التشغيل

```bash
# تشغيل في وضع التطوير
npm run dev

# بناء للإنتاج
npm run build

# معاينة البناء
npm run preview
```

## البنية

```
src/
├── components/          # المكونات
│   ├── auth/           # مكونات المصادقة
│   ├── layout/         # مكونات التخطيط
│   └── ui/             # مكونات واجهة المستخدم
├── context/            # Context API
├── hooks/              # Custom Hooks
├── pages/              # الصفحات
├── services/           # خدمات API
├── types/              # أنواع TypeScript
├── utils/              # دوال مساعدة
└── router.tsx          # إعداد التوجيه
```

## التكامل مع Backend

يتم التكامل مع Backend عبر الـ API endpoints التالية:

- `POST /auth/admin/login` - تسجيل دخول الأدمن
- `GET /auth/admin/verify` - التحقق من الجلسة
- `POST /auth/admin/logout` - تسجيل الخروج
- `GET /admin/stats/*` - الإحصائيات
- `GET /users`, `POST /users`, etc. - إدارة المستخدمين
- `GET /doctors`, `POST /doctors`, etc. - إدارة الأطباء
- `GET /clinics`, `POST /clinics`, etc. - إدارة العيادات
- `GET /appointments`, `POST /appointments`, etc. - إدارة المواعيد
- `GET /consultations` - عرض الاستشارات
- `GET /specialties`, `POST /specialties`, etc. - إدارة التخصصات

## الأمان

- حماية جميع الصفحات بـ AdminGuard
- التحقق من صلاحيات الأدمن
- إدارة آمنة للجلسات
- حماية من XSS و CSRF
- تشفير البيانات الحساسة

## الأداء

- Code splitting للصفحات
- Lazy loading للمكونات
- Memoization للمكونات
- React Query caching
- Debouncing للبحث

## التطوير

```bash
# تشغيل في وضع التطوير
npm run dev

# فحص الأخطاء
npm run lint

# بناء للإنتاج
npm run build
```

## المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push للفرع
5. إنشاء Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.