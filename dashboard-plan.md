# 🎛️ خطة تطوير الداشبورد - نظام إدارة العيادات

## 📋 نظرة عامة

داشبورد شامل لإدارة العيادات يشمل:
- **لوحة تحكم المريض** - إدارة المواعيد والاستشارات
- **لوحة تحكم الطبيب** - إدارة الجدول والمرضى
- **لوحة تحكم الإدارة** - إدارة شاملة للنظام
- **لوحة تحكم العيادة** - إدارة العيادة والأطباء

---

## 🛠️ التقنيات المستخدمة

### **Frontend Framework**
- **React 18** - مكتبة JavaScript للواجهات التفاعلية
- **Vite** - أداة بناء سريعة للتطوير
- **TypeScript** - JavaScript مع أنواع البيانات
- **Tailwind CSS** - إطار عمل CSS للتصميم السريع

### **UI Components**
- **Ant Design** - مكتبة مكونات UI جاهزة
- **React Router** - التنقل في التطبيق
- **React Query** - إدارة البيانات والحالة
- **Socket.io Client** - الاتصال المباشر

### **Charts & Analytics**
- **Chart.js** - الرسوم البيانية الأساسية
- **React Chart.js 2** - مكونات الرسوم البيانية
- **Recharts** - مكتبة رسوم بيانية متقدمة
- **D3.js** - رسوم بيانية مخصصة

### **Data Management**
- **React Table** - جداول البيانات المتقدمة
- **React Hook Form** - إدارة النماذج
- **Zod** - التحقق من البيانات
- **Date-fns** - معالجة التواريخ

### **Real-time Features**
- **Socket.io** - الاتصال المباشر
- **React Query** - تحديث البيانات
- **WebSocket** - الاتصال المباشر

---

## 🏗️ هيكل الداشبورد

```
dashboard/
├── src/
│   ├── components/          # مكونات React
│   │   ├── ui/             # مكونات UI أساسية
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Form.tsx
│   │   │   └── Loading.tsx
│   │   ├── layout/          # مكونات التخطيط
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   └── Navigation.tsx
│   │   ├── charts/          # مكونات الرسوم البيانية
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   ├── AreaChart.tsx
│   │   │   └── DonutChart.tsx
│   │   ├── tables/          # مكونات الجداول
│   │   │   ├── AppointmentsTable.tsx
│   │   │   ├── PatientsTable.tsx
│   │   │   ├── DoctorsTable.tsx
│   │   │   ├── PaymentsTable.tsx
│   │   │   └── ReportsTable.tsx
│   │   ├── forms/           # مكونات النماذج
│   │   │   ├── AppointmentForm.tsx
│   │   │   ├── PatientForm.tsx
│   │   │   ├── DoctorForm.tsx
│   │   │   ├── ClinicForm.tsx
│   │   │   └── PaymentForm.tsx
│   │   ├── cards/           # مكونات البطاقات
│   │   │   ├── StatsCard.tsx
│   │   │   ├── InfoCard.tsx
│   │   │   ├── QuickActionCard.tsx
│   │   │   └── NotificationCard.tsx
│   │   └── common/          # مكونات مشتركة
│   │       ├── SearchBar.tsx
│   │       ├── Filter.tsx
│   │       ├── Pagination.tsx
│   │       ├── DatePicker.tsx
│   │       └── FileUpload.tsx
│   ├── pages/               # صفحات الداشبورد
│   │   ├── auth/            # صفحات المصادقة
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ForgotPassword.tsx
│   │   ├── patient/         # لوحة تحكم المريض
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Appointments.tsx
│   │   │   ├── Consultations.tsx
│   │   │   ├── MedicalRecord.tsx
│   │   │   ├── Payments.tsx
│   │   │   └── Profile.tsx
│   │   ├── doctor/          # لوحة تحكم الطبيب
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Schedule.tsx
│   │   │   ├── Patients.tsx
│   │   │   ├── Consultations.tsx
│   │   │   ├── Reports.tsx
│   │   │   └── Profile.tsx
│   │   ├── admin/           # لوحة تحكم الإدارة
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Users.tsx
│   │   │   ├── Appointments.tsx
│   │   │   ├── Clinics.tsx
│   │   │   ├── Payments.tsx
│   │   │   ├── Reports.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── Analytics.tsx
│   │   └── clinic/          # لوحة تحكم العيادة
│   │       ├── Dashboard.tsx
│   │       ├── Doctors.tsx
│   │       ├── Patients.tsx
│   │       ├── Appointments.tsx
│   │       ├── Departments.tsx
│   │       ├── Payments.tsx
│   │       └── Settings.tsx
│   ├── hooks/               # React Hooks
│   │   ├── useAuth.ts
│   │   ├── useAppointments.ts
│   │   ├── usePatients.ts
│   │   ├── useDoctors.ts
│   │   ├── usePayments.ts
│   │   └── useNotifications.ts
│   ├── services/            # خدمات API
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── appointments.ts
│   │   ├── patients.ts
│   │   ├── doctors.ts
│   │   ├── payments.ts
│   │   └── notifications.ts
│   ├── utils/               # أدوات مساعدة
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validations.ts
│   │   ├── formatters.ts
│   │   └── dateUtils.ts
│   ├── types/               # أنواع TypeScript
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── appointment.ts
│   │   ├── patient.ts
│   │   ├── doctor.ts
│   │   └── payment.ts
│   ├── lib/                 # مكتبات خارجية
│   │   ├── queryClient.ts
│   │   ├── socket.ts
│   │   └── utils.ts
│   └── styles/              # ملفات CSS
│       ├── globals.css
│       └── components.css
├── public/                  # الملفات العامة
│   ├── images/
│   ├── icons/
│   └── documents/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── index.html
```

