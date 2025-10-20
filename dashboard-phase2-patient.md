# 🏥 المرحلة الثانية - لوحة تحكم المريض

## 📋 نظرة عامة على المرحلة

هذه المرحلة تركز على:
- تطوير لوحة تحكم المريض الكاملة
- إدارة المواعيد والاستشارات
- عرض السجل الطبي والمدفوعات
- إعداد الملف الشخصي

---

## 🎯 الميزات الرئيسية

### **1. الصفحة الرئيسية للمريض**
- إحصائيات سريعة (المواعيد القادمة، الاستشارات المكتملة)
- المواعيد القادمة
- الإجراءات السريعة
- المواعيد الأخيرة

### **2. إدارة المواعيد**
- عرض جميع المواعيد
- حجز مواعيد جديدة
- إعادة جدولة المواعيد
- إلغاء المواعيد
- فلترة المواعيد

### **3. الاستشارات**
- عرض الاستشارات السابقة
- بدء استشارة جديدة
- رفع الملفات والصور
- تقييم الاستشارات

### **4. السجل الطبي**
- عرض التاريخ الطبي
- التطعيمات
- الأدوية
- التحاليل والفحوصات

### **5. المدفوعات**
- عرض الفواتير
- دفع الفواتير
- تاريخ المدفوعات

---

## 🏗️ هيكل لوحة تحكم المريض

```
src/pages/patient/
├── Dashboard.tsx              # الصفحة الرئيسية
├── Appointments.tsx           # إدارة المواعيد
├── Consultations.tsx          # الاستشارات
├── MedicalRecord.tsx          # السجل الطبي
├── Payments.tsx               # المدفوعات
└── Profile.tsx                # الملف الشخصي
```

---

## 📊 الصفحة الرئيسية للمريض

### **Dashboard Component**

```typescript
// src/pages/patient/Dashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from '@/components/cards/StatsCard';
import { RecentAppointments } from '@/components/tables/RecentAppointments';
import { UpcomingAppointments } from '@/components/cards/UpcomingAppointments';
import { QuickActions } from '@/components/cards/QuickActions';
import { patientService } from '@/services/patientService';

export const PatientDashboard: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['patientStats'],
    queryFn: patientService.getStats,
  });

  const { data: appointments } = useQuery({
    queryKey: ['patientAppointments'],
    queryFn: patientService.getAppointments,
  });

  return (
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="المواعيد القادمة"
          value={stats?.upcomingAppointments || 0}
          icon="📅"
          color="blue"
          trend="+2"
          trendText="من الأسبوع الماضي"
        />
        <StatsCard
          title="الاستشارات المكتملة"
          value={stats?.completedConsultations || 0}
          icon="✅"
          color="green"
          trend="+5"
          trendText="من الشهر الماضي"
        />
        <StatsCard
          title="المواعيد المؤجلة"
          value={stats?.rescheduledAppointments || 0}
          icon="🔄"
          color="orange"
          trend="0"
          trendText="هذا الأسبوع"
        />
        <StatsCard
          title="المدفوعات المعلقة"
          value={stats?.pendingPayments || 0}
          icon="💰"
          color="red"
          trend="-1"
          trendText="من الأسبوع الماضي"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* المواعيد القادمة */}
        <UpcomingAppointments appointments={appointments?.upcoming || []} />
        
        {/* الإجراءات السريعة */}
        <QuickActions />
      </div>

      {/* المواعيد الأخيرة */}
      <RecentAppointments appointments={appointments?.recent || []} />
    </div>
  );
};
```

### **StatsCard Component**

```typescript
// src/components/cards/StatsCard.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  trend?: string;
  trendText?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  trendText,
  className,
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
  };

  const trendClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  };

  const getTrendClass = (trend: string) => {
    if (trend.startsWith('+')) return trendClasses.positive;
    if (trend.startsWith('-')) return trendClasses.negative;
    return trendClasses.neutral;
  };

  return (
    <div className={cn(
      'bg-white rounded-lg border p-6',
      colorClasses[color],
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && trendText && (
            <p className={cn('text-xs mt-1', getTrendClass(trend))}>
              {trend} {trendText}
            </p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};
```

---

## 📅 إدارة المواعيد

### **Appointments Page**

