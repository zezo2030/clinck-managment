# 🌐 خطة تطوير موقع الويب - نظام إدارة العيادات

## 📋 نظرة عامة

تطوير موقع ويب شامل لنظام إدارة العيادات يشمل:
- **الصفحة الرئيسية** - عرض الخدمات والمميزات
- **صفحة الخدمات** - تفاصيل الخدمات الطبية
- **صفحة الأطباء** - عرض فريق الأطباء
- **صفحة العيادات** - معلومات العيادات
- **صفحة الأسعار** - خطط الاشتراك والأسعار
- **صفحة التواصل** - معلومات التواصل
- **صفحة تسجيل الدخول** - للمرضى والأطباء

---

## 🛠️ التقنيات المستخدمة

### **Frontend Framework**
- **Next.js 14** - إطار عمل React مع SSR وSSG
- **React 18** - مكتبة JavaScript للواجهات التفاعلية
- **TypeScript** - JavaScript مع أنواع البيانات
- **Tailwind CSS** - إطار عمل CSS للتصميم السريع

### **UI Components**
- **Ant Design** - مكتبة مكونات UI جاهزة
- **Framer Motion** - الرسوم المتحركة
- **React Icons** - مكتبة الأيقونات
- **Swiper** - شرائح الصور
- **AOS (Animate On Scroll)** - الرسوم المتحركة عند التمرير

### **Content Management**
- **MDX** - Markdown مع JSX
- **Contentlayer** - إدارة المحتوى
- **Gray-matter** - معالجة البيانات الوصفية

### **SEO & Performance**
- **Next.js SEO** - تحسين محركات البحث
- **Sitemap** - خريطة الموقع
- **Robots.txt** - ملف الروبوتات
- **Open Graph** - مشاركة وسائل التواصل
- **Schema.org** - البيانات المنظمة

### **Analytics & Monitoring**
- **Google Analytics** - تحليل الزوار
- **Google Tag Manager** - إدارة العلامات
- **Hotjar** - تحليل سلوك المستخدمين
- **Sentry** - مراقبة الأخطاء

---

## 🏗️ هيكل الموقع

```
website/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (main)/          # الصفحات الرئيسية
│   │   │   ├── page.tsx     # الصفحة الرئيسية
│   │   │   ├── services/    # صفحة الخدمات
│   │   │   ├── doctors/     # صفحة الأطباء
│   │   │   ├── clinics/     # صفحة العيادات
│   │   │   ├── pricing/     # صفحة الأسعار
│   │   │   ├── about/       # صفحة من نحن
│   │   │   ├── contact/     # صفحة التواصل
│   │   │   └── blog/        # المدونة
│   │   ├── (auth)/          # صفحات المصادقة
│   │   │   ├── login/       # تسجيل الدخول
│   │   │   ├── register/    # التسجيل
│   │   │   └── forgot-password/ # نسيان كلمة المرور
│   │   ├── (dashboard)/     # صفحات لوحة التحكم
│   │   │   ├── patient/     # لوحة تحكم المريض
│   │   │   ├── doctor/      # لوحة تحكم الطبيب
│   │   │   └── admin/       # لوحة تحكم الإدارة
│   │   ├── api/             # API Routes
│   │   ├── globals.css      # ملفات CSS العامة
│   │   ├── layout.tsx       # التخطيط الرئيسي
│   │   └── not-found.tsx    # صفحة 404
│   ├── components/          # مكونات React
│   │   ├── ui/              # مكونات UI أساسية
│   │   ├── layout/          # مكونات التخطيط
│   │   │   ├── Header.tsx   # رأس الموقع
│   │   │   ├── Footer.tsx   # تذييل الموقع
│   │   │   ├── Navigation.tsx # التنقل
│   │   │   └── Sidebar.tsx  # الشريط الجانبي
│   │   ├── sections/        # أقسام الصفحات
│   │   │   ├── Hero.tsx     # قسم البطل
│   │   │   ├── Services.tsx # قسم الخدمات
│   │   │   ├── Features.tsx # قسم المميزات
│   │   │   ├── Testimonials.tsx # قسم الشهادات
│   │   │   ├── Stats.tsx    # قسم الإحصائيات
│   │   │   └── CTA.tsx      # قسم الدعوة للعمل
│   │   ├── forms/           # مكونات النماذج
│   │   ├── cards/           # مكونات البطاقات
│   │   └── common/           # مكونات مشتركة
│   ├── content/             # المحتوى
│   │   ├── services/        # محتوى الخدمات
│   │   ├── doctors/         # محتوى الأطباء
│   │   ├── clinics/         # محتوى العيادات
│   │   └── blog/            # محتوى المدونة
│   ├── lib/                 # مكتبات خارجية
│   │   ├── utils.ts         # أدوات مساعدة
│   │   ├── constants.ts     # الثوابت
│   │   └── validations.ts   # التحقق من البيانات
│   ├── hooks/               # React Hooks
│   ├── types/               # أنواع TypeScript
│   └── styles/              # ملفات CSS
├── public/                  # الملفات العامة
│   ├── images/              # الصور
│   ├── icons/               # الأيقونات
│   ├── videos/              # الفيديوهات
│   └── documents/           # المستندات
├── content/                 # محتوى MDX
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── sitemap.xml
```