---

## 🎯 لوحات التحكم المختلفة

## **1. لوحة تحكم المريض**

### **الصفحة الرئيسية**
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
        />
        <StatsCard
          title="الاستشارات المكتملة"
          value={stats?.completedConsultations || 0}
          icon="✅"
          color="green"
        />
        <StatsCard
          title="المواعيد المؤجلة"
          value={stats?.rescheduledAppointments || 0}
          icon="🔄"
          color="orange"
        />
        <StatsCard
          title="المدفوعات المعلقة"
          value={stats?.pendingPayments || 0}
          icon="💰"
          color="red"
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

### **صفحة المواعيد**
```typescript
// src/pages/patient/Appointments.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppointmentsTable } from '@/components/tables/AppointmentsTable';
import { AppointmentFilters } from '@/components/forms/AppointmentFilters';
import { BookAppointmentModal } from '@/components/modals/BookAppointmentModal';
import { Button } from '@/components/ui/Button';
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

      <AppointmentFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      <AppointmentsTable
        appointments={appointments || []}
        loading={isLoading}
        onReschedule={(id) => {/* إعادة الجدولة */}}
        onCancel={(id) => {/* الإلغاء */}}
      />

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

## **2. لوحة تحكم الطبيب**

### **الصفحة الرئيسية**
```typescript
// src/pages/doctor/Dashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from '@/components/cards/StatsCard';
import { TodaySchedule } from '@/components/cards/TodaySchedule';
import { RecentPatients } from '@/components/tables/RecentPatients';
import { PerformanceChart } from '@/components/charts/PerformanceChart';
import { doctorService } from '@/services/doctorService';

export const DoctorDashboard: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['doctorStats'],
    queryFn: doctorService.getStats,
  });

  const { data: todaySchedule } = useQuery({
    queryKey: ['todaySchedule'],
    queryFn: doctorService.getTodaySchedule,
  });

  return (
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="المواعيد اليوم"
          value={stats?.todayAppointments || 0}
          icon="📅"
          color="blue"
        />
        <StatsCard
          title="المرضى الجدد"
          value={stats?.newPatients || 0}
          icon="👥"
          color="green"
        />
        <StatsCard
          title="الاستشارات المكتملة"
          value={stats?.completedConsultations || 0}
          icon="✅"
          color="purple"
        />
        <StatsCard
          title="الإيرادات الشهرية"
          value={`$${stats?.monthlyRevenue || 0}`}
          icon="💰"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* جدول اليوم */}
        <TodaySchedule schedule={todaySchedule || []} />
        
        {/* أداء الطبيب */}
        <PerformanceChart data={stats?.performance} />
      </div>

      {/* المرضى الأخيرين */}
      <RecentPatients patients={stats?.recentPatients || []} />
    </div>
  );
};
```

### **صفحة الجدول الزمني**
```typescript
// src/pages/doctor/Schedule.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from '@/components/calendar/Calendar';
import { ScheduleForm } from '@/components/forms/ScheduleForm';
import { TimeSlots } from '@/components/cards/TimeSlots';
import { Button } from '@/components/ui/Button';
import { doctorService } from '@/services/doctorService';

