# 👨‍💼 المرحلة الرابعة - لوحة تحكم الإدارة

## 📋 نظرة عامة على المرحلة

هذه المرحلة تركز على:
- تطوير لوحة تحكم الإدارة الشاملة
- إدارة المستخدمين والأدوار
- إدارة العيادات والأطباء
- التقارير والإحصائيات العامة
- إعدادات النظام والأمان

---

## 🎯 الميزات الرئيسية

### **1. الصفحة الرئيسية للإدارة**
- إحصائيات النظام العامة
- نظرة عامة على النظام
- صحة النظام
- النشاط الأخير

### **2. إدارة المستخدمين**
- قائمة المستخدمين
- إدارة الأدوار والصلاحيات
- إنشاء مستخدمين جدد
- تعطيل/تفعيل المستخدمين

### **3. إدارة العيادات**
- قائمة العيادات
- إضافة عيادات جديدة
- إدارة أطباء العيادة
- إعدادات العيادة

### **4. إدارة المواعيد**
- عرض جميع المواعيد
- إدارة المواعيد
- التقارير والإحصائيات
- المتابعة

### **5. التقارير والإحصائيات**
- تقارير شاملة
- إحصائيات النظام
- تحليلات الأداء
- تقارير مالية

### **6. إعدادات النظام**
- إعدادات عامة
- إعدادات الأمان
- إعدادات الإشعارات
- النسخ الاحتياطي

---

## 🏗️ هيكل لوحة تحكم الإدارة

```
src/pages/admin/
├── Dashboard.tsx              # الصفحة الرئيسية
├── Users.tsx                  # إدارة المستخدمين
├── Clinics.tsx                # إدارة العيادات
├── Appointments.tsx           # إدارة المواعيد
├── Payments.tsx               # إدارة المدفوعات
├── Reports.tsx                # التقارير والإحصائيات
├── Settings.tsx               # إعدادات النظام
└── Analytics.tsx              # التحليلات المتقدمة
```

---

## 📊 الصفحة الرئيسية للإدارة

### **Admin Dashboard Component**

```typescript
// src/pages/admin/Dashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from '@/components/cards/StatsCard';
import { SystemOverview } from '@/components/charts/SystemOverview';
import { RecentActivity } from '@/components/tables/RecentActivity';
import { SystemHealth } from '@/components/cards/SystemHealth';
import { QuickActions } from '@/components/cards/QuickActions';
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

  const { data: recentActivity } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: adminService.getRecentActivity,
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
          trend="+12"
          trendText="هذا الشهر"
        />
        <StatsCard
          title="المواعيد اليوم"
          value={stats?.todayAppointments || 0}
          icon="📅"
          color="green"
          trend="+8"
          trendText="من الأمس"
        />
        <StatsCard
          title="الإيرادات الشهرية"
          value={`$${stats?.monthlyRevenue || 0}`}
          icon="💰"
          color="purple"
          trend="+15%"
          trendText="من الشهر الماضي"
        />
        <StatsCard
          title="العيادات النشطة"
          value={stats?.activeClinics || 0}
          icon="🏥"
          color="orange"
          trend="+2"
          trendText="هذا الشهر"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نظرة عامة على النظام */}
        <SystemOverview data={stats?.overview} />
        
        {/* صحة النظام */}
        <SystemHealth health={systemHealth} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* النشاط الأخير */}
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivity || []} />
        </div>
        
        {/* الإجراءات السريعة */}
        <QuickActions />
      </div>
    </div>
  );
};
```

### **SystemHealth Component**

