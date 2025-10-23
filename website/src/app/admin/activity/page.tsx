'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/admin/DataTable';
import { DetailModal } from '@/components/admin/modals/DetailModal';
import { Activity, Filter, Download, Eye, User, Calendar, AlertCircle } from 'lucide-react';

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

const mockData: ActivityLog[] = [
  {
    id: '1',
    userId: '1',
    userName: 'أحمد محمد',
    action: 'USER_LOGIN',
    description: 'تسجيل دخول المستخدم',
    severity: 'LOW',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    userId: '2',
    userName: 'سارة أحمد',
    action: 'APPOINTMENT_CREATED',
    description: 'إنشاء موعد جديد',
    severity: 'MEDIUM',
    ipAddress: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
    createdAt: '2024-01-15T11:15:00Z',
  },
  {
    id: '3',
    userId: '1',
    userName: 'أحمد محمد',
    action: 'USER_DELETED',
    description: 'حذف مستخدم',
    severity: 'HIGH',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: '2024-01-15T12:00:00Z',
  },
  {
    id: '4',
    userId: '3',
    userName: 'محمد علي',
    action: 'SYSTEM_ERROR',
    description: 'خطأ في النظام',
    severity: 'CRITICAL',
    ipAddress: '192.168.1.3',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: '2024-01-15T13:30:00Z',
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'LOW':
      return 'bg-green-100 text-green-800';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800';
    case 'CRITICAL':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getSeverityLabel = (severity: string) => {
  switch (severity) {
    case 'LOW':
      return 'منخفض';
    case 'MEDIUM':
      return 'متوسط';
    case 'HIGH':
      return 'عالي';
    case 'CRITICAL':
      return 'حرج';
    default:
      return 'غير محدد';
  }
};

export default function ActivityLogPage() {
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    severity: '',
    user: '',
    action: '',
    dateFrom: '',
    dateTo: '',
  });

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activity-logs', filters],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockData;
    },
  });

  const columns = [
    {
      key: 'userName' as keyof ActivityLog,
      label: 'المستخدم',
      render: (value: string, row: ActivityLog) => (
        <div className="flex items-center">
          <User className="h-4 w-4 ml-2 text-gray-400" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'action' as keyof ActivityLog,
      label: 'الإجراء',
      render: (value: string, row: ActivityLog) => (
        <div className="flex items-center">
          <Activity className="h-4 w-4 ml-2 text-gray-400" />
          <span className="font-medium">{row.description}</span>
        </div>
      ),
    },
    {
      key: 'severity' as keyof ActivityLog,
      label: 'الأولوية',
      render: (value: string) => (
        <Badge className={getSeverityColor(value)}>
          {getSeverityLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'ipAddress' as keyof ActivityLog,
      label: 'عنوان IP',
      render: (value: string) => (
        <span className="font-mono text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: 'createdAt' as keyof ActivityLog,
      label: 'التاريخ',
      render: (value: string) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 ml-2 text-gray-400" />
          <span className="text-sm text-gray-600">
            {new Date(value).toLocaleString('ar-SA')}
          </span>
        </div>
      ),
    },
  ];

  const handleViewDetails = (activity: ActivityLog) => {
    setSelectedActivity(activity);
    setDetailModalOpen(true);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting activity logs...');
  };

  const handleFilter = () => {
    // Implement filter functionality
    console.log('Filtering activity logs...', filters);
  };

  const detailFields = [
    { key: 'userName', label: 'المستخدم' },
    { key: 'action', label: 'الإجراء' },
    { key: 'description', label: 'الوصف' },
    { key: 'severity', label: 'الأولوية', render: (value: string) => (
      <Badge className={getSeverityColor(value)}>
        {getSeverityLabel(value)}
      </Badge>
    )},
    { key: 'ipAddress', label: 'عنوان IP' },
    { key: 'userAgent', label: 'متصفح المستخدم' },
    { key: 'createdAt', label: 'التاريخ', render: (value: string) => 
      new Date(value).toLocaleString('ar-SA')
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">سجل الأنشطة</h1>
          <p className="text-gray-600">مراقبة جميع العمليات والأنشطة في النظام</p>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button variant="outline" onClick={handleFilter}>
            <Filter className="h-4 w-4 ml-2" />
            فلترة
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-600">إجمالي الأنشطة</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-600">الأخطاء الحرجة</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-600">المستخدمين النشطين</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-600">اليوم</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>سجل الأنشطة</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={activities || []}
            columns={columns}
            searchable
            filterable
            exportable
            onView={handleViewDetails}
            loading={isLoading}
            emptyMessage="لا توجد أنشطة مسجلة"
          />
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <DetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="تفاصيل النشاط"
        data={selectedActivity || {}}
        fields={detailFields}
        onView={() => console.log('View full details')}
      />
    </div>
  );
}
