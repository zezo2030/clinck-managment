'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/admin/DataTable';
import { DetailModal } from '@/components/admin/modals/DetailModal';
import { UserForm } from '@/components/admin/forms/UserForm';
import {
  Bell,
  Plus,
  Send,
  Users,
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Download,
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'DRAFT' | 'SENT' | 'SCHEDULED';
  recipients: string[];
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
}

const mockData: Notification[] = [
  {
    id: '1',
    title: 'تحديث النظام',
    message: 'سيتم تحديث النظام في الساعة 2:00 صباحاً',
    type: 'INFO',
    priority: 'MEDIUM',
    status: 'SENT',
    recipients: ['all'],
    createdAt: '2024-01-15T10:30:00Z',
    sentAt: '2024-01-15T10:35:00Z',
  },
  {
    id: '2',
    title: 'موعد جديد',
    message: 'تم حجز موعد جديد مع د. أحمد محمد',
    type: 'SUCCESS',
    priority: 'HIGH',
    status: 'SENT',
    recipients: ['patient@example.com'],
    createdAt: '2024-01-15T11:15:00Z',
    sentAt: '2024-01-15T11:16:00Z',
  },
  {
    id: '3',
    title: 'تنبيه أمني',
    message: 'تم اكتشاف محاولة تسجيل دخول مشبوهة',
    type: 'ERROR',
    priority: 'HIGH',
    status: 'SENT',
    recipients: ['admin@example.com'],
    createdAt: '2024-01-15T12:00:00Z',
    sentAt: '2024-01-15T12:01:00Z',
  },
  {
    id: '4',
    title: 'إشعار الصيانة',
    message: 'سيتم إيقاف النظام للصيانة غداً',
    type: 'WARNING',
    priority: 'MEDIUM',
    status: 'SCHEDULED',
    recipients: ['all'],
    createdAt: '2024-01-15T13:30:00Z',
    scheduledAt: '2024-01-16T02:00:00Z',
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'INFO':
      return 'bg-blue-100 text-blue-800';
    case 'WARNING':
      return 'bg-yellow-100 text-yellow-800';
    case 'ERROR':
      return 'bg-red-100 text-red-800';
    case 'SUCCESS':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'INFO':
      return 'معلومات';
    case 'WARNING':
      return 'تحذير';
    case 'ERROR':
      return 'خطأ';
    case 'SUCCESS':
      return 'نجاح';
    default:
      return 'غير محدد';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'LOW':
      return 'bg-green-100 text-green-800';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800';
    case 'HIGH':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'LOW':
      return 'منخفض';
    case 'MEDIUM':
      return 'متوسط';
    case 'HIGH':
      return 'عالي';
    default:
      return 'غير محدد';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return 'bg-gray-100 text-gray-800';
    case 'SENT':
      return 'bg-green-100 text-green-800';
    case 'SCHEDULED':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return 'مسودة';
    case 'SENT':
      return 'مرسل';
    case 'SCHEDULED':
      return 'مجدول';
    default:
      return 'غير محدد';
  }
};

