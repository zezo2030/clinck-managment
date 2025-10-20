# 🎨 خطة تطوير الفرونت إند والداشبورد

## 📋 نظرة عامة

تطوير واجهات المستخدم لنظام إدارة العيادات يشمل:
- **Next.js Web App** - موقع الويب للمرضى والأطباء
- **React Dashboard** - لوحة تحكم إدارة العيادة
- **Mobile Apps** - تطبيقات محمولة (Flutter)

---

## 🛠️ التقنيات المستخدمة

### **Next.js Web App (موقع الويب)**
- **Next.js 14** - إطار عمل React مع SSR وSSG
- **React 18** - مكتبة JavaScript للواجهات التفاعلية
- **TypeScript** - JavaScript مع أنواع البيانات
- **Tailwind CSS** - إطار عمل CSS للتصميم السريع
- **Ant Design** - مكتبة مكونات UI جاهزة
- **React Query** - إدارة البيانات والحالة
- **Socket.io Client** - الاتصال المباشر
- **NextAuth.js** - المصادقة
- **React Hook Form** - إدارة النماذج
- **Framer Motion** - الرسوم المتحركة

### **React Dashboard (لوحة التحكم)**
- **React 18** - مكتبة JavaScript للواجهات التفاعلية
- **Vite** - أداة بناء سريعة للتطوير
- **TypeScript** - JavaScript مع أنواع البيانات
- **Tailwind CSS** - إطار عمل CSS للتصميم السريع
- **Ant Design** - مكتبة مكونات UI جاهزة
- **React Query** - إدارة البيانات والحالة
- **Socket.io Client** - الاتصال المباشر
- **Chart.js** - الرسوم البيانية والإحصائيات
- **React Router** - التنقل في التطبيق
- **React Hook Form** - إدارة النماذج
- **React Table** - جداول البيانات
- **React Date Picker** - اختيار التواريخ

---

## 🏗️ هيكل المشروع

```
clinic-management-system/
├── frontend/                 # Next.js Web App
│   ├── src/
│   │   ├── app/             # App Router (Next.js 14)
│   │   │   ├── (auth)/      # صفحات المصادقة
│   │   │   ├── (dashboard)/ # صفحات لوحة التحكم
│   │   │   ├── (patient)/   # صفحات المرضى
│   │   │   ├── (doctor)/    # صفحات الأطباء
│   │   │   ├── api/         # API Routes
│   │   │   ├── globals.css  # ملفات CSS العامة
│   │   │   └── layout.tsx   # التخطيط الرئيسي
│   │   ├── components/      # مكونات React
│   │   │   ├── ui/          # مكونات UI أساسية
│   │   │   ├── forms/       # مكونات النماذج
│   │   │   ├── charts/      # مكونات الرسوم البيانية
│   │   │   ├── layout/     # مكونات التخطيط
│   │   │   └── common/     # مكونات مشتركة
│   │   ├── hooks/           # React Hooks
│   │   ├── services/        # خدمات API
│   │   ├── utils/           # أدوات مساعدة
│   │   ├── types/           # أنواع TypeScript
│   │   └── lib/             # مكتبات خارجية
│   ├── public/              # الملفات العامة
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
├── dashboard/               # React Dashboard
│   ├── src/
│   │   ├── components/      # مكونات React
│   │   │   ├── ui/          # مكونات UI أساسية
│   │   │   ├── forms/       # مكونات النماذج
│   │   │   ├── charts/      # مكونات الرسوم البيانية
│   │   │   ├── tables/      # مكونات الجداول
│   │   │   ├── layout/      # مكونات التخطيط
│   │   │   └── common/      # مكونات مشتركة
│   │   ├── pages/           # صفحات Dashboard
│   │   │   ├── auth/        # صفحات المصادقة
│   │   │   ├── dashboard/   # الصفحة الرئيسية
│   │   │   ├── appointments/ # إدارة المواعيد
│   │   │   ├── doctors/     # إدارة الأطباء
│   │   │   ├── patients/    # إدارة المرضى
│   │   │   ├── clinics/     # إدارة العيادات
│   │   │   ├── payments/    # إدارة المدفوعات
│   │   │   ├── reports/     # التقارير والإحصائيات
│   │   │   └── settings/    # الإعدادات
│   │   ├── hooks/           # React Hooks
│   │   ├── services/        # خدمات API
│   │   ├── utils/           # أدوات مساعدة
│   │   ├── types/           # أنواع TypeScript
│   │   └── lib/             # مكتبات خارجية
│   ├── public/              # الملفات العامة
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
└── mobile/                  # Flutter Apps
    ├── patient-app/         # تطبيق المرضى
    └── doctor-app/          # تطبيق الأطباء
```

