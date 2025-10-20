# 👨‍⚕️ المرحلة الثالثة - لوحة تحكم الطبيب

## 📋 نظرة عامة على المرحلة

هذه المرحلة تركز على:
- تطوير لوحة تحكم الطبيب الكاملة
- إدارة الجدول الزمني والمواعيد
- إدارة المرضى والاستشارات
- التقارير والإحصائيات
- إعداد الملف الشخصي للطبيب

---

## 🎯 الميزات الرئيسية

### **1. الصفحة الرئيسية للطبيب**
- إحصائيات سريعة (المواعيد اليوم، المرضى الجدد)
- جدول اليوم
- أداء الطبيب
- المرضى الأخيرين

### **2. إدارة الجدول الزمني**
- عرض الجدول الزمني
- إضافة أوقات متاحة
- إدارة الإجازات
- تخصيص الأوقات

### **3. إدارة المرضى**
- قائمة المرضى
- ملفات المرضى
- التاريخ الطبي
- المتابعة

### **4. الاستشارات**
- الاستشارات المباشرة
- الاستشارات المؤجلة
- رفع الملفات
- كتابة التقارير

### **5. التقارير والإحصائيات**
- تقارير الأداء
- إحصائيات المرضى
- الإيرادات
- التحليلات

---

## 🏗️ هيكل لوحة تحكم الطبيب

```
src/pages/doctor/
├── Dashboard.tsx              # الصفحة الرئيسية
├── Schedule.tsx              # إدارة الجدول الزمني
├── Patients.tsx              # إدارة المرضى
├── Consultations.tsx         # الاستشارات
├── Reports.tsx               # التقارير والإحصائيات
└── Profile.tsx               # الملف الشخصي
```

---

## 📊 الصفحة الرئيسية للطبيب

### **Doctor Dashboard Component**

```typescript
// src/pages/doctor/Dashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from '@/components/cards/StatsCard';
import { TodaySchedule } from '@/components/cards/TodaySchedule';
import { RecentPatients } from '@/components/tables/RecentPatients';
import { PerformanceChart } from '@/components/charts/PerformanceChart';
import { QuickActions } from '@/components/cards/QuickActions';
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

  const { data: recentPatients } = useQuery({
    queryKey: ['recentPatients'],
    queryFn: doctorService.getRecentPatients,
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
          trend="+3"
          trendText="من الأمس"
        />
        <StatsCard
          title="المرضى الجدد"
          value={stats?.newPatients || 0}
          icon="👥"
          color="green"
          trend="+2"
          trendText="هذا الأسبوع"
        />
        <StatsCard
          title="الاستشارات المكتملة"
          value={stats?.completedConsultations || 0}
          icon="✅"
          color="purple"
          trend="+5"
          trendText="هذا الشهر"
        />
        <StatsCard
          title="الإيرادات الشهرية"
          value={`$${stats?.monthlyRevenue || 0}`}
          icon="💰"
          color="orange"
          trend="+12%"
          trendText="من الشهر الماضي"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* جدول اليوم */}
        <TodaySchedule schedule={todaySchedule || []} />
        
        {/* أداء الطبيب */}
        <PerformanceChart data={stats?.performance} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* المرضى الأخيرين */}
        <div className="lg:col-span-2">
          <RecentPatients patients={recentPatients || []} />
        </div>
        
        {/* الإجراءات السريعة */}
        <QuickActions />
      </div>
    </div>
  );
};
```

### **TodaySchedule Component**

```typescript
// src/components/cards/TodaySchedule.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ScheduleItem {
  id: string;
  time: string;
  patientName: string;
  type: 'in-person' | 'video';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  reason?: string;
}

interface TodayScheduleProps {
  schedule: ScheduleItem[];
}

export const TodaySchedule: React.FC<TodayScheduleProps> = ({ schedule }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'blue';
      case 'in-progress': return 'green';
      case 'completed': return 'purple';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'مجدول';
      case 'in-progress': return 'جاري';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return 'غير محدد';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>جدول اليوم</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedule.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              لا توجد مواعيد اليوم
            </p>
          ) : (
            schedule.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium text-gray-900">
                    {item.time}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.patientName}
                    </p>
                    {item.reason && (
                      <p className="text-sm text-gray-500">{item.reason}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant={item.type === 'video' ? 'blue' : 'green'}>
                    {item.type === 'video' ? 'فيديو' : 'حضوري'}
                  </Badge>
                  <Badge variant={getStatusColor(item.status)}>
                    {getStatusLabel(item.status)}
                  </Badge>
                  {item.status === 'scheduled' && (
                    <Button size="sm" variant="outline">
                      بدء
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 📅 إدارة الجدول الزمني

### **Schedule Page**

```typescript
// src/pages/doctor/Schedule.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from '@/components/calendar/Calendar';
import { ScheduleForm } from '@/components/forms/ScheduleForm';
import { TimeSlots } from '@/components/cards/TimeSlots';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { doctorService } from '@/services/doctorService';

