# 🏥 المرحلة الخامسة - لوحة تحكم العيادة

## 📋 نظرة عامة على المرحلة

هذه المرحلة تركز على:
- تطوير لوحة تحكم العيادة الشاملة
- إدارة الأطباء والموظفين
- إدارة المرضى والمواعيد
- إدارة الأقسام والخدمات
- التقارير والإحصائيات المالية

---

## 🎯 الميزات الرئيسية

### **1. الصفحة الرئيسية للعيادة**
- إحصائيات العيادة العامة
- نظرة عامة على العيادة
- إحصائيات الأقسام
- المواعيد الأخيرة

### **2. إدارة الأطباء**
- قائمة الأطباء
- إضافة أطباء جدد
- إدارة الجداول الزمنية
- تقييم الأداء

### **3. إدارة المرضى**
- قائمة المرضى
- ملفات المرضى
- المتابعة
- التاريخ الطبي

### **4. إدارة المواعيد**
- عرض جميع المواعيد
- إدارة المواعيد
- التقارير والإحصائيات
- المتابعة

### **5. إدارة الأقسام**
- قائمة الأقسام
- إضافة أقسام جديدة
- إدارة الخدمات
- تخصيص الأطباء

### **6. المدفوعات والإيرادات**
- عرض الفواتير
- إدارة المدفوعات
- التقارير المالية
- الإحصائيات

---

## 🏗️ هيكل لوحة تحكم العيادة

```
src/pages/clinic/
├── Dashboard.tsx              # الصفحة الرئيسية
├── Doctors.tsx                 # إدارة الأطباء
├── Patients.tsx                # إدارة المرضى
├── Appointments.tsx            # إدارة المواعيد
├── Departments.tsx             # إدارة الأقسام
├── Payments.tsx                # إدارة المدفوعات
└── Settings.tsx                # إعدادات العيادة
```

---

## 📊 الصفحة الرئيسية للعيادة

### **Clinic Dashboard Component**

```typescript
// src/pages/clinic/Dashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from '@/components/cards/StatsCard';
import { ClinicOverview } from '@/components/charts/ClinicOverview';
import { DepartmentStats } from '@/components/cards/DepartmentStats';
import { RecentAppointments } from '@/components/tables/RecentAppointments';
import { QuickActions } from '@/components/cards/QuickActions';
import { clinicService } from '@/services/clinicService';

export const ClinicDashboard: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['clinicStats'],
    queryFn: clinicService.getStats,
  });

  const { data: departments } = useQuery({
    queryKey: ['clinicDepartments'],
    queryFn: clinicService.getDepartments,
  });

  const { data: recentAppointments } = useQuery({
    queryKey: ['clinicRecentAppointments'],
    queryFn: clinicService.getRecentAppointments,
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
          trend="+2"
          trendText="هذا الشهر"
        />
        <StatsCard
          title="المرضى اليوم"
          value={stats?.todayPatients || 0}
          icon="👥"
          color="green"
          trend="+5"
          trendText="من الأمس"
        />
        <StatsCard
          title="المواعيد المكتملة"
          value={stats?.completedAppointments || 0}
          icon="✅"
          color="purple"
          trend="+8"
          trendText="هذا الأسبوع"
        />
        <StatsCard
          title="الإيرادات اليومية"
          value={`$${stats?.dailyRevenue || 0}`}
          icon="💰"
          color="orange"
          trend="+12%"
          trendText="من الأمس"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نظرة عامة على العيادة */}
        <ClinicOverview data={stats?.overview} />
        
        {/* إحصائيات الأقسام */}
        <DepartmentStats departments={departments || []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* المواعيد الأخيرة */}
        <div className="lg:col-span-2">
          <RecentAppointments appointments={recentAppointments || []} />
        </div>
        
        {/* الإجراءات السريعة */}
        <QuickActions />
      </div>
    </div>
  );
};
```

### **DepartmentStats Component**