---

## 🚀 مراحل التطوير

## **المرحلة الأولى: إعداد البيئة (أسابيع 1-2)**

### **1.1 إعداد Next.js Web App**
```bash
# إنشاء مشروع Next.js
npx create-next-app@latest frontend --typescript --tailwind --eslint --app
cd frontend

# تثبيت الحزم المطلوبة
npm install @ant-design/nextjs-registry antd
npm install @tanstack/react-query
npm install socket.io-client
npm install next-auth
npm install react-hook-form @hookform/resolvers
npm install framer-motion
npm install @types/node
npm install axios
npm install date-fns
npm install react-datepicker
npm install @types/react-datepicker
```

### **1.2 إعداد React Dashboard**
```bash
# إنشاء مشروع React مع Vite
npm create vite@latest dashboard -- --template react-ts
cd dashboard

# تثبيت الحزم المطلوبة
npm install antd
npm install @tanstack/react-query
npm install socket.io-client
npm install react-router-dom
npm install react-hook-form @hookform/resolvers
npm install chart.js react-chartjs-2
npm install @tanstack/react-table
npm install react-datepicker
npm install @types/react-datepicker
npm install axios
npm install date-fns
npm install framer-motion
```

### **1.3 إعداد Tailwind CSS**
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

---

## **المرحلة الثانية: المكونات الأساسية (أسابيع 3-4)**

### **2.1 مكونات UI الأساسية**

#### **Button Component**
```typescript
// src/components/ui/Button.tsx
import React from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';
import { cn } from '@/lib/utils';

interface ButtonProps extends AntButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = 'font-medium transition-colors';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'text-primary-600 hover:bg-primary-50',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <AntButton
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </AntButton>
  );
};
```

#### **Input Component**
```typescript
// src/components/ui/Input.tsx
import React from 'react';
import { Input as AntInput, InputProps as AntInputProps } from 'antd';
import { cn } from '@/lib/utils';

interface InputProps extends AntInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <AntInput
        className={cn(
          'w-full',
          error && 'border-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
```

### **2.2 مكونات النماذج**

#### **Appointment Form**
```typescript
// src/components/forms/AppointmentForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const appointmentSchema = z.object({
  doctorId: z.string().min(1, 'الطبيب مطلوب'),
  appointmentDate: z.string().min(1, 'التاريخ مطلوب'),
  appointmentTime: z.string().min(1, 'الوقت مطلوب'),
  reason: z.string().min(10, 'سبب الزيارة مطلوب'),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => void;
  doctors: Array<{ id: string; name: string; specialization: string }>;
  availableSlots: string[];
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  onSubmit,
  doctors,
  availableSlots,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const selectedDoctor = watch('doctorId');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="الطبيب"
          {...register('doctorId')}
          error={errors.doctorId?.message}
          options={doctors.map(doctor => ({
            value: doctor.id,
            label: `${doctor.name} - ${doctor.specialization}`,
          }))}
        />

        <Input
          label="التاريخ"
          type="date"
          {...register('appointmentDate')}
          error={errors.appointmentDate?.message}
        />
      </div>

      <Select
        label="الوقت"
        {...register('appointmentTime')}
        error={errors.appointmentTime?.message}
        options={availableSlots.map(slot => ({
          value: slot,
          label: slot,
        }))}
      />

      <Input
        label="سبب الزيارة"
        {...register('reason')}
        error={errors.reason?.message}
        placeholder="اكتب سبب الزيارة..."
      />

      <Input
        label="ملاحظات إضافية"
        {...register('notes')}
        error={errors.notes?.message}
        placeholder="أي ملاحظات إضافية..."
      />

      <Button
        type="submit"
        loading={isSubmitting}
        className="w-full"
      >
        حجز الموعد
      </Button>
    </form>
  );
};
```

---

## **المرحلة الثالثة: صفحات Next.js (أسابيع 5-6)**

### **3.1 صفحة حجز المواعيد**