---

## 🎨 تصميم الموقع

### **1. الصفحة الرئيسية**

#### **Hero Section**
```typescript
// src/components/sections/Hero.tsx
import React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* المحتوى النصي */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                رعاية طبية
                <span className="text-primary-600 block">
                  متطورة وذكية
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                احجز موعدك بسهولة، احصل على استشارات طبية افتراضية، 
                وأدار صحتك بطريقة ذكية مع نظام إدارة العيادات المتطور
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary-600 text-white hover:bg-primary-700"
              >
                احجز موعدك الآن
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-600 text-primary-600 hover:bg-primary-50"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                شاهد الفيديو
              </Button>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">500+</div>
                <div className="text-sm text-gray-600">طبيب متخصص</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">10K+</div>
                <div className="text-sm text-gray-600">مريض راضٍ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">50+</div>
                <div className="text-sm text-gray-600">عيادة شريكة</div>
              </div>
            </div>
          </div>

          {/* الصورة أو الفيديو */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-dashboard.jpg"
                alt="لوحة تحكم النظام"
                width={600}
                height={400}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* بطاقة عائمة */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">موعد مؤكد</div>
                  <div className="text-sm text-gray-600">د. أحمد محمد - 2:00 م</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
```

#### **Services Section**
```typescript
// src/components/sections/Services.tsx
import React from 'react';
import { Card } from '@/components/ui/Card';
import { 
  CalendarDaysIcon, 
  VideoCameraIcon, 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const services = [
  {
    icon: CalendarDaysIcon,
    title: 'حجز المواعيد',
    description: 'احجز موعدك بسهولة مع أفضل الأطباء في أي وقت ومن أي مكان',
    features: ['حجز فوري', 'تذكيرات ذكية', 'إعادة الجدولة']
  },
  {
    icon: VideoCameraIcon,
    title: 'استشارات فيديو',
    description: 'احصل على استشارة طبية مباشرة مع طبيبك المختص عبر الفيديو',
    features: ['جودة عالية', 'تسجيل الجلسة', 'مشاركة الشاشة']
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'دردشة طبية',
    description: 'تواصل مع طبيبك عبر الدردشة للحصول على استشارات سريعة',
    features: ['رد فوري', 'مشاركة الملفات', 'تاريخ المحادثات']
  },
  {
    icon: DocumentTextIcon,
    title: 'الملف الطبي',
    description: 'احتفظ بملفك الطبي الكامل وتاريخك المرضي في مكان آمن',
    features: ['تشفير آمن', 'نسخ احتياطي', 'مشاركة مع الأطباء']
  },
  {
    icon: ClockIcon,
    title: 'مواعيد الطوارئ',
    description: 'احجز موعد طوارئ في أي وقت للحالات العاجلة',
    features: ['استجابة سريعة', 'أطباء متاحين 24/7', 'أولوية عالية']
  },
  {
    icon: ShieldCheckIcon,
    title: 'أمان البيانات',
    description: 'بياناتك الطبية محمية بأعلى معايير الأمان والخصوصية',
    features: ['تشفير متقدم', 'امتثال GDPR', 'مراجعة أمنية']
  }
];

export const Services: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            خدماتنا الطبية المتطورة
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نقدم مجموعة شاملة من الخدمات الطبية الرقمية لضمان حصولك على أفضل رعاية صحية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <service.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2 text-sm text-gray-500">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
```

### **2. صفحة الخدمات**