```typescript
// src/components/cards/DepartmentStats.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Department {
  id: string;
  name: string;
  doctorsCount: number;
  patientsCount: number;
  appointmentsCount: number;
  revenue: number;
  status: 'active' | 'inactive';
}

interface DepartmentStatsProps {
  departments: Department[];
}

export const DepartmentStats: React.FC<DepartmentStatsProps> = ({ departments }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إحصائيات الأقسام</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {departments.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              لا توجد أقسام
            </p>
          ) : (
            departments.map((department) => (
              <div
                key={department.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium text-gray-900">{department.name}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">
                        {department.doctorsCount} طبيب
                      </span>
                      <span className="text-sm text-gray-500">
                        {department.patientsCount} مريض
                      </span>
                      <span className="text-sm text-gray-500">
                        {department.appointmentsCount} موعد
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant={department.status === 'active' ? 'green' : 'red'}>
                    {department.status === 'active' ? 'نشط' : 'غير نشط'}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${department.revenue}
                    </p>
                    <p className="text-xs text-gray-500">الإيرادات</p>
                  </div>
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

## 👨‍⚕️ إدارة الأطباء

### **Doctors Page**

```typescript
// src/pages/clinic/Doctors.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DoctorsTable } from '@/components/tables/DoctorsTable';
import { DoctorFilters } from '@/components/forms/DoctorFilters';
import { DoctorForm } from '@/components/forms/DoctorForm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { clinicService } from '@/services/clinicService';

export const ClinicDoctors: React.FC = () => {
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    search: '',
  });
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const { data: doctors, isLoading } = useQuery({
    queryKey: ['clinicDoctors', filters],
    queryFn: () => clinicService.getDoctors(filters),
  });

  const handleEditDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowDoctorForm(true);
  };

  const handleCreateDoctor = () => {
    setSelectedDoctor(null);
    setShowDoctorForm(true);
  };

  const handleToggleStatus = async (doctorId: string) => {
    try {
      await clinicService.toggleDoctorStatus(doctorId);
      // Refresh doctors list
    } catch (error) {
      console.error('Error toggling doctor status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          إدارة الأطباء
        </h1>
        <Button
          onClick={handleCreateDoctor}
          className="bg-primary-600 text-white"
        >
          إضافة طبيب جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فلترة الأطباء</CardTitle>
        </CardHeader>
        <CardContent>
          <DoctorFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الأطباء</CardTitle>
        </CardHeader>
        <CardContent>
          <DoctorsTable
            doctors={doctors || []}
            loading={isLoading}
            onEdit={handleEditDoctor}
            onToggleStatus={handleToggleStatus}
            onViewSchedule={(id) => console.log('View schedule:', id)}
            onViewPatients={(id) => console.log('View patients:', id)}
          />
        </CardContent>
      </Card>

      {showDoctorForm && (
        <DoctorForm
          isOpen={showDoctorForm}
          onClose={() => setShowDoctorForm(false)}
          doctor={selectedDoctor}
        />
      )}
    </div>
  );
};
```

### **DoctorsTable Component**

```typescript
// src/components/tables/DoctorsTable.tsx
import React from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  department: string;
  status: 'active' | 'inactive';
  patientsCount: number;
  appointmentsCount: number;
  rating: number;
  avatar?: string;
}

interface DoctorsTableProps {
  doctors: Doctor[];
  loading?: boolean;
  onEdit?: (doctor: Doctor) => void;
  onToggleStatus?: (id: string) => void;
  onViewSchedule?: (id: string) => void;
  onViewPatients?: (id: string) => void;
}