```typescript
// src/components/cards/SystemHealth.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface SystemHealthProps {
  health: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    responseTime: number;
    databaseStatus: 'connected' | 'disconnected';
    serverLoad: number;
    memoryUsage: number;
    diskUsage: number;
  };
}

export const SystemHealth: React.FC<SystemHealthProps> = ({ health }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'green';
      case 'warning': return 'orange';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'healthy': return 'صحي';
      case 'warning': return 'تحذير';
      case 'critical': return 'حرج';
      default: return 'غير محدد';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>صحة النظام</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">الحالة العامة</span>
            <Badge variant={getStatusColor(health.status)}>
              {getStatusLabel(health.status)}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">وقت التشغيل</span>
              <span className="text-sm font-medium">{health.uptime}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${health.uptime}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">وقت الاستجابة</span>
              <span className="text-sm font-medium">{health.responseTime}ms</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  health.responseTime < 100 ? 'bg-green-600' : 
                  health.responseTime < 500 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${Math.min(100, (1000 - health.responseTime) / 10)}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">قاعدة البيانات</span>
              <div className="mt-1">
                <Badge variant={health.databaseStatus === 'connected' ? 'green' : 'red'}>
                  {health.databaseStatus === 'connected' ? 'متصل' : 'غير متصل'}
                </Badge>
              </div>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">حمل الخادم</span>
              <div className="mt-1">
                <span className="text-sm font-medium">{health.serverLoad}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">استخدام الذاكرة</span>
              <div className="mt-1">
                <span className="text-sm font-medium">{health.memoryUsage}%</span>
              </div>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">استخدام القرص</span>
              <div className="mt-1">
                <span className="text-sm font-medium">{health.diskUsage}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 👥 إدارة المستخدمين

### **Users Page**

```typescript
// src/pages/admin/Users.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UsersTable } from '@/components/tables/UsersTable';
import { UserFilters } from '@/components/forms/UserFilters';
import { UserForm } from '@/components/forms/UserForm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { adminService } from '@/services/adminService';

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
    queryFn: () => adminService.getUsers(filters),
  });

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowUserForm(true);
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await adminService.toggleUserStatus(userId);
      // Refresh users list
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        await adminService.deleteUser(userId);
        // Refresh users list
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
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

      <Card>
        <CardHeader>
          <CardTitle>فلترة المستخدمين</CardTitle>
        </CardHeader>
        <CardContent>
          <UserFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المستخدمين</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={users || []}
            loading={isLoading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>

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

### **UsersTable Component**

```typescript
// src/components/tables/UsersTable.tsx
import React from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient' | 'clinic';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  avatar?: string;
}

interface UsersTableProps {
  users: User[];
  loading?: boolean;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading = false,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'المستخدم',
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
              <p className="text-sm text-gray-500">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        Header: 'الدور',
        accessor: 'role',
        Cell: ({ value }: { value: string }) => {
          const roleLabels = {
            admin: 'مدير',
            doctor: 'طبيب',
            patient: 'مريض',
            clinic: 'عيادة',
          };
          const roleColors = {
            admin: 'red',
            doctor: 'blue',
            patient: 'green',
            clinic: 'purple',
          };
          return (
            <Badge variant={roleColors[value as keyof typeof roleColors]}>
              {roleLabels[value as keyof typeof roleLabels]}
            </Badge>
          );
        },
      },
      {
        Header: 'الحالة',
        accessor: 'status',
        Cell: ({ value }: { value: string }) => {
          const statusColors = {
            active: 'green',
            inactive: 'gray',
            suspended: 'red',
          };
          const statusLabels = {
            active: 'نشط',
            inactive: 'غير نشط',
            suspended: 'معلق',
          };
          return (
            <Badge variant={statusColors[value as keyof typeof statusColors]}>
              {statusLabels[value as keyof typeof statusLabels]}
            </Badge>
          );
        },
      },
      {
        Header: 'آخر دخول',
        accessor: 'lastLogin',
        Cell: ({ value }: { value: string }) => {
          const date = new Date(value);
          return date.toLocaleDateString('ar-SA');
        },
      },
      {
        Header: 'تاريخ الإنشاء',
        accessor: 'createdAt',
        Cell: ({ value }: { value: string }) => {
          const date = new Date(value);
          return date.toLocaleDateString('ar-SA');
        },
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
              onClick={() => onDelete?.(row.original.id)}
            >
              حذف
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete, onToggleStatus]
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
      data: users,
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

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">لا توجد بيانات مستخدمين</p>
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

## 🏥 إدارة العيادات

### **Clinics Page**

```typescript
// src/pages/admin/Clinics.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ClinicsTable } from '@/components/tables/ClinicsTable';
import { ClinicFilters } from '@/components/forms/ClinicFilters';
import { ClinicForm } from '@/components/forms/ClinicForm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { adminService } from '@/services/adminService';

export const AdminClinics: React.FC = () => {
  const [filters, setFilters] = useState({
    status: '',
    location: '',
    search: '',
  });
  const [showClinicForm, setShowClinicForm] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);

  const { data: clinics, isLoading } = useQuery({
    queryKey: ['clinics', filters],
    queryFn: () => adminService.getClinics(filters),
  });

  const handleEditClinic = (clinic: any) => {
    setSelectedClinic(clinic);
    setShowClinicForm(true);
  };

  const handleCreateClinic = () => {
    setSelectedClinic(null);
    setShowClinicForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          إدارة العيادات
        </h1>
        <Button
          onClick={handleCreateClinic}
          className="bg-primary-600 text-white"
        >
          إضافة عيادة جديدة
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فلترة العيادات</CardTitle>
        </CardHeader>
        <CardContent>
          <ClinicFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة العيادات</CardTitle>
        </CardHeader>
        <CardContent>
          <ClinicsTable
            clinics={clinics || []}
            loading={isLoading}
            onEdit={handleEditClinic}
            onDelete={(id) => console.log('Delete clinic:', id)}
            onToggleStatus={(id) => console.log('Toggle clinic status:', id)}
          />
        </CardContent>
      </Card>

      {showClinicForm && (
        <ClinicForm
          isOpen={showClinicForm}
          onClose={() => setShowClinicForm(false)}
          clinic={selectedClinic}
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
// src/pages/admin/Reports.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { SystemReport } from '@/components/reports/SystemReport';
import { UserReport } from '@/components/reports/UserReport';
import { FinancialReport } from '@/components/reports/FinancialReport';
import { AppointmentReport } from '@/components/reports/AppointmentReport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { adminService } from '@/services/adminService';

export const AdminReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('system');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  });

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['adminReports', dateRange],
    queryFn: () => adminService.getReports(dateRange),
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
              <TabsTrigger value="system">النظام</TabsTrigger>
              <TabsTrigger value="users">المستخدمين</TabsTrigger>
              <TabsTrigger value="financial">المالية</TabsTrigger>
              <TabsTrigger value="appointments">المواعيد</TabsTrigger>
            </TabsList>

            <TabsContent value="system">
              <SystemReport 
                data={reportsData?.system} 
                loading={isLoading}
              />
            </TabsContent>

            <TabsContent value="users">
              <UserReport 
                data={reportsData?.users} 
                loading={isLoading}
              />
            </TabsContent>

            <TabsContent value="financial">
              <FinancialReport 
                data={reportsData?.financial} 
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

---

## ⚙️ إعدادات النظام

### **Settings Page**

```typescript
// src/pages/admin/Settings.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { adminService } from '@/services/adminService';

const settingsSchema = z.object({
  siteName: z.string().min(1, 'اسم الموقع مطلوب'),
  siteDescription: z.string().min(1, 'وصف الموقع مطلوب'),
  contactEmail: z.string().email('البريد الإلكتروني غير صحيح'),
  contactPhone: z.string().min(1, 'رقم الهاتف مطلوب'),
  timezone: z.string().min(1, 'المنطقة الزمنية مطلوبة'),
  language: z.string().min(1, 'اللغة مطلوبة'),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await adminService.updateSettings(data);
      setMessage('تم تحديث الإعدادات بنجاح');
    } catch (error: any) {
      setMessage('حدث خطأ في تحديث الإعدادات');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          إعدادات النظام
        </h1>
      </div>

      <Card>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">عام</TabsTrigger>
              <TabsTrigger value="security">الأمان</TabsTrigger>
              <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
              <TabsTrigger value="backup">النسخ الاحتياطي</TabsTrigger>
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
                    label="اسم الموقع"
                    {...register('siteName')}
                    error={errors.siteName?.message}
                  />

                  <Input
                    label="البريد الإلكتروني للتواصل"
                    type="email"
                    {...register('contactEmail')}
                    error={errors.contactEmail?.message}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="رقم الهاتف"
                    {...register('contactPhone')}
                    error={errors.contactPhone?.message}
                  />

                  <Input
                    label="المنطقة الزمنية"
                    {...register('timezone')}
                    error={errors.timezone?.message}
                  />
                </div>

                <Input
                  label="وصف الموقع"
                  {...register('siteDescription')}
                  error={errors.siteDescription?.message}
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

            <TabsContent value="security">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">إعدادات الأمان</h3>
                <p className="text-gray-600">إعدادات الأمان ستكون متاحة قريباً</p>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">إعدادات الإشعارات</h3>
                <p className="text-gray-600">إعدادات الإشعارات ستكون متاحة قريباً</p>
              </div>
            </TabsContent>

            <TabsContent value="backup">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">النسخ الاحتياطي</h3>
                <p className="text-gray-600">إعدادات النسخ الاحتياطي ستكون متاحة قريباً</p>
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

### **1. Admin Dashboard Test**

```typescript
// src/pages/admin/__tests__/Dashboard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminDashboard } from '../Dashboard';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('Admin Dashboard', () => {
  it('renders dashboard with stats cards', () => {
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <AdminDashboard />
      </QueryClientProvider>
    );
    
    expect(screen.getByText('إجمالي المستخدمين')).toBeInTheDocument();
    expect(screen.getByText('المواعيد اليوم')).toBeInTheDocument();
  });
});
```

---

## 📝 ملاحظات المرحلة الرابعة

1. **التحكم الشامل**: إدارة كاملة لجميع جوانب النظام
2. **الأمان**: حماية البيانات والمستخدمين
3. **المراقبة**: مراقبة صحة النظام والأداء
4. **التقارير**: تقارير شاملة ومفصلة
5. **الإعدادات**: إعدادات مرنة وقابلة للتخصيص

---

*تم إعداد هذه المرحلة لتوفير تحكم إداري شامل ومتطور*