#### **Services Page**
```typescript
// src/app/(main)/services/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { ServicesHero } from '@/components/sections/ServicesHero';
import { ServicesList } from '@/components/sections/ServicesList';
import { PricingSection } from '@/components/sections/PricingSection';
import { FAQSection } from '@/components/sections/FAQSection';

export const metadata: Metadata = {
  title: 'خدماتنا الطبية | نظام إدارة العيادات',
  description: 'اكتشف خدماتنا الطبية المتطورة من حجز المواعيد إلى الاستشارات الافتراضية',
  keywords: 'خدمات طبية, حجز مواعيد, استشارات طبية, رعاية صحية',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <ServicesHero />
      <ServicesList />
      <PricingSection />
      <FAQSection />
    </div>
  );
}
```

### **3. صفحة الأطباء**

#### **Doctors Page**
```typescript
// src/app/(main)/doctors/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { DoctorsHero } from '@/components/sections/DoctorsHero';
import { DoctorsGrid } from '@/components/sections/DoctorsGrid';
import { SpecializationsSection } from '@/components/sections/SpecializationsSection';
import { BookAppointmentCTA } from '@/components/sections/BookAppointmentCTA';

export const metadata: Metadata = {
  title: 'فريق الأطباء | نظام إدارة العيادات',
  description: 'تعرف على فريق الأطباء المتخصصين لدينا واختر الطبيب المناسب لك',
  keywords: 'أطباء, تخصصات طبية, استشارات طبية, فريق طبي',
};

export default function DoctorsPage() {
  return (
    <div className="min-h-screen">
      <DoctorsHero />
      <SpecializationsSection />
      <DoctorsGrid />
      <BookAppointmentCTA />
    </div>
  );
}
```

#### **Doctor Card Component**
```typescript
// src/components/cards/DoctorCard.tsx
import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StarIcon } from '@heroicons/react/24/solid';

interface DoctorCardProps {
  doctor: {
    id: string;
    name: string;
    specialization: string;
    experience: number;
    rating: number;
    reviews: number;
    image: string;
    languages: string[];
    availability: string;
  };
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <Image
            src={doctor.image}
            alt={doctor.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {doctor.name}
        </h3>
        
        <p className="text-primary-600 font-medium mb-2">
          {doctor.specialization}
        </p>
        
        <p className="text-gray-600 text-sm mb-4">
          {doctor.experience} سنوات خبرة
        </p>
        
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(doctor.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            ({doctor.reviews} تقييم)
          </span>
        </div>
        
        <div className="space-y-2 mb-6">
          <div className="text-sm text-gray-600">
            <span className="font-medium">اللغات:</span> {doctor.languages.join(', ')}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">متاح:</span> {doctor.availability}
          </div>
        </div>
        
        <Button className="w-full">
          احجز موعد
        </Button>
      </div>
    </Card>
  );
};
```

### **4. صفحة الأسعار**

#### **Pricing Page**
```typescript
// src/app/(main)/pricing/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { PricingHero } from '@/components/sections/PricingHero';
import { PricingPlans } from '@/components/sections/PricingPlans';
import { PricingFAQ } from '@/components/sections/PricingFAQ';
import { ContactSales } from '@/components/sections/ContactSales';

export const metadata: Metadata = {
  title: 'الأسعار والخطط | نظام إدارة العيادات',
  description: 'اختر الخطة المناسبة لك من خططنا المتنوعة للاستفادة من خدماتنا الطبية',
  keywords: 'أسعار, خطط, اشتراك, خدمات طبية, تكلفة',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <PricingHero />
      <PricingPlans />
      <PricingFAQ />
      <ContactSales />
    </div>
  );
}
```