export const DoctorSchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const { data: schedule } = useQuery({
    queryKey: ['doctorSchedule', selectedDate],
    queryFn: () => doctorService.getSchedule(selectedDate),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          الجدول الزمني
        </h1>
        <Button
          onClick={() => setShowScheduleForm(true)}
          className="bg-primary-600 text-white"
        >
          إضافة وقت متاح
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* التقويم */}
        <div className="lg:col-span-2">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            appointments={schedule?.appointments || []}
          />
        </div>

        {/* الأوقات المتاحة */}
        <div>
          <TimeSlots
            date={selectedDate}
            slots={schedule?.availableSlots || []}
            onSlotSelect={(slot) => {/* اختيار الوقت */}}
          />
        </div>
      </div>

      {showScheduleForm && (
        <ScheduleForm
          isOpen={showScheduleForm}
          onClose={() => setShowScheduleForm(false)}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};
```

## **3. لوحة تحكم الإدارة**

### **الصفحة الرئيسية**
```typescript
// src/pages/admin/Dashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from '@/components/cards/StatsCard';
import { SystemOverview } from '@/components/charts/SystemOverview';
import { RecentActivity } from '@/components/tables/RecentActivity';
import { SystemHealth } from '@/components/cards/SystemHealth';
import { adminService } from '@/services/adminService';

export const AdminDashboard: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminService.getStats,
  });

  const { data: systemHealth } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: adminService.getSystemHealth,
  });

  return (
    <div className="space-y-6">
      {/* إحصائيات النظام */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="إجمالي المستخدمين"
          value={stats?.totalUsers || 0}
          icon="👥"
          color="blue"
        />
        <StatsCard
          title="المواعيد اليوم"
          value={stats?.todayAppointments || 0}
          icon="📅"
          color="green"
        />
        <StatsCard
          title="الإيرادات الشهرية"
          value={`$${stats?.monthlyRevenue || 0}`}
          icon="💰"
          color="purple"
        />
        <StatsCard
          title="العيادات النشطة"
          value={stats?.activeClinics || 0}
          icon="🏥"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نظرة عامة على النظام */}
        <SystemOverview data={stats?.overview} />
        
        {/* صحة النظام */}
        <SystemHealth health={systemHealth} />
      </div>

      {/* النشاط الأخير */}
      <RecentActivity activities={stats?.recentActivity || []} />
    </div>
  );
};
```

### **صفحة إدارة المستخدمين**
```typescript
// src/pages/admin/Users.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UsersTable } from '@/components/tables/UsersTable';
import { UserFilters } from '@/components/forms/UserFilters';
import { UserForm } from '@/components/forms/UserForm';
import { Button } from '@/components/ui/Button';
import { userService } from '@/services/userService';

export const AdminUsers: React.FC = () => {
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: '',
  });
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers(filters),
  });

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowUserForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          إدارة المستخدمين
        </h1>
        <Button
          onClick={handleCreateUser}
          className="bg-primary-600 text-white"
        >
          إضافة مستخدم جديد
        </Button>
      </div>

      <UserFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      <UsersTable
        users={users || []}
        loading={isLoading}
        onEdit={handleEditUser}
        onDelete={(id) => {/* حذف المستخدم */}}
        onToggleStatus={(id) => {/* تغيير حالة المستخدم */}}
      />

      {showUserForm && (
        <UserForm
          isOpen={showUserForm}
          onClose={() => setShowUserForm(false)}
          user={selectedUser}
        />
      )}
    </div>
  );
};
```

## **4. لوحة تحكم العيادة**

### **الصفحة الرئيسية**
```typescript
// src/pages/clinic/Dashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from '@/components/cards/StatsCard';
import { ClinicOverview } from '@/components/charts/ClinicOverview';
import { DepartmentStats } from '@/components/cards/DepartmentStats';
import { RecentAppointments } from '@/components/tables/RecentAppointments';
import { clinicService } from '@/services/clinicService';

export const ClinicDashboard: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['clinicStats'],
    queryFn: clinicService.getStats,
  });

  return (
    <div className="space-y-6">
      {/* إحصائيات العيادة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="الأطباء النشطين"
          value={stats?.activeDoctors || 0}
          icon="👨‍⚕️"
          color="blue"
        />
        <StatsCard
          title="المرضى اليوم"
          value={stats?.todayPatients || 0}
          icon="👥"
          color="green"
        />
        <StatsCard
          title="المواعيد المكتملة"
          value={stats?.completedAppointments || 0}
          icon="✅"
          color="purple"
        />
        <StatsCard
          title="الإيرادات اليومية"
          value={`$${stats?.dailyRevenue || 0}`}
          icon="💰"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نظرة عامة على العيادة */}
        <ClinicOverview data={stats?.overview} />
        
        {/* إحصائيات الأقسام */}
        <DepartmentStats departments={stats?.departments || []} />
      </div>

      {/* المواعيد الأخيرة */}
      <RecentAppointments appointments={stats?.recentAppointments || []} />
    </div>
  );
};
```

---

## 🎨 مكونات UI المتقدمة

### **1. مكونات الرسوم البيانية**

#### **Line Chart**
```typescript
// src/components/charts/LineChart.tsx
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

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
  title?: string;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  title = 'الرسم البياني',
  height = 300 
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Line data={data} options={options} />
    </div>
  );
};
```

#### **Bar Chart**
```typescript
// src/components/charts/BarChart.tsx
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

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }[];
  };
  title?: string;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title = 'الرسم البياني',
  height = 300 
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Bar data={data} options={options} />
    </div>
  );
};
```

### **2. مكونات الجداول**

#### **Appointments Table**
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
          };
          return (
            <Badge variant={statusColors[value as keyof typeof statusColors]}>
              {value}
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
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
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
  );
};
```