```typescript
// src/pages/patient/Appointments.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppointmentsTable } from '@/components/tables/AppointmentsTable';
import { AppointmentFilters } from '@/components/forms/AppointmentFilters';
import { BookAppointmentModal } from '@/components/modals/BookAppointmentModal';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { appointmentService } from '@/services/appointmentService';

export const PatientAppointments: React.FC = () => {
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    doctor: '',
  });
  const [showBookModal, setShowBookModal] = useState(false);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['patientAppointments', filters],
    queryFn: () => appointmentService.getPatientAppointments(filters),
  });

  const handleReschedule = async (appointmentId: string) => {
    // Logic for rescheduling appointment
    console.log('Rescheduling appointment:', appointmentId);
  };

  const handleCancel = async (appointmentId: string) => {
    // Logic for canceling appointment
    console.log('Canceling appointment:', appointmentId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          مواعيدي
        </h1>
        <Button
          onClick={() => setShowBookModal(true)}
          className="bg-primary-600 text-white"
        >
          حجز موعد جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فلترة المواعيد</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المواعيد</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentsTable
            appointments={appointments || []}
            loading={isLoading}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
            onView={(id) => console.log('View appointment:', id)}
          />
        </CardContent>
      </Card>

      {showBookModal && (
        <BookAppointmentModal
          isOpen={showBookModal}
          onClose={() => setShowBookModal(false)}
        />
      )}
    </div>
  );
};
```

### **AppointmentsTable Component**

```typescript
// src/components/tables/AppointmentsTable.tsx
import React from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
  type: string;
  reason?: string;
}

interface AppointmentsTableProps {
  appointments: Appointment[];
  loading?: boolean;
  onReschedule?: (id: string) => void;
  onCancel?: (id: string) => void;
  onView?: (id: string) => void;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  loading = false,
  onReschedule,
  onCancel,
  onView,
}) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'المريض',
        accessor: 'patientName',
      },
      {
        Header: 'الطبيب',
        accessor: 'doctorName',
      },
      {
        Header: 'التاريخ',
        accessor: 'date',
        Cell: ({ value }: { value: string }) => {
          const date = new Date(value);
          return date.toLocaleDateString('ar-SA');
        },
      },
      {
        Header: 'الوقت',
        accessor: 'time',
      },
      {
        Header: 'النوع',
        accessor: 'type',
        Cell: ({ value }: { value: string }) => (
          <Badge variant={value === 'video' ? 'blue' : 'green'}>
            {value === 'video' ? 'فيديو' : 'حضوري'}
          </Badge>
        ),
      },
      {
        Header: 'الحالة',
        accessor: 'status',
        Cell: ({ value }: { value: string }) => {
          const statusColors = {
            scheduled: 'blue',
            confirmed: 'green',
            completed: 'purple',
            cancelled: 'red',
            rescheduled: 'orange',
          };
          const statusLabels = {
            scheduled: 'مجدول',
            confirmed: 'مؤكد',
            completed: 'مكتمل',
            cancelled: 'ملغي',
            rescheduled: 'مؤجل',
          };
          return (
            <Badge variant={statusColors[value as keyof typeof statusColors]}>
              {statusLabels[value as keyof typeof statusLabels]}
            </Badge>
          );
        },
      },
      {
        Header: 'الإجراءات',
        Cell: ({ row }: { row: any }) => (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView?.(row.original.id)}
            >
              عرض
            </Button>
            {row.original.status === 'scheduled' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReschedule?.(row.original.id)}
                >
                  إعادة جدولة
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCancel?.(row.original.id)}
                >
                  إلغاء
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    [onReschedule, onCancel, onView]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: appointments,
    },
    useFilters,
    useSortBy
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">لا توجد مواعيد</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};
```

---

## 🩺 الاستشارات

### **Consultations Page**

```typescript
// src/pages/patient/Consultations.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ConsultationsTable } from '@/components/tables/ConsultationsTable';
import { ConsultationFilters } from '@/components/forms/ConsultationFilters';
import { StartConsultationModal } from '@/components/modals/StartConsultationModal';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { consultationService } from '@/services/consultationService';

export const PatientConsultations: React.FC = () => {
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    doctor: '',
  });
  const [showStartModal, setShowStartModal] = useState(false);

  const { data: consultations, isLoading } = useQuery({
    queryKey: ['patientConsultations', filters],
    queryFn: () => consultationService.getPatientConsultations(filters),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          الاستشارات
        </h1>
        <Button
          onClick={() => setShowStartModal(true)}
          className="bg-primary-600 text-white"
        >
          بدء استشارة جديدة
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فلترة الاستشارات</CardTitle>
        </CardHeader>
        <CardContent>
          <ConsultationFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الاستشارات</CardTitle>
        </CardHeader>
        <CardContent>
          <ConsultationsTable
            consultations={consultations || []}
            loading={isLoading}
            onView={(id) => console.log('View consultation:', id)}
            onRate={(id) => console.log('Rate consultation:', id)}
          />
        </CardContent>
      </Card>

      {showStartModal && (
        <StartConsultationModal
          isOpen={showStartModal}
          onClose={() => setShowStartModal(false)}
        />
      )}
    </div>
  );
};
```

---

## 📋 السجل الطبي

### **MedicalRecord Page**