export const DoctorSchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const { data: schedule } = useQuery({
    queryKey: ['doctorSchedule', selectedDate],
    queryFn: () => doctorService.getSchedule(selectedDate),
  });

  const handleAddSchedule = () => {
    setShowScheduleForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          الجدول الزمني
        </h1>
        <Button
          onClick={handleAddSchedule}
          className="bg-primary-600 text-white"
        >
          إضافة وقت متاح
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* التقويم */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>التقويم</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                appointments={schedule?.appointments || []}
              />
            </CardContent>
          </Card>
        </div>

        {/* الأوقات المتاحة */}
        <div>
          <TimeSlots
            date={selectedDate}
            slots={schedule?.availableSlots || []}
            onSlotSelect={(slot) => console.log('Selected slot:', slot)}
            onAddSlot={() => setShowScheduleForm(true)}
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

### **Calendar Component**

```typescript
// src/components/calendar/Calendar.tsx
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/Card';

interface Appointment {
  id: string;
  date: string;
  time: string;
  patientName: string;
  type: 'in-person' | 'video';
  status: string;
}

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  appointments: Appointment[];
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  appointments,
}) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), date)
    );
  };

  const getAppointmentCount = (date: Date) => {
    return getAppointmentsForDate(date).length;
  };

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* أيام الأسبوع */}
          {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* الأيام */}
          {days.map(day => {
            const appointmentCount = getAppointmentCount(day);
            const isSelected = isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                className={`
                  p-2 text-center text-sm rounded-md hover:bg-gray-100 transition-colors
                  ${isSelected ? 'bg-primary-600 text-white' : 'text-gray-900'}
                  ${isTodayDate && !isSelected ? 'bg-blue-100 text-blue-600' : ''}
                  ${appointmentCount > 0 ? 'font-semibold' : ''}
                `}
              >
                <div>{format(day, 'd')}</div>
                {appointmentCount > 0 && (
                  <div className="text-xs mt-1">
                    {appointmentCount} موعد
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 👥 إدارة المرضى

### **Patients Page**

```typescript
// src/pages/doctor/Patients.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PatientsTable } from '@/components/tables/PatientsTable';
import { PatientFilters } from '@/components/forms/PatientFilters';
import { PatientModal } from '@/components/modals/PatientModal';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { doctorService } from '@/services/doctorService';

export const DoctorPatients: React.FC = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateRange: '',
  });
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { data: patients, isLoading } = useQuery({
    queryKey: ['doctorPatients', filters],
    queryFn: () => doctorService.getPatients(filters),
  });

  const handleViewPatient = (patientId: string) => {
    setSelectedPatient(patientId);
    setShowPatientModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          المرضى
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فلترة المرضى</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المرضى</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientsTable
            patients={patients || []}
            loading={isLoading}
            onView={handleViewPatient}
            onEdit={(id) => console.log('Edit patient:', id)}
            onAddNote={(id) => console.log('Add note to patient:', id)}
          />
        </CardContent>
      </Card>

      {showPatientModal && (
        <PatientModal
          isOpen={showPatientModal}
          onClose={() => setShowPatientModal(false)}
          patientId={selectedPatient}
        />
      )}
    </div>
  );
};
```

### **PatientsTable Component**

```typescript
// src/components/tables/PatientsTable.tsx
import React from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
  lastVisit: string;
  status: 'active' | 'inactive';
  totalAppointments: number;
}

interface PatientsTableProps {
  patients: Patient[];
  loading?: boolean;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onAddNote?: (id: string) => void;
}