#### **Appointment Booking Page**
```typescript
// src/app/(patient)/appointments/book/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppointmentForm } from '@/components/forms/AppointmentForm';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { appointmentService } from '@/services/appointmentService';

export default function BookAppointmentPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // جلب قائمة الأطباء
  const { data: doctors, isLoading: doctorsLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: appointmentService.getDoctors,
  });

  // جلب الأوقات المتاحة
  const { data: availableSlots, isLoading: slotsLoading } = useQuery({
    queryKey: ['availableSlots', selectedDoctor, selectedDate],
    queryFn: () => appointmentService.getAvailableSlots(selectedDoctor, selectedDate),
    enabled: !!selectedDoctor && !!selectedDate,
  });

  const handleSubmit = async (data: any) => {
    try {
      await appointmentService.bookAppointment(data);
      // إعادة توجيه أو إظهار رسالة نجاح
    } catch (error) {
      // معالجة الخطأ
    }
  };

  if (doctorsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            حجز موعد جديد
          </h1>
          <p className="text-gray-600 mt-2">
            اختر الطبيب والوقت المناسب لك
          </p>
        </div>

        <Card className="p-6">
          <AppointmentForm
            onSubmit={handleSubmit}
            doctors={doctors || []}
            availableSlots={availableSlots || []}
          />
        </Card>
      </div>
    </div>
  );
}
```

### **3.2 صفحة الاستشارات الافتراضية**

#### **Virtual Consultation Page**
```typescript
// src/app/(patient)/consultations/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { VideoCall } from '@/components/consultation/VideoCall';
import { ChatInterface } from '@/components/consultation/ChatInterface';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { consultationService } from '@/services/consultationService';

export default function ConsultationPage() {
  const params = useParams();
  const consultationId = params.id as string;
  const [activeTab, setActiveTab] = useState<'video' | 'chat'>('video');

  const { data: consultation, isLoading } = useQuery({
    queryKey: ['consultation', consultationId],
    queryFn: () => consultationService.getConsultation(consultationId),
  });

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            الاستشارة الطبية الافتراضية
          </h1>
          <p className="text-gray-600">
            مع د. {consultation?.doctor?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* منطقة الفيديو */}
          <div className="lg:col-span-2">
            <Card className="p-4">
              <div className="flex space-x-4 mb-4">
                <Button
                  variant={activeTab === 'video' ? 'primary' : 'outline'}
                  onClick={() => setActiveTab('video')}
                >
                  مكالمة فيديو
                </Button>
                <Button
                  variant={activeTab === 'chat' ? 'primary' : 'outline'}
                  onClick={() => setActiveTab('chat')}
                >
                  دردشة
                </Button>
              </div>

              {activeTab === 'video' ? (
                <VideoCall consultationId={consultationId} />
              ) : (
                <ChatInterface consultationId={consultationId} />
              )}
            </Card>
          </div>

          {/* معلومات الاستشارة */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                معلومات الاستشارة
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">الطبيب:</span>
                  <p className="font-medium">{consultation?.doctor?.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">التخصص:</span>
                  <p className="font-medium">{consultation?.doctor?.specialization}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">التاريخ:</span>
                  <p className="font-medium">{consultation?.appointmentDate}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">الوقت:</span>
                  <p className="font-medium">{consultation?.appointmentTime}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## **المرحلة الرابعة: لوحة التحكم (أسابيع 7-8)**

### **4.1 الصفحة الرئيسية للداشبورد**

#### **Dashboard Home Page**
```typescript
// src/pages/dashboard/index.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AppointmentsChart } from '@/components/charts/AppointmentsChart';
import { RecentAppointments } from '@/components/dashboard/RecentAppointments';
import { dashboardService } from '@/services/dashboardService';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardService.getStats,
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['recentAppointments'],
    queryFn: dashboardService.getRecentAppointments,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="إجمالي المواعيد"
            value={stats?.totalAppointments || 0}
            icon="📅"
            color="blue"
          />
          <StatsCard
            title="المواعيد اليوم"
            value={stats?.todayAppointments || 0}
            icon="📋"
            color="green"
          />
          <StatsCard
            title="الأطباء النشطين"
            value={stats?.activeDoctors || 0}
            icon="👨‍⚕️"
            color="purple"
          />
          <StatsCard
            title="الإيرادات الشهرية"
            value={`$${stats?.monthlyRevenue || 0}`}
            icon="💰"
            color="orange"
          />
        </div>

        {/* الرسوم البيانية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AppointmentsChart data={stats?.appointmentsChart} />
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">المواعيد الأخيرة</h3>
            <RecentAppointments appointments={appointments || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
```

### **4.2 صفحة إدارة المواعيد**

#### **Appointments Management Page**
```typescript
// src/pages/dashboard/appointments/index.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AppointmentsTable } from '@/components/tables/AppointmentsTable';
import { AppointmentsFilter } from '@/components/forms/AppointmentsFilter';
import { Button } from '@/components/ui/Button';
import { appointmentService } from '@/services/appointmentService';

export default function AppointmentsPage() {
  const [filters, setFilters] = useState({
    status: '',
    doctorId: '',
    dateRange: '',
  });

  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => appointmentService.getAppointments(filters),
  });

  const handleStatusChange = async (appointmentId: string, status: string) => {
    try {
      await appointmentService.updateStatus(appointmentId, status);
      refetch();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            إدارة المواعيد
          </h1>
          <Button
            onClick={() => {/* إضافة موعد جديد */}}
            className="bg-primary-600 text-white"
          >
            إضافة موعد جديد
          </Button>
        </div>

        <AppointmentsFilter
          filters={filters}
          onFiltersChange={setFilters}
        />

        <AppointmentsTable
          appointments={appointments || []}
          loading={isLoading}
          onStatusChange={handleStatusChange}
        />
      </div>
    </DashboardLayout>
  );
}
```

---

## **المرحلة الخامسة: الرسوم البيانية والتقارير (أسابيع 9-10)**

### **5.1 مكونات الرسوم البيانية**

#### **Appointments Chart**
```typescript
// src/components/charts/AppointmentsChart.tsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AppointmentsChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