export default function NotificationsPage() {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    priority: '',
    status: '',
    recipient: '',
  });

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', filters],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockData;
    },
  });

  const columns = [
    {
      key: 'title' as keyof Notification,
      label: 'العنوان',
      render: (value: string, row: Notification) => (
        <div className="flex items-center">
          <Bell className="h-4 w-4 ml-2 text-gray-400" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'type' as keyof Notification,
      label: 'النوع',
      render: (value: string) => (
        <Badge className={getTypeColor(value)}>
          {getTypeLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'priority' as keyof Notification,
      label: 'الأولوية',
      render: (value: string) => (
        <Badge className={getPriorityColor(value)}>
          {getPriorityLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'status' as keyof Notification,
      label: 'الحالة',
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {getStatusLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'recipients' as keyof Notification,
      label: 'المستقبلين',
      render: (value: string[]) => (
        <div className="flex items-center">
          <Users className="h-4 w-4 ml-2 text-gray-400" />
          <span className="text-sm text-gray-600">
            {value.includes('all') ? 'الجميع' : `${value.length} مستخدم`}
          </span>
        </div>
      ),
    },
    {
      key: 'createdAt' as keyof Notification,
      label: 'التاريخ',
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleString('ar-SA')}
        </span>
      ),
    },
  ];

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setDetailModalOpen(true);
  };

  const handleCreateNotification = () => {
    setCreateModalOpen(true);
  };

  const handleSendNotification = (data: any) => {
    // Implement send notification
    console.log('Sending notification:', data);
    setCreateModalOpen(false);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting notifications...');
  };

  const handleFilter = () => {
    // Implement filter functionality
    console.log('Filtering notifications...', filters);
  };

  const detailFields = [
    { key: 'title', label: 'العنوان' },
    { key: 'message', label: 'الرسالة' },
    { key: 'type', label: 'النوع', render: (value: string) => (
      <Badge className={getTypeColor(value)}>
        {getTypeLabel(value)}
      </Badge>
    )},
    { key: 'priority', label: 'الأولوية', render: (value: string) => (
      <Badge className={getPriorityColor(value)}>
        {getPriorityLabel(value)}
      </Badge>
    )},
    { key: 'status', label: 'الحالة', render: (value: string) => (
      <Badge className={getStatusColor(value)}>
        {getStatusLabel(value)}
      </Badge>
    )},
    { key: 'recipients', label: 'المستقبلين', render: (value: string[]) => 
      value.includes('all') ? 'الجميع' : value.join(', ')
    },
    { key: 'createdAt', label: 'تاريخ الإنشاء', render: (value: string) => 
      new Date(value).toLocaleString('ar-SA')
    },
    { key: 'sentAt', label: 'تاريخ الإرسال', render: (value: string) => 
      value ? new Date(value).toLocaleString('ar-SA') : '-'
    },
    { key: 'scheduledAt', label: 'تاريخ الجدولة', render: (value: string) => 
      value ? new Date(value).toLocaleString('ar-SA') : '-'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة التنبيهات</h1>
          <p className="text-gray-600">إرسال وإدارة التنبيهات للمستخدمين</p>
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
          <Button onClick={handleCreateNotification}>
            <Plus className="h-4 w-4 ml-2" />
            إرسال تنبيه
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-600">إجمالي التنبيهات</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-600">مرسل</p>
                <p className="text-2xl font-bold text-gray-900">1,100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-600">مجدول</p>
                <p className="text-2xl font-bold text-gray-900">50</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-gray-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-600">مسودة</p>
                <p className="text-2xl font-bold text-gray-900">84</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>التنبيهات</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={notifications || []}
            columns={columns}
            searchable
            filterable
            exportable
            onView={handleViewDetails}
            loading={isLoading}
            emptyMessage="لا توجد تنبيهات"
          />
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <DetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="تفاصيل التنبيه"
        data={selectedNotification || {}}
        fields={detailFields}
        onView={() => console.log('View full details')}
      />

      {/* Create Notification Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setCreateModalOpen(false)} />
            <Card className="relative z-10 w-full max-w-2xl">
              <CardHeader>
                <CardTitle>إرسال تنبيه جديد</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      العنوان
                    </label>
                    <Input placeholder="أدخل عنوان التنبيه" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الرسالة
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="أدخل محتوى التنبيه"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        النوع
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="INFO">معلومات</option>
                        <option value="WARNING">تحذير</option>
                        <option value="ERROR">خطأ</option>
                        <option value="SUCCESS">نجاح</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الأولوية
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="LOW">منخفض</option>
                        <option value="MEDIUM">متوسط</option>
                        <option value="HIGH">عالي</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المستقبلين
                    </label>
                    <Input placeholder="أدخل عناوين البريد الإلكتروني مفصولة بفواصل" />
                  </div>
                  <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                    <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                      إلغاء
                    </Button>
                    <Button type="submit">
                      <Send className="h-4 w-4 ml-2" />
                      إرسال
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
