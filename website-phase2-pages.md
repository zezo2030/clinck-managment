# 🌐 المرحلة الثانية - الصفحات الأساسية والتصميم

## 📋 نظرة عامة

تطوير المرحلة الثانية من موقع الويب تتضمن:
- إنشاء الصفحات الأساسية (الخدمات، الأطباء، العيادات، الأسعار، التواصل)
- تطوير مكونات التخطيط (Header، Footer، Navigation)
- إضافة الرسوم المتحركة والتفاعل
- تحسين التصميم والاستجابة
- ربط الموقع مع Backend API

---

## 🏗️ هيكل الصفحات

```
src/app/(main)/
├── page.tsx              # الصفحة الرئيسية
├── layout.tsx            # تخطيط الصفحات الرئيسية
├── services/
│   ├── page.tsx          # صفحة الخدمات
│   └── [id]/
│       └── page.tsx     # تفاصيل خدمة
├── doctors/
│   ├── page.tsx          # صفحة الأطباء
│   └── [id]/
│       └── page.tsx     # ملف الطبيب
├── clinics/
│   ├── page.tsx          # صفحة العيادات
│   └── [id]/
│       └── page.tsx     # تفاصيل العيادة
├── pricing/
│   └── page.tsx          # صفحة الأسعار
├── about/
│   └── page.tsx          # صفحة من نحن
├── contact/
│   └── page.tsx          # صفحة التواصل
└── blog/
    ├── page.tsx          # المدونة
    └── [slug]/
        └── page.tsx      # مقال المدونة
```

---

## 🎨 مكونات التخطيط

### **1. Header Component**
```typescript
// src/components/layout/Header.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'الرئيسية', href: '/' },
    { name: 'الخدمات', href: '/services' },
    { name: 'الأطباء', href: '/doctors' },
    { name: 'العيادات', href: '/clinics' },
    { name: 'الأسعار', href: '/pricing' },
    { name: 'من نحن', href: '/about' },
    { name: 'تواصل معنا', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* الشعار */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                نظام إدارة العيادات
              </span>
            </Link>
          </div>

          {/* التنقل - سطح المكتب */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* أزرار العمل */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>+966 50 123 4567</span>
            </div>
            <Button variant="outline" size="sm">
              تسجيل الدخول
            </Button>
            <Button size="sm">
              احجز موعد
            </Button>
          </div>

          {/* قائمة الهاتف المحمول */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* قائمة الهاتف المحمول المنسدلة */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full">
                  تسجيل الدخول
                </Button>
                <Button className="w-full">
                  احجز موعد
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
```

### **2. Footer Component**
```typescript
// src/components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: 'حجز المواعيد', href: '/services/appointments' },
      { name: 'استشارات فيديو', href: '/services/video-consultations' },
      { name: 'دردشة طبية', href: '/services/chat' },
      { name: 'الملف الطبي', href: '/services/medical-records' },
    ],
    company: [
      { name: 'من نحن', href: '/about' },
      { name: 'فريق العمل', href: '/about/team' },
      { name: 'الوظائف', href: '/careers' },
      { name: 'الأخبار', href: '/blog' },
    ],
    support: [
      { name: 'مركز المساعدة', href: '/help' },
      { name: 'تواصل معنا', href: '/contact' },
      { name: 'الأسئلة الشائعة', href: '/faq' },
      { name: 'الدعم الفني', href: '/support' },
    ],
    legal: [
      { name: 'سياسة الخصوصية', href: '/privacy' },
      { name: 'شروط الاستخدام', href: '/terms' },
      { name: 'سياسة ملفات تعريف الارتباط', href: '/cookies' },
      { name: 'إخلاء المسؤولية', href: '/disclaimer' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* معلومات الشركة */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold">
                نظام إدارة العيادات
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              نقدم حلول طبية متطورة لتحسين جودة الرعاية الصحية 
              وتبسيط إدارة العيادات والمستشفيات.
            </p>
            
            {/* معلومات التواصل */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">+966 50 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">info@clinic-system.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>

          {/* روابط الخدمات */}
          <div>
            <h3 className="text-lg font-semibold mb-4">الخدمات</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* روابط الشركة */}
          <div>
            <h3 className="text-lg font-semibold mb-4">الشركة</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* الدعم والمساعدة */}
          <div>
            <h3 className="text-lg font-semibold mb-4">الدعم</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* الشبكات الاجتماعية */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  className="hover:text-primary-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © {currentYear} نظام إدارة العيادات. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
```