export const PatientsTable: React.FC<PatientsTableProps> = ({
  patients,
  loading = false,
  onView,
  onEdit,
  onAddNote,
}) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'الاسم',
        accessor: 'name',
      },
      {
        Header: 'البريد الإلكتروني',
        accessor: 'email',
      },
      {
        Header: 'رقم الهاتف',
        accessor: 'phone',
      },
      {
        Header: 'العمر',
        accessor: 'age',
      },
      {
        Header: 'الجنس',
        accessor: 'gender',
        Cell: ({ value }: { value: string }) => (
          <span>{value === 'male' ? 'ذكر' : 'أنثى'}</span>
        ),
      },
      {
        Header: 'آخر زيارة',
        accessor: 'lastVisit',
        Cell: ({ value }: { value: string }) => {
          const date = new Date(value);
          return date.toLocaleDateString('ar-SA');
        },
      },
      {
        Header: 'الحالة',
        accessor: 'status',
        Cell: ({ value }: { value: string }) => (
          <Badge variant={value === 'active' ? 'green' : 'red'}>
            {value === 'active' ? 'نشط' : 'غير نشط'}
          </Badge>
        ),
      },
      {
        Header: 'إجمالي المواعيد',
        accessor: 'totalAppointments',
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
              onClick={() => onEdit?.(row.original.id)}
            >
              تعديل
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddNote?.(row.original.id)}
            >
              إضافة ملاحظة
            </Button>
          </div>
        ),
      },
    ],
    [onView, onEdit, onAddNote]
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
      data: patients,
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

  if (patients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">لا توجد بيانات مرضى</p>
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
// src/pages/doctor/Consultations.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ConsultationsTable } from '@/components/tables/ConsultationsTable';
import { ConsultationFilters } from '@/components/forms/ConsultationFilters';
import { ConsultationModal } from '@/components/modals/ConsultationModal';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { doctorService } from '@/services/doctorService';

export const DoctorConsultations: React.FC = () => {
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    patient: '',
  });
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  const { data: consultations, isLoading } = useQuery({
    queryKey: ['doctorConsultations', filters],
    queryFn: () => doctorService.getConsultations(filters),
  });

  const handleStartConsultation = (consultationId: string) => {
    setSelectedConsultation(consultationId);
    setShowConsultationModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          الاستشارات
        </h1>
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
            onStart={handleStartConsultation}
            onView={(id) => console.log('View consultation:', id)}
            onComplete={(id) => console.log('Complete consultation:', id)}
          />
        </CardContent>
      </Card>

      {showConsultationModal && (
        <ConsultationModal
          isOpen={showConsultationModal}
          onClose={() => setShowConsultationModal(false)}
          consultationId={selectedConsultation}
        />
      )}
    </div>
  );
};
```

---

## 📊 التقارير والإحصائيات

### **Reports Page**

```typescript
// src/pages/doctor/Reports.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { PerformanceReport } from '@/components/reports/PerformanceReport';
import { PatientReport } from '@/components/reports/PatientReport';
import { RevenueReport } from '@/components/reports/RevenueReport';
import { AppointmentReport } from '@/components/reports/AppointmentReport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { doctorService } from '@/services/doctorService';

export const DoctorReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  });

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['doctorReports', dateRange],
    queryFn: () => doctorService.getReports(dateRange),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          التقارير والإحصائيات
        </h1>
      </div>

      <Card>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">أداء الطبيب</TabsTrigger>
              <TabsTrigger value="patients">المرضى</TabsTrigger>
              <TabsTrigger value="revenue">الإيرادات</TabsTrigger>
              <TabsTrigger value="appointments">المواعيد</TabsTrigger>
            </TabsList>

            <TabsContent value="performance">
              <PerformanceReport 
                data={reportsData?.performance} 
                loading={isLoading}
              />
            </TabsContent>

            <TabsContent value="patients">
              <PatientReport 
                data={reportsData?.patients} 
                loading={isLoading}
              />
            </TabsContent>

            <TabsContent value="revenue">
              <RevenueReport 
                data={reportsData?.revenue} 
                loading={isLoading}
              />
            </TabsContent>

            <TabsContent value="appointments">
              <AppointmentReport 
                data={reportsData?.appointments} 
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

### **PerformanceReport Component**

```typescript
// src/components/reports/PerformanceReport.tsx
import React from 'react';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface PerformanceReportProps {
  data: {
    dailyAppointments: Array<{ date: string; count: number }>;
    monthlyRevenue: Array<{ month: string; amount: number }>;
    patientSatisfaction: Array<{ month: string; rating: number }>;
    averageConsultationTime: number;
    totalPatients: number;
    completionRate: number;
  };
  loading?: boolean;
}

export const PerformanceReport: React.FC<PerformanceReportProps> = ({
  data,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  const appointmentsData = {
    labels: data.dailyAppointments.map(item => item.date),
    datasets: [
      {
        label: 'المواعيد اليومية',
        data: data.dailyAppointments.map(item => item.count),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
    ],
  };

  const revenueData = {
    labels: data.monthlyRevenue.map(item => item.month),
    datasets: [
      {
        label: 'الإيرادات الشهرية',
        data: data.monthlyRevenue.map(item => item.amount),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>متوسط وقت الاستشارة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary-600">
              {data.averageConsultationTime} دقيقة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إجمالي المرضى</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {data.totalPatients}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>معدل الإكمال</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {data.completionRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>المواعيد اليومية</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={appointmentsData} height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الإيرادات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={revenueData} height={300} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
```

---

## 🧪 الاختبارات

### **1. Doctor Dashboard Test**

```typescript
// src/pages/doctor/__tests__/Dashboard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DoctorDashboard } from '../Dashboard';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('Doctor Dashboard', () => {
  it('renders dashboard with stats cards', () => {
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <DoctorDashboard />
      </QueryClientProvider>
    );
    
    expect(screen.getByText('المواعيد اليوم')).toBeInTheDocument();
    expect(screen.getByText('المرضى الجدد')).toBeInTheDocument();
  });
});
```

---

## 📝 ملاحظات المرحلة الثالثة

1. **تجربة الطبيب**: واجهة مخصصة لاحتياجات الأطباء
2. **إدارة الوقت**: أدوات فعالة لإدارة الجدول الزمني
3. **متابعة المرضى**: نظام شامل لمتابعة المرضى
4. **التقارير**: تقارير مفصلة عن الأداء والإحصائيات
5. **الأمان**: حماية البيانات الطبية الحساسة

---

*تم إعداد هذه المرحلة لتوفير تجربة طبيب شاملة ومتطورة*