#### **Pricing Plans Component**
```typescript
// src/components/sections/PricingPlans.tsx
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckIcon } from '@heroicons/react/24/outline';

const plans = [
  {
    name: 'الخطة الأساسية',
    price: '29',
    period: 'شهرياً',
    description: 'مناسبة للأفراد والاستخدام الشخصي',
    features: [
      'حجز مواعيد غير محدود',
      'استشارات فيديو (5 جلسات/شهر)',
      'دردشة طبية',
      'ملف طبي أساسي',
      'تذكيرات المواعيد',
      'دعم فني'
    ],
    popular: false,
    cta: 'ابدأ الآن'
  },
  {
    name: 'الخطة المتقدمة',
    price: '59',
    period: 'شهرياً',
    description: 'مناسبة للعائلات والاستخدام المتقدم',
    features: [
      'حجز مواعيد غير محدود',
      'استشارات فيديو غير محدودة',
      'دردشة طبية متقدمة',
      'ملف طبي شامل',
      'تذكيرات ذكية',
      'دعم أولوية',
      'تقارير صحية',
      'تذكير بالأدوية'
    ],
    popular: true,
    cta: 'الأكثر شعبية'
  },
  {
    name: 'الخطة المؤسسية',
    price: '199',
    period: 'شهرياً',
    description: 'مناسبة للعيادات والمؤسسات الطبية',
    features: [
      'إدارة متعددة المستخدمين',
      'لوحة تحكم شاملة',
      'تقارير وإحصائيات متقدمة',
      'تكامل مع الأنظمة الأخرى',
      'دعم مخصص 24/7',
      'تدريب الفريق',
      'تخصيص الواجهة',
      'نسخ احتياطي يومي'
    ],
    popular: false,
    cta: 'تواصل معنا'
  }
];

export const PricingPlans: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            اختر الخطة المناسبة لك
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            خطط مرنة تناسب جميع احتياجاتك الطبية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`p-8 relative ${
                plan.popular 
                  ? 'ring-2 ring-primary-500 shadow-xl scale-105' 
                  : 'hover:shadow-lg'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    الأكثر شعبية
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">
                    /{plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            جميع الخطط تشمل ضمان استرداد الأموال لمدة 30 يوم
          </p>
          <p className="text-sm text-gray-500">
            * الأسعار لا تشمل الضرائب
          </p>
        </div>
      </div>
    </section>
  );
};
```

### **5. صفحة التواصل**

#### **Contact Page**
```typescript
// src/app/(main)/contact/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { ContactHero } from '@/components/sections/ContactHero';
import { ContactForm } from '@/components/forms/ContactForm';
import { ContactInfo } from '@/components/sections/ContactInfo';
import { MapSection } from '@/components/sections/MapSection';

export const metadata: Metadata = {
  title: 'تواصل معنا | نظام إدارة العيادات',
  description: 'تواصل معنا للحصول على الدعم الفني أو الاستفسارات حول خدماتنا',
  keywords: 'تواصل, دعم فني, استفسارات, خدمة العملاء',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <ContactHero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
      <MapSection />
    </div>
  );
}
```

#### **Contact Form Component**
```typescript
// src/components/forms/ContactForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';

const contactSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(10, 'رقم الهاتف مطلوب'),
  subject: z.string().min(1, 'الموضوع مطلوب'),
  message: z.string().min(10, 'الرسالة مطلوبة'),
  inquiryType: z.string().min(1, 'نوع الاستفسار مطلوب'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const inquiryTypes = [
  { value: 'general', label: 'استفسار عام' },
  { value: 'technical', label: 'دعم فني' },
  { value: 'billing', label: 'الفوترة والدفع' },
  { value: 'partnership', label: 'شراكة' },
  { value: 'other', label: 'أخرى' },
];

export const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // إرسال البيانات إلى API
      console.log('Form data:', data);
      // await contactService.submitContactForm(data);
      reset();
      // إظهار رسالة نجاح
    } catch (error) {
      console.error('Error submitting form:', error);
      // إظهار رسالة خطأ
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        أرسل لنا رسالة
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="الاسم الكامل"
            {...register('name')}
            error={errors.name?.message}
            placeholder="أدخل اسمك الكامل"
          />
          
          <Input
            label="البريد الإلكتروني"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="example@email.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="رقم الهاتف"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="+966 50 123 4567"
          />
          
          <Select
            label="نوع الاستفسار"
            {...register('inquiryType')}
            error={errors.inquiryType?.message}
            options={inquiryTypes}
          />
        </div>

        <Input
          label="الموضوع"
          {...register('subject')}
          error={errors.subject?.message}
          placeholder="موضوع رسالتك"
        />

        <Textarea
          label="الرسالة"
          {...register('message')}
          error={errors.message?.message}
          placeholder="اكتب رسالتك هنا..."
          rows={5}
        />

        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full bg-primary-600 text-white hover:bg-primary-700"
        >
          إرسال الرسالة
        </Button>
      </form>
    </div>
  );
};
```

---

## 🔍 تحسين محركات البحث (SEO)

### **1. Metadata Configuration**
```typescript
// src/lib/metadata.ts
import { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: {
    default: 'نظام إدارة العيادات | رعاية طبية ذكية',
    template: '%s | نظام إدارة العيادات'
  },
  description: 'نظام إدارة العيادات المتطور يوفر حجز المواعيد والاستشارات الطبية الافتراضية مع أفضل الأطباء',
  keywords: [
    'نظام إدارة العيادات',
    'حجز مواعيد طبية',
    'استشارات طبية',
    'رعاية صحية',
    'أطباء',
    'عيادات'
  ],
  authors: [{ name: 'نظام إدارة العيادات' }],
  creator: 'نظام إدارة العيادات',
  publisher: 'نظام إدارة العيادات',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://clinic.example.com'),
  alternates: {
    canonical: '/',
    languages: {
      'ar-SA': '/ar',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://clinic.example.com',
    title: 'نظام إدارة العيادات | رعاية طبية ذكية',
    description: 'نظام إدارة العيادات المتطور يوفر حجز المواعيد والاستشارات الطبية الافتراضية',
    siteName: 'نظام إدارة العيادات',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'نظام إدارة العيادات',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'نظام إدارة العيادات | رعاية طبية ذكية',
    description: 'نظام إدارة العيادات المتطور يوفر حجز المواعيد والاستشارات الطبية الافتراضية',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

### **2. Sitemap Generation**
```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://clinic.example.com';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/doctors`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/clinics`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}
```

### **3. Robots.txt**
```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/'],
    },
    sitemap: 'https://clinic.example.com/sitemap.xml',
  };
}
```

---

## 📊 التحليلات والمراقبة

### **1. Google Analytics Setup**
```typescript
// src/lib/analytics.ts
import { GoogleAnalytics } from '@next/third-parties/google';

export const Analytics = () => {
  return (
    <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
  );
};
```

### **2. Custom Analytics Events**
```typescript
// src/lib/analytics-events.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// استخدام الأحداث
export const trackAppointmentBooking = () => {
  trackEvent('appointment_booking', 'engagement', 'book_appointment');
};

export const trackVideoConsultation = () => {
  trackEvent('video_consultation', 'engagement', 'start_consultation');
};
```

---

## 🎨 التصميم والرسوم المتحركة

### **1. Framer Motion Animations**
```typescript
// src/components/animations/FadeInUp.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface FadeInUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const FadeInUp: React.FC<FadeInUpProps> = ({ 
  children, 
  delay = 0, 
  duration = 0.6 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
};
```

### **2. AOS (Animate On Scroll)**
```typescript
// src/lib/aos.ts
import AOS from 'aos';
import 'aos/dist/aos.css';

export const initAOS = () => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100,
  });
};
```

---

## 📱 دعم اللغات المتعددة

### **1. i18n Configuration**
```typescript
// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: 'ar',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

### **2. Language Switcher**
```typescript
// src/components/common/LanguageSwitcher.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="flex items-center space-x-2"
    >
      <GlobeAltIcon className="w-4 h-4" />
      <span>{i18n.language === 'ar' ? 'English' : 'العربية'}</span>
    </Button>
  );
};
```

---

## 🧪 الاختبارات

### **1. Component Testing**
```typescript
// src/components/__tests__/Hero.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Hero } from '../sections/Hero';

describe('Hero Component', () => {
  it('renders hero section with title and description', () => {
    render(<Hero />);
    
    expect(screen.getByText(/رعاية طبية متطورة وذكية/)).toBeInTheDocument();
    expect(screen.getByText(/احجز موعدك بسهولة/)).toBeInTheDocument();
  });

  it('renders call-to-action buttons', () => {
    render(<Hero />);
    
    expect(screen.getByText('احجز موعدك الآن')).toBeInTheDocument();
    expect(screen.getByText('شاهد الفيديو')).toBeInTheDocument();
  });
});
```

### **2. Page Testing**
```typescript
// src/app/__tests__/services/page.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ServicesPage from '../services/page';

describe('Services Page', () => {
  it('renders services page with correct title', () => {
    render(<ServicesPage />);
    
    expect(screen.getByText('خدماتنا الطبية المتطورة')).toBeInTheDocument();
  });
});
```

---

## 📝 ملاحظات مهمة

1. **الأداء**: تحسين سرعة التحميل مع Next.js Image وLazy Loading
2. **SEO**: تطبيق أفضل ممارسات تحسين محركات البحث
3. **إمكانية الوصول**: تطبيق معايير WCAG للوصولية
4. **الأمان**: حماية من XSS وCSRF attacks
5. **الاستجابة**: تصميم متجاوب لجميع الأجهزة
6. **الاختبار**: اختبار شامل للمكونات والصفحات

---

*تم إعداد هذه الخطة لضمان تطوير موقع ويب احترافي ومتطور*