export const DoctorsTable: React.FC<DoctorsTableProps> = ({
  doctors,
  loading = false,
  onEdit,
  onToggleStatus,
  onViewSchedule,
  onViewPatients,
}) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'الطبيب',
        accessor: 'name',
        Cell: ({ row }: { row: any }) => (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              {row.original.avatar ? (
                <img 
                  src={row.original.avatar} 
                  alt={row.original.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {row.original.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{row.original.name}</p>
              <p className="text-sm text-gray-500">{row.original.specialization}</p>
            </div>
          </div>
        ),
      },
      {
        Header: 'القسم',
        accessor: 'department',
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
        Header: 'المرضى',
        accessor: 'patientsCount',
      },
      {
        Header: 'المواعيد',
        accessor: 'appointmentsCount',
      },
      {
        Header: 'التقييم',
        accessor: 'rating',
        Cell: ({ value }: { value: number }) => (
          <div className="flex items-center">
            <span className="text-sm font-medium">{value}</span>
            <span className="text-sm text-gray-500 ml-1">⭐</span>
          </div>
        ),
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
        Header: 'الإجراءات',
        Cell: ({ row }: { row: any }) => (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit?.(row.original)}
            >
              تعديل
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleStatus?.(row.original.id)}
            >
              {row.original.status === 'active' ? 'تعطيل' : 'تفعيل'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewSchedule?.(row.original.id)}
            >
              الجدول
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewPatients?.(row.original.id)}
            >
              المرضى
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onToggleStatus, onViewSchedule, onViewPatients]
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
      data: doctors,
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

  if (doctors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">لا توجد بيانات أطباء</p>
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

## 👥 إدارة المرضى

### **Patients Page**

```typescript
// src/pages/clinic/Patients.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PatientsTable } from '@/components/tables/PatientsTable';
import { PatientFilters } from '@/components/forms/PatientFilters';
import { PatientModal } from '@/components/modals/PatientModal';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { clinicService } from '@/services/clinicService';

export const ClinicPatients: React.FC = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateRange: '',
  });
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { data: patients, isLoading } = useQuery({
    queryKey: ['clinicPatients', filters],
    queryFn: () => clinicService.getPatients(filters),
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

---

## 📅 إدارة المواعيد

### **Appointments Page**

```typescript
// src/pages/clinic/Appointments.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppointmentsTable } from '@/components/tables/AppointmentsTable';
import { AppointmentFilters } from '@/components/forms/AppointmentFilters';
import { AppointmentModal } from '@/components/modals/AppointmentModal';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { clinicService } from '@/services/clinicService';

export const ClinicAppointments: React.FC = () => {
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    doctor: '',
    department: '',
  });
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['clinicAppointments', filters],
    queryFn: () => clinicService.getAppointments(filters),
  });

  const handleViewAppointment = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    setShowAppointmentModal(true);
  };

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
          المواعيد
        </h1>
        <Button
          onClick={() => setShowAppointmentModal(true)}
          className="bg-primary-600 text-white"
        >
          إضافة موعد جديد
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
            onView={handleViewAppointment}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>

      {showAppointmentModal && (
        <AppointmentModal
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          appointment={selectedAppointment}
        />
      )}
    </div>
  );
};
```

---

## 🏥 إدارة الأقسام

### **Departments Page**

```typescript
// src/pages/clinic/Departments.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DepartmentsTable } from '@/components/tables/DepartmentsTable';
import { DepartmentForm } from '@/components/forms/DepartmentForm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { clinicService } from '@/services/clinicService';