### **3. مكونات النماذج**

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
import { Textarea } from '@/components/ui/Textarea';

const appointmentSchema = z.object({
  patientId: z.string().min(1, 'المريض مطلوب'),
  doctorId: z.string().min(1, 'الطبيب مطلوب'),
  date: z.string().min(1, 'التاريخ مطلوب'),
  time: z.string().min(1, 'الوقت مطلوب'),
  type: z.enum(['in-person', 'video']),
  reason: z.string().min(10, 'سبب الزيارة مطلوب'),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => void;
  doctors: Array<{ id: string; name: string; specialization: string }>;
  patients: Array<{ id: string; name: string; email: string }>;
  availableSlots: string[];
  loading?: boolean;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  onSubmit,
  doctors,
  patients,
  availableSlots,
  loading = false,
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
  const selectedDate = watch('date');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="المريض"
          {...register('patientId')}
          error={errors.patientId?.message}
          options={patients.map(patient => ({
            value: patient.id,
            label: patient.name,
          }))}
        />

        <Select
          label="الطبيب"
          {...register('doctorId')}
          error={errors.doctorId?.message}
          options={doctors.map(doctor => ({
            value: doctor.id,
            label: `${doctor.name} - ${doctor.specialization}`,
          }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="التاريخ"
          type="date"
          {...register('date')}
          error={errors.date?.message}
        />

        <Select
          label="الوقت"
          {...register('time')}
          error={errors.time?.message}
          options={availableSlots.map(slot => ({
            value: slot,
            label: slot,
          }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="نوع الموعد"
          {...register('type')}
          error={errors.type?.message}
          options={[
            { value: 'in-person', label: 'حضوري' },
            { value: 'video', label: 'فيديو' },
          ]}
        />
      </div>

      <Textarea
        label="سبب الزيارة"
        {...register('reason')}
        error={errors.reason?.message}
        placeholder="اكتب سبب الزيارة..."
        rows={3}
      />

      <Textarea
        label="ملاحظات إضافية"
        {...register('notes')}
        error={errors.notes?.message}
        placeholder="أي ملاحظات إضافية..."
        rows={2}
      />

      <Button
        type="submit"
        loading={isSubmitting || loading}
        className="w-full bg-primary-600 text-white"
      >
        {isSubmitting ? 'جاري الحفظ...' : 'حفظ الموعد'}
      </Button>
    </form>
  );
};
```

---

## 🔧 إعدادات التطوير

### **1. Vite Configuration**
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
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### **2. Tailwind Configuration**
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### **3. React Query Setup**
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

## 🧪 الاختبارات

### **1. Component Testing**
```typescript
// src/components/__tests__/StatsCard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatsCard } from '../cards/StatsCard';

describe('StatsCard Component', () => {
  it('renders stats card with correct data', () => {
    const props = {
      title: 'المواعيد اليوم',
      value: 15,
      icon: '📅',
      color: 'blue',
    };

    render(<StatsCard {...props} />);
    
    expect(screen.getByText('المواعيد اليوم')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('📅')).toBeInTheDocument();
  });

  it('applies correct color classes', () => {
    const props = {
      title: 'المواعيد اليوم',
      value: 15,
      icon: '📅',
      color: 'blue',
    };

    render(<StatsCard {...props} />);
    
    const card = screen.getByRole('article');
    expect(card).toHaveClass('bg-blue-50');
  });
});
```

### **2. Page Testing**
```typescript
// src/pages/__tests__/PatientDashboard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PatientDashboard } from '../patient/Dashboard';

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

## 📝 ملاحظات مهمة

1. **الأداء**: استخدام React.memo وuseMemo لتحسين الأداء
2. **إمكانية الوصول**: تطبيق معايير WCAG للوصولية
3. **الأمان**: التحقق من صحة البيانات وحماية من XSS
4. **الاستجابة**: تصميم متجاوب لجميع أحجام الشاشات
5. **الاختبار**: اختبار شامل للمكونات والوظائف
6. **التوثيق**: توثيق شامل للمكونات والوظائف

---

*تم إعداد هذه الخطة لضمان تطوير داشبورد احترافي ومتطور*