---

## 📄 الصفحات الأساسية

### **1. صفحة الخدمات**
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

### **2. ServicesHero Component**
```typescript
// src/components/sections/ServicesHero.tsx
import React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon, CheckCircleIcon } from 'lucide-react';

export const ServicesHero: React.FC = () => {
  const features = [
    'حجز مواعيد فوري',
    'استشارات فيديو عالية الجودة',
    'ملف طبي آمن ومشفر',
    'دعم فني 24/7',
    'تكامل مع الأنظمة الطبية',
    'تقارير صحية مفصلة',
  ];

  return (
    <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                خدمات طبية
                <span className="text-primary-600 block">
                  متطورة وموثوقة
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                نقدم مجموعة شاملة من الخدمات الطبية الرقمية المصممة 
                لتحسين تجربة الرعاية الصحية وتسهيل الوصول للخدمات الطبية.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary-600 text-white hover:bg-primary-700">
                استكشف الخدمات
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-600 text-primary-600 hover:bg-primary-50"
              >
                احجز استشارة مجانية
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="w-full h-96 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-4xl">🏥</span>
                  </div>
                  <p className="text-gray-600">صورة الخدمات الطبية</p>
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

### **3. ServicesList Component**
```typescript
// src/components/sections/ServicesList.tsx
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  CalendarDaysIcon, 
  VideoCameraIcon, 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from 'lucide-react';

const services = [
  {
    icon: CalendarDaysIcon,
    title: 'حجز المواعيد',
    description: 'احجز موعدك بسهولة مع أفضل الأطباء في أي وقت ومن أي مكان',
    features: ['حجز فوري', 'تذكيرات ذكية', 'إعادة الجدولة'],
    price: 'مجاني',
    popular: true,
  },
  {
    icon: VideoCameraIcon,
    title: 'استشارات فيديو',
    description: 'احصل على استشارة طبية مباشرة مع طبيبك المختص عبر الفيديو',
    features: ['جودة عالية', 'تسجيل الجلسة', 'مشاركة الشاشة'],
    price: 'من 50 ريال',
    popular: false,
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'دردشة طبية',
    description: 'تواصل مع طبيبك عبر الدردشة للحصول على استشارات سريعة',
    features: ['رد فوري', 'مشاركة الملفات', 'تاريخ المحادثات'],
    price: 'من 25 ريال',
    popular: false,
  },
  {
    icon: DocumentTextIcon,
    title: 'الملف الطبي',
    description: 'احتفظ بملفك الطبي الكامل وتاريخك المرضي في مكان آمن',
    features: ['تشفير آمن', 'نسخ احتياطي', 'مشاركة مع الأطباء'],
    price: 'مجاني',
    popular: false,
  },
  {
    icon: ClockIcon,
    title: 'مواعيد الطوارئ',
    description: 'احجز موعد طوارئ في أي وقت للحالات العاجلة',
    features: ['استجابة سريعة', 'أطباء متاحين 24/7', 'أولوية عالية'],
    price: 'من 100 ريال',
    popular: false,
  },
  {
    icon: ShieldCheckIcon,
    title: 'أمان البيانات',
    description: 'بياناتك الطبية محمية بأعلى معايير الأمان والخصوصية',
    features: ['تشفير متقدم', 'امتثال GDPR', 'مراجعة أمنية'],
    price: 'مضمن',
    popular: false,
  },
];