export const ClinicDepartments: React.FC = () => {
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const { data: departments, isLoading } = useQuery({
    queryKey: ['clinicDepartments'],
    queryFn: clinicService.getDepartments,
  });

  const handleEditDepartment = (department: any) => {
    setSelectedDepartment(department);
    setShowDepartmentForm(true);
  };

  const handleCreateDepartment = () => {
    setSelectedDepartment(null);
    setShowDepartmentForm(true);
  };

  const handleToggleStatus = async (departmentId: string) => {
    try {
      await clinicService.toggleDepartmentStatus(departmentId);
      // Refresh departments list
    } catch (error) {
      console.error('Error toggling department status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          إدارة الأقسام
        </h1>
        <Button
          onClick={handleCreateDepartment}
          className="bg-primary-600 text-white"
        >
          إضافة قسم جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الأقسام</CardTitle>
        </CardHeader>
        <CardContent>
          <DepartmentsTable
            departments={departments || []}
            loading={isLoading}
            onEdit={handleEditDepartment}
            onToggleStatus={handleToggleStatus}
            onViewDoctors={(id) => console.log('View doctors:', id)}
            onViewServices={(id) => console.log('View services:', id)}
          />
        </CardContent>
      </Card>

      {showDepartmentForm && (
        <DepartmentForm
          isOpen={showDepartmentForm}
          onClose={() => setShowDepartmentForm(false)}
          department={selectedDepartment}
        />
      )}
    </div>
  );
};
```

---

## 💰 إدارة المدفوعات

### **Payments Page**

```typescript
// src/pages/clinic/Payments.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaymentsTable } from '@/components/tables/PaymentsTable';
import { PaymentFilters } from '@/components/forms/PaymentFilters';
import { PaymentModal } from '@/components/modals/PaymentModal';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { clinicService } from '@/services/clinicService';

export const ClinicPayments: React.FC = () => {
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    patient: '',
    doctor: '',
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const { data: payments, isLoading } = useQuery({
    queryKey: ['clinicPayments', filters],
    queryFn: () => clinicService.getPayments(filters),
  });

  const handleViewPayment = (paymentId: string) => {
    setSelectedPayment(paymentId);
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async (paymentId: string) => {
    try {
      await clinicService.processPayment(paymentId);
      // Refresh payments list
    } catch (error) {
      console.error('Error processing payment:', error);
    }
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
            onView={handleViewPayment}
            onProcess={handleProcessPayment}
            onRefund={(id) => console.log('Refund payment:', id)}
          />
        </CardContent>
      </Card>

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          payment={selectedPayment}
        />
      )}
    </div>
  );
};
```

---

## ⚙️ إعدادات العيادة

### **Settings Page**

```typescript
// src/pages/clinic/Settings.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { clinicService } from '@/services/clinicService';

const clinicSettingsSchema = z.object({
  name: z.string().min(1, 'اسم العيادة مطلوب'),
  description: z.string().min(1, 'وصف العيادة مطلوب'),
  address: z.string().min(1, 'عنوان العيادة مطلوب'),
  phone: z.string().min(1, 'رقم الهاتف مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  website: z.string().url('الموقع الإلكتروني غير صحيح').optional(),
  workingHours: z.object({
    start: z.string(),
    end: z.string(),
  }),
  timezone: z.string().min(1, 'المنطقة الزمنية مطلوبة'),
});

type ClinicSettingsFormData = z.infer<typeof clinicSettingsSchema>;

export const ClinicSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClinicSettingsFormData>({
    resolver: zodResolver(clinicSettingsSchema),
  });

  const onSubmit = async (data: ClinicSettingsFormData) => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await clinicService.updateSettings(data);
      setMessage('تم تحديث إعدادات العيادة بنجاح');
    } catch (error: any) {
      setMessage('حدث خطأ في تحديث إعدادات العيادة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          إعدادات العيادة
        </h1>
      </div>

      <Card>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">عام</TabsTrigger>
              <TabsTrigger value="working-hours">ساعات العمل</TabsTrigger>
              <TabsTrigger value="services">الخدمات</TabsTrigger>
              <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
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
                    label="اسم العيادة"
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
                    label="الموقع الإلكتروني"
                    {...register('website')}
                    error={errors.website?.message}
                  />
                </div>

                <Input
                  label="عنوان العيادة"
                  {...register('address')}
                  error={errors.address?.message}
                />

                <Input
                  label="وصف العيادة"
                  {...register('description')}
                  error={errors.description?.message}
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
                    حفظ الإعدادات
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="working-hours">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">ساعات العمل</h3>
                <p className="text-gray-600">إعدادات ساعات العمل ستكون متاحة قريباً</p>
              </div>
            </TabsContent>

            <TabsContent value="services">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">الخدمات</h3>
                <p className="text-gray-600">إعدادات الخدمات ستكون متاحة قريباً</p>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">الإشعارات</h3>
                <p className="text-gray-600">إعدادات الإشعارات ستكون متاحة قريباً</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
```

---

## 🧪 الاختبارات

### **1. Clinic Dashboard Test**

```typescript
// src/pages/clinic/__tests__/Dashboard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClinicDashboard } from '../Dashboard';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('Clinic Dashboard', () => {
  it('renders dashboard with stats cards', () => {
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <ClinicDashboard />
      </QueryClientProvider>
    );
    
    expect(screen.getByText('الأطباء النشطين')).toBeInTheDocument();
    expect(screen.getByText('المرضى اليوم')).toBeInTheDocument();
  });
});
```

---

## 📝 ملاحظات المرحلة الخامسة

1. **إدارة شاملة**: إدارة كاملة لجميع جوانب العيادة
2. **التنظيم**: تنظيم الأطباء والأقسام والخدمات
3. **المتابعة**: متابعة المرضى والمواعيد
4. **المالية**: إدارة المدفوعات والإيرادات
5. **الإعدادات**: إعدادات مرنة للعيادة

---

*تم إعداد هذه المرحلة لتوفير إدارة عيادة شاملة ومتطورة*
