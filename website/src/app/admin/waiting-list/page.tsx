'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { adminService } from '@/lib/api/admin';
import { 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight,
  Calendar,
  User
} from 'lucide-react';

interface WaitingListEntry {
  id: number;
  patientId: number;
  doctorId: number;
  departmentId: number;
  priority: number;
  estimatedWaitTime: number;
  status: 'WAITING' | 'CALLED' | 'SEEN' | 'CANCELLED';
  createdAt: string;
  patient?: {
    profile: {
      firstName: string;
      lastName: string;
      phone: string;
    };
  };
  doctor?: {
    user: {
      profile: {
        firstName: string;
        lastName: string;
      };
    };
    specialization: string;
  };
  department?: {
    name: string;
  };
}

export default function WaitingListManagementPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const queryClient = useQueryClient();

  // إحصائيات قوائم الانتظار
  const { data: waitingListStats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-waiting-list-stats'],
    queryFn: () => adminService.getWaitingListStats(),
  });

  // قائمة الانتظار (mock data - سيتم استبدالها بـ API حقيقي)
  const mockWaitingList: WaitingListEntry[] = [
    {
      id: 1,
      patientId: 1,
      doctorId: 1,
      departmentId: 1,
      priority: 1,
      estimatedWaitTime: 30,
      status: 'WAITING',
      createdAt: new Date().toISOString(),
      patient: {
        profile: {
          firstName: 'أحمد',
          lastName: 'محمد',
          phone: '01234567890',
        },
      },
      doctor: {
        user: {
          profile: {
            firstName: 'د. سارة',
            lastName: 'علي',
          },
        },
        specialization: 'طب عام',
      },
      department: {
        name: 'الطوارئ',
      },
    },
    {
      id: 2,
      patientId: 2,
      doctorId: 2,
      departmentId: 2,
      priority: 2,
      estimatedWaitTime: 45,
      status: 'CALLED',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      patient: {
        profile: {
          firstName: 'فاطمة',
          lastName: 'حسن',
          phone: '01234567891',
        },
      },
      doctor: {
        user: {
          profile: {
            firstName: 'د. محمد',
            lastName: 'أحمد',
          },
        },
        specialization: 'أطفال',
      },
      department: {
        name: 'أطفال',
      },
    },
  ];

  const filteredWaitingList = mockWaitingList.filter(entry => {
    const matchesDepartment = selectedDepartment === 'all' || 
                             entry.department?.name === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || entry.status === selectedStatus;
    return matchesDepartment && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'WAITING': return 'secondary';
      case 'CALLED': return 'default';
      case 'SEEN': return 'default';
      case 'CANCELLED': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'WAITING': return 'في الانتظار';
      case 'CALLED': return 'تم الاستدعاء';
      case 'SEEN': return 'تم الكشف';
      case 'CANCELLED': return 'ملغي';
      default: return status;
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return 'text-red-600 bg-red-50';
    if (priority === 2) return 'text-orange-600 bg-orange-50';
    if (priority === 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority === 1) return 'عاجل';
    if (priority === 2) return 'عالي';
    if (priority === 3) return 'متوسط';
    return 'عادي';
  };

  const handleCallPatient = (entry: WaitingListEntry) => {
    // TODO: تنفيذ استدعاء المريض
    console.log('استدعاء المريض:', entry);
  };

  const handleMoveToAppointment = (entry: WaitingListEntry) => {
    // TODO: نقل المريض إلى موعد
    console.log('نقل المريض إلى موعد:', entry);
  };

  const handleRemoveFromList = (entry: WaitingListEntry) => {
    if (confirm(`هل أنت متأكد من إزالة ${entry.patient?.profile?.firstName} من قائمة الانتظار؟`)) {
      // TODO: تنفيذ إزالة من قائمة الانتظار
      console.log('إزالة من قائمة الانتظار:', entry);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">إدارة قوائم الانتظار</h1>
          <p className="text-gray-600">إدارة قوائم الانتظار في جميع الأقسام</p>
        </div>
      </div>

      <div className="p-6">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي قوائم الانتظار</p>
                <p className="text-2xl font-bold text-gray-900">
                  {waitingListStats?.totalWaiting || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">أطول قائمة انتظار</p>
                <p className="text-2xl font-bold text-gray-900">
                  {waitingListStats?.longestWaitingLists?.[0]?.count || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">تم الكشف</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockWaitingList.filter(entry => entry.status === 'SEEN').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">حالات عاجلة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockWaitingList.filter(entry => entry.priority === 1).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* فلترة قوائم الانتظار */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  فلترة حسب القسم
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">جميع الأقسام</option>
                  <option value="الطوارئ">الطوارئ</option>
                  <option value="أطفال">أطفال</option>
                  <option value="نساء">نساء</option>
                  <option value="عظام">عظام</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  فلترة حسب الحالة
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="WAITING">في الانتظار</option>
                  <option value="CALLED">تم الاستدعاء</option>
                  <option value="SEEN">تم الكشف</option>
                  <option value="CANCELLED">ملغي</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedDepartment('all');
                    setSelectedStatus('all');
                  }}
                >
                  مسح الفلاتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* قوائم الانتظار */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredWaitingList.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="mr-4">
                      <h3 className="font-semibold text-gray-900">
                        {entry.patient?.profile?.firstName} {entry.patient?.profile?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {entry.patient?.profile?.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(entry.status)}>
                      {getStatusLabel(entry.status)}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={getPriorityColor(entry.priority)}
                    >
                      {getPriorityLabel(entry.priority)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">الطبيب:</span>
                    <span className="text-sm font-medium">
                      {entry.doctor?.user?.profile?.firstName} {entry.doctor?.user?.profile?.lastName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">القسم:</span>
                    <span className="text-sm font-medium">{entry.department?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">التخصص:</span>
                    <span className="text-sm font-medium">{entry.doctor?.specialization}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">الوقت المتوقع:</span>
                    <span className="text-sm font-medium">{entry.estimatedWaitTime} دقيقة</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">وقت الإضافة:</span>
                    <span className="text-sm font-medium">
                      {new Date(entry.createdAt).toLocaleTimeString('ar-SA')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {entry.status === 'WAITING' && (
                    <Button
                      size="sm"
                      onClick={() => handleCallPatient(entry)}
                      className="flex-1"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      استدعاء المريض
                    </Button>
                  )}
                  {entry.status === 'CALLED' && (
                    <Button
                      size="sm"
                      onClick={() => handleMoveToAppointment(entry)}
                      className="flex-1"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      نقل إلى موعد
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveFromList(entry)}
                  >
                    إزالة
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredWaitingList.length === 0 && (
          <Card className="p-8">
            <CardContent className="text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد قوائم انتظار</h3>
              <p className="text-gray-600">لا توجد قوائم انتظار تطابق الفلاتر المحددة</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