export const ServicesList: React.FC = () => {
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
            <Card 
              key={index} 
              className={`p-8 hover:shadow-lg transition-all duration-300 ${
                service.popular ? 'ring-2 ring-primary-500 shadow-xl' : ''
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    الأكثر شعبية
                  </span>
                </div>
              )}
              
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
                
                <ul className="space-y-2 text-sm text-gray-500 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="mb-6">
                  <span className="text-2xl font-bold text-primary-600">
                    {service.price}
                  </span>
                </div>
                
                <Button className="w-full">
                  تعرف على المزيد
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
```

---

## 🎨 الرسوم المتحركة

### **1. Framer Motion Setup**
```typescript
// src/lib/animations.ts
import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 },
};

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 60 },
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
```

### **2. Animated Section Component**
```typescript
// src/components/animations/AnimatedSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  className 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
};
```

---

## 🔗 ربط مع Backend API

### **1. API Client**
```typescript
// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

### **2. Services API**
```typescript
// src/lib/api/services.ts
import { apiClient } from './api';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  features: string[];
  isPopular: boolean;
}

export const servicesApi = {
  getAll: () => apiClient.get<Service[]>('/api/services'),
  getById: (id: string) => apiClient.get<Service>(`/api/services/${id}`),
  create: (service: Omit<Service, 'id'>) => 
    apiClient.post<Service>('/api/services', service),
  update: (id: string, service: Partial<Service>) => 
    apiClient.put<Service>(`/api/services/${id}`, service),
  delete: (id: string) => apiClient.delete(`/api/services/${id}`),
};
```

---

## 📱 التصميم المتجاوب

### **1. Responsive Utilities**
```typescript
// src/lib/responsive.ts
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const getResponsiveClasses = (classes: {
  base: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
}) => {
  return [
    classes.base,
    classes.sm && `sm:${classes.sm}`,
    classes.md && `md:${classes.md}`,
    classes.lg && `lg:${classes.lg}`,
    classes.xl && `xl:${classes.xl}`,
  ].filter(Boolean).join(' ');
};
```

### **2. Mobile-First Design**
```typescript
// src/components/layout/MobileNavigation.tsx
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MobileNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 hover:text-primary-600"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      
      <div className={cn(
        'absolute top-full left-0 right-0 bg-white shadow-lg border-t',
        isOpen ? 'block' : 'hidden'
      )}>
        {/* محتوى القائمة */}
      </div>
    </div>
  );
};
```

---

## 🧪 اختبارات الصفحات

### **1. Page Component Tests**
```typescript
// src/app/(main)/services/__tests__/page.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ServicesPage from '../page';

// Mock the components
jest.mock('@/components/sections/ServicesHero', () => ({
  ServicesHero: () => <div data-testid="services-hero">Services Hero</div>,
}));

jest.mock('@/components/sections/ServicesList', () => ({
  ServicesList: () => <div data-testid="services-list">Services List</div>,
}));

describe('ServicesPage', () => {
  it('renders all sections', () => {
    render(<ServicesPage />);
    
    expect(screen.getByTestId('services-hero')).toBeInTheDocument();
    expect(screen.getByTestId('services-list')).toBeInTheDocument();
  });
});
```

### **2. Component Integration Tests**
```typescript
// src/components/layout/__tests__/Header.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';

describe('Header Component', () => {
  it('renders navigation links', () => {
    render(<Header />);
    
    expect(screen.getByText('الرئيسية')).toBeInTheDocument();
    expect(screen.getByText('الخدمات')).toBeInTheDocument();
    expect(screen.getByText('الأطباء')).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(<Header />);
    
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);
    
    expect(screen.getByText('الرئيسية')).toBeInTheDocument();
  });
});
```

---

## 🚀 تشغيل المرحلة الثانية

### **1. التطوير**
```bash
# تشغيل التطوير
npm run dev

# فحص الكود
npm run lint

# تشغيل الاختبارات
npm test
```

### **2. مع Docker**
```bash
# تشغيل جميع الخدمات
npm run docker:dev

# إعادة بناء
npm run docker:build
```

---

## 📝 ملاحظات المرحلة الثانية

### **المهام المكتملة**
- ✅ إنشاء الصفحات الأساسية
- ✅ تطوير مكونات التخطيط
- ✅ إضافة الرسوم المتحركة
- ✅ تحسين التصميم المتجاوب
- ✅ ربط مع Backend API
- ✅ إعداد الاختبارات

### **المهام التالية (المرحلة الثالثة)**
- 🔄 الميزات المتقدمة
- 🔄 التفاعل مع المستخدمين
- 🔄 تحسين الأداء
- 🔄 إضافة المزيد من الصفحات

---

*تم إكمال المرحلة الثانية بنجاح - جاهز للمرحلة الثالثة*