```typescript
// src/pages/patient/MedicalRecord.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { MedicalHistory } from '@/components/medical/MedicalHistory';
import { Vaccinations } from '@/components/medical/Vaccinations';
import { Medications } from '@/components/medical/Medications';
import { LabResults } from '@/components/medical/LabResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { patientService } from '@/services/patientService';

export const PatientMedicalRecord: React.FC = () => {
  const [activeTab, setActiveTab] = useState('history');

  const { data: medicalData, isLoading } = useQuery({
    queryKey: ['patientMedicalRecord'],
    queryFn: patientService.getMedicalRecord,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          السجل الطبي
        </h1>
      </div>

      <Card>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="history">التاريخ الطبي</TabsTrigger>
              <TabsTrigger value="vaccinations">التطعيمات</TabsTrigger>
              <TabsTrigger value="medications">الأدوية</TabsTrigger>
              <TabsTrigger value="lab-results">التحاليل</TabsTrigger>
            </TabsList>

            <TabsContent value="history">
              <MedicalHistory 
                history={medicalData?.history || []} 
                loading={isLoading}
              />
            </TabsContent>

            <TabsContent value="vaccinations">
              <Vaccinations 
                vaccinations={medicalData?.vaccinations || []} 
                loading={isLoading}
              />
            </TabsContent>

            <TabsContent value="medications">
              <Medications 
                medications={medicalData?.medications || []} 
                loading={isLoading}
              />
            </TabsContent>

            <TabsContent value="lab-results">
              <LabResults 
                labResults={medicalData?.labResults || []} 
                loading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
```

---

## 💰 المدفوعات

### **Payments Page**

```typescript
// src/pages/patient/Payments.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaymentsTable } from '@/components/tables/PaymentsTable';
import { PaymentFilters } from '@/components/forms/PaymentFilters';
import { PaymentModal } from '@/components/modals/PaymentModal';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { paymentService } from '@/services/paymentService';

export const PatientPayments: React.FC = () => {
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    amount: '',
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const { data: payments, isLoading } = useQuery({
    queryKey: ['patientPayments', filters],
    queryFn: () => paymentService.getPatientPayments(filters),
  });

  const handlePay = (paymentId: string) => {
    setSelectedPayment(paymentId);
    setShowPaymentModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          المدفوعات
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فلترة المدفوعات</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المدفوعات</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentsTable
            payments={payments || []}
            loading={isLoading}
            onPay={handlePay}
            onView={(id) => console.log('View payment:', id)}
          />
        </CardContent>
      </Card>

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          paymentId={selectedPayment}
        />
      )}
    </div>
  );
};
```

---

## 👤 الملف الشخصي

### **Profile Page**

```typescript
// src/pages/patient/Profile.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/userService';

const profileSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'),
  dateOfBirth: z.string().min(1, 'تاريخ الميلاد مطلوب'),
  gender: z.enum(['male', 'female']),
  address: z.string().min(10, 'العنوان يجب أن يكون 10 أحرف على الأقل'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const PatientProfile: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || 'male',
      address: user?.address || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await userService.updateProfile(data);
      setMessage('تم تحديث الملف الشخصي بنجاح');
    } catch (error: any) {
      setMessage('حدث خطأ في تحديث الملف الشخصي');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          الملف الشخصي
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>المعلومات الشخصية</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {message && (
              <div className={`p-4 rounded-md ${
                message.includes('نجح') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="الاسم الكامل"
                {...register('name')}
                error={errors.name?.message}
              />

              <Input
                label="البريد الإلكتروني"
                type="email"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="رقم الهاتف"
                {...register('phone')}
                error={errors.phone?.message}
              />

              <Input
                label="تاريخ الميلاد"
                type="date"
                {...register('dateOfBirth')}
                error={errors.dateOfBirth?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الجنس
                </label>
                <select
                  {...register('gender')}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
                {errors.gender && (
                  <p className="text-sm text-red-600 mt-1">{errors.gender.message}</p>
                )}
              </div>
            </div>

            <Input
              label="العنوان"
              {...register('address')}
              error={errors.address?.message}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                className="bg-primary-600 text-white"
              >
                حفظ التغييرات
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
```

---

## 🧪 الاختبارات

### **1. Patient Dashboard Test**

```typescript
// src/pages/patient/__tests__/Dashboard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PatientDashboard } from '../Dashboard';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('Patient Dashboard', () => {
  it('renders dashboard with stats cards', () => {
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <PatientDashboard />
      </QueryClientProvider>
    );
    
    expect(screen.getByText('المواعيد القادمة')).toBeInTheDocument();
    expect(screen.getByText('الاستشارات المكتملة')).toBeInTheDocument();
  });
});
```

---

## 📝 ملاحظات المرحلة الثانية

1. **تجربة المستخدم**: واجهة سهلة الاستخدام للمرضى
2. **الأمان**: حماية البيانات الطبية الحساسة
3. **الاستجابة**: تصميم متجاوب لجميع الأجهزة
4. **الأداء**: تحميل سريع للبيانات
5. **الاختبار**: اختبار شامل لوظائف المريض

---

*تم إعداد هذه المرحلة لتوفير تجربة مريض شاملة ومتطورة*