export const AppointmentsChart: React.FC<AppointmentsChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'إحصائيات المواعيد',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Line data={data} options={options} />
    </div>
  );
};
```

#### **Revenue Chart**
```typescript
// src/components/charts/RevenueChart.tsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'الإيرادات الشهرية',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Bar data={data} options={options} />
    </div>
  );
};
```

### **5.2 صفحة التقارير**

#### **Reports Page**
```typescript
// src/pages/dashboard/reports/index.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AppointmentsChart } from '@/components/charts/AppointmentsChart';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { DoctorsPerformanceChart } from '@/components/charts/DoctorsPerformanceChart';
import { DateRangePicker } from '@/components/forms/DateRangePicker';
import { reportsService } from '@/services/reportsService';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // آخر 30 يوم
    endDate: new Date(),
  });

  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports', dateRange],
    queryFn: () => reportsService.getReports(dateRange),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            التقارير والإحصائيات
          </h1>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AppointmentsChart data={reports?.appointmentsChart} />
            <RevenueChart data={reports?.revenueChart} />
            <DoctorsPerformanceChart data={reports?.doctorsPerformance} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
```

---

## **المرحلة السادسة: التكامل والاختبار (أسابيع 11-12)**

### **6.1 تكامل Socket.io**

#### **Socket Context**
```typescript
// src/contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000');

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
```

### **6.2 تكامل React Query**

#### **Query Client Setup**
```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

---

## 🔧 إعدادات التطوير

### **Next.js Configuration**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'your-domain.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

### **Vite Configuration**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

---

## 📱 دعم اللغات المتعددة

### **i18n Configuration**
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

### **Language Switcher**
```typescript
// src/components/common/LanguageSwitcher.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
    >
      {i18n.language === 'ar' ? 'English' : 'العربية'}
    </Button>
  );
};
```

---

## 🧪 الاختبارات

### **Component Testing**
```typescript
// src/components/__tests__/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ui/Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant classes', () => {
    render(<Button variant="primary">Primary Button</Button>);
    expect(screen.getByText('Primary Button')).toHaveClass('bg-primary-600');
  });
});
```

---

## 📝 ملاحظات مهمة

1. **الأداء**: استخدام React.memo وuseMemo لتحسين الأداء
2. **إمكانية الوصول**: تطبيق معايير WCAG للوصولية
3. **الأمان**: التحقق من صحة البيانات وحماية من XSS
4. **الاستجابة**: تصميم متجاوب لجميع أحجام الشاشات
5. **الاختبار**: اختبار شامل للمكونات والوظائف

---

*تم إعداد هذه الخطة لضمان تطوير واجهات مستخدم عالية الجودة وسهلة الاستخدام*
