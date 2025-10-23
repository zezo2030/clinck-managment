'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatsCard } from '@/components/admin/StatsCard';
import { ChartCard } from '@/components/admin/ChartCard';
import { QuickActions } from '@/components/admin/QuickActions';
import { AlertsWidget } from '@/components/admin/AlertsWidget';
import { DataTable } from '@/components/admin/DataTable';
import { adminService } from '@/lib/api/admin';
import { 
  Users, 
  Building2, 
  Calendar, 
  Stethoscope,
  Activity,
  TrendingUp,
  Clock,
  AlertCircle,
  UserCheck,
  FileText,
  MessageSquare,
  Settings,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

// مكون المواعيد القادمة
const UpcomingAppointments = () => {
  const { data: appointmentsStats, isLoading } = useQuery({
    queryKey: ['admin-appointments-stats'],
    queryFn: () => adminService.getAppointmentsStats('day'),
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">المواعيد القادمة</h3>
        <Button variant="outline" size="sm">عرض الكل</Button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">د. أحمد محمد - 10:30 ص</p>
              <p className="text-xs text-gray-500">مريض: سارة أحمد</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">د. فاطمة علي - 11:00 ص</p>
              <p className="text-xs text-gray-500">مريض: محمد حسن</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">د. خالد أحمد - 11:30 ص</p>
              <p className="text-xs text-gray-500">مريض: نورا محمد</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default function AdminDashboard() {
  const [alerts] = useState([
    {
      id: '1',
      title: 'موعد جديد',
      message: 'موعد جديد يحتاج إلى تأكيد',
      type: 'warning' as const,
      timestamp: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      title: 'طبيب جديد',
      message: 'تم إضافة طبيب جديد',
      type: 'info' as const,
      timestamp: '2024-01-15T09:15:00Z',
    },
    {
      id: '3',
      title: 'خطأ في النظام',
      message: 'خطأ في النظام - يرجى المراجعة',
      type: 'error' as const,
      timestamp: '2024-01-15T08:45:00Z',
    },
  ]);

  // Mock data for recent activities
  const recentActivities = [
    {
      id: '1',
      user: 'أحمد محمد',
      action: 'إضافة مستخدم جديد',
      time: 'منذ 5 دقائق',
      type: 'user',
    },
    {
      id: '2',
      user: 'سارة أحمد',
      action: 'تأكيد موعد',
      time: 'منذ 15 دقيقة',
      type: 'appointment',
    },
    {
      id: '3',
      user: 'محمد علي',
      action: 'إضافة عيادة جديدة',
      time: 'منذ 30 دقيقة',
      type: 'clinic',
    },
  ];

  const columns = [
    {
      key: 'user' as keyof typeof recentActivities[0],
      label: 'المستخدم',
      render: (value: string) => (
        <div className="flex items-center">
          <Users className="h-4 w-4 ml-2 text-gray-400" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'action' as keyof typeof recentActivities[0],
      label: 'الإجراء',
      render: (value: string) => (
        <span className="text-gray-900">{value}</span>
      ),
    },
    {
      key: 'time' as keyof typeof recentActivities[0],
      label: 'الوقت',
      render: (value: string) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-600">مرحباً بك في لوحة تحكم الإدارة</p>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button variant="outline">
            <Settings className="h-4 w-4 ml-2" />
            الإعدادات
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="إجمالي المستخدمين"
          value="1,234"
          icon={Users}
          color="blue"
          description="+12% من الشهر الماضي"
        />
        <StatsCard
          title="العيادات"
          value="45"
          icon={Building2}
          color="green"
          description="+3 عيادات جديدة"
        />
        <StatsCard
          title="المواعيد اليوم"
          value="89"
          icon={Calendar}
          color="purple"
          description="+15% من الأمس"
        />
        <StatsCard
          title="الأطباء"
          value="156"
          icon={Stethoscope}
          color="orange"
          description="+8 أطباء جدد"
        />
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="المواعيد خلال الأسبوع" description="إحصائيات المواعيد">
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>رسم بياني للمواعيد</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="التخصصات الطبية" description="توزيع الأطباء حسب التخصص">
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>رسم بياني للتخصصات</p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Quick Actions and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        <AlertsWidget alerts={alerts} />
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الأنشطة الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={recentActivities}
              columns={columns}
              searchable={false}
              filterable={false}
              exportable={false}
              selectable={false}
              onView={(row) => console.log('View activity:', row)}
              emptyMessage="لا توجد أنشطة حديثة"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المواعيد القادمة</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingAppointments />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}