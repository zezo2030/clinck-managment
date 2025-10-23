'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { adminService } from '@/lib/api/admin';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle,
  Play,
  Pause,
  User,
  Stethoscope,
  Calendar
} from 'lucide-react';

interface Consultation {
  id: number;
  appointmentId: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  startedAt?: string;
  endedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  appointment?: {
    id: number;
    appointmentDate: string;
    appointmentTime: string;
    patient: {
      profile: {
        firstName: string;
        lastName: string;
        phone: string;
      };
    };
    doctor: {
      user: {
        profile: {
          firstName: string;
          lastName: string;
        };
      };
      specialization: string;
    };
    clinic: {
      name: string;
    };
  };
}

export default function ConsultationsManagementPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('today');

  // إحصائيات الاستشارات
  const { data: consultationsStats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-consultations-stats'],
    queryFn: () => adminService.getConsultationsStats(),
  });

  // قائمة الاستشارات (mock data - سيتم استبدالها بـ API حقيقي)
  const mockConsultations: Consultation[] = [
    {
      id: 1,
      appointmentId: 1,
      status: 'IN_PROGRESS',
      notes: 'استشارة طبية عامة',
      startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      appointment: {
        id: 1,
        appointmentDate: new Date().toISOString().split('T')[0],
        appointmentTime: new Date().toISOString(),
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
        clinic: {
          name: 'عيادة النور',
        },
      },
    },
    {
      id: 2,
      appointmentId: 2,
      status: 'COMPLETED',
      notes: 'فحص دوري',
      startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      endedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      appointment: {
        id: 2,
        appointmentDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().split('T')[0],
        appointmentTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
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
        clinic: {
          name: 'عيادة الأمل',
        },
      },
    },
    {
      id: 3,
      appointmentId: 3,
      status: 'PENDING',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      appointment: {
        id: 3,
        appointmentDate: new Date().toISOString().split('T')[0],
        appointmentTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        patient: {
          profile: {
            firstName: 'علي',
            lastName: 'إبراهيم',
            phone: '01234567892',
          },
        },
        doctor: {
          user: {
            profile: {
              firstName: 'د. نورا',
              lastName: 'سعد',
            },
          },
          specialization: 'نساء',
        },
        clinic: {
          name: 'عيادة المستقبل',
        },
      },
    },
  ];

  const filteredConsultations = mockConsultations.filter(consultation => {
    const matchesStatus = selectedStatus === 'all' || consultation.status === selectedStatus;
    return matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING': return 'secondary';
      case 'IN_PROGRESS': return 'default';
      case 'COMPLETED': return 'default';
      case 'CANCELLED': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'معلقة';
      case 'IN_PROGRESS': return 'جارية';
      case 'COMPLETED': return 'مكتملة';
      case 'CANCELLED': return 'ملغية';
      default: return status;
    }
  };

  const formatDuration = (startedAt: string, endedAt?: string) => {
    const start = new Date(startedAt);
    const end = endedAt ? new Date(endedAt) : new Date();
    const duration = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    return `${duration} دقيقة`;
  };

  const handleStartConsultation = (consultation: Consultation) => {
    // TODO: تنفيذ بدء الاستشارة
    console.log('بدء الاستشارة:', consultation);
  };

  const handleEndConsultation = (consultation: Consultation) => {
    // TODO: تنفيذ إنهاء الاستشارة
    console.log('إنهاء الاستشارة:', consultation);
  };

  const handleCancelConsultation = (consultation: Consultation) => {
    const reason = prompt('سبب الإلغاء:');
    if (reason) {
      // TODO: تنفيذ إلغاء الاستشارة
      console.log('إلغاء الاستشارة:', consultation, reason);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">إدارة الاستشارات</h1>
          <p className="text-gray-600">إدارة جميع الاستشارات الطبية</p>
        </div>
      </div>

      <div className="p-6">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الاستشارات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {consultationsStats?.totalConsultations || 0}
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
                <p className="text-sm font-medium text-gray-600">الاستشارات المكتملة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {consultationsStats?.consultationsByStatus?.COMPLETED || 0}
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
                <p className="text-sm font-medium text-gray-600">الاستشارات الجارية</p>
                <p className="text-2xl font-bold text-gray-900">
                  {consultationsStats?.consultationsByStatus?.IN_PROGRESS || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">متوسط المدة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {consultationsStats?.averageDurationMinutes || 0} دقيقة
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* فلترة الاستشارات */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
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
                  <option value="PENDING">معلقة</option>
                  <option value="IN_PROGRESS">جارية</option>
                  <option value="COMPLETED">مكتملة</option>
                  <option value="CANCELLED">ملغية</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفترة الزمنية
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="today">اليوم</option>
                  <option value="week">هذا الأسبوع</option>
                  <option value="month">هذا الشهر</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedStatus('all');
                    setSelectedPeriod('today');
                  }}
                >
                  مسح الفلاتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* قائمة الاستشارات */}
        <div className="space-y-4">
          {filteredConsultations.map((consultation) => (
            <Card key={consultation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="mr-4">
                      <h3 className="font-semibold text-gray-900">
                        استشارة #{consultation.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {consultation.appointment?.patient?.profile?.firstName} {consultation.appointment?.patient?.profile?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(consultation.status)}>
                      {getStatusLabel(consultation.status)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">الطبيب:</span>
                      <span className="text-sm font-medium">
                        {consultation.appointment?.doctor?.user?.profile?.firstName} {consultation.appointment?.doctor?.user?.profile?.lastName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">التخصص:</span>
                      <span className="text-sm font-medium">
                        {consultation.appointment?.doctor?.specialization}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">العيادة:</span>
                      <span className="text-sm font-medium">
                        {consultation.appointment?.clinic?.name}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">تاريخ الموعد:</span>
                      <span className="text-sm font-medium">
                        {new Date(consultation.appointment?.appointmentDate || '').toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    {consultation.startedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">وقت البداية:</span>
                        <span className="text-sm font-medium">
                          {new Date(consultation.startedAt).toLocaleTimeString('ar-SA')}
                        </span>
                      </div>
                    )}
                    {consultation.endedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">وقت الانتهاء:</span>
                        <span className="text-sm font-medium">
                          {new Date(consultation.endedAt).toLocaleTimeString('ar-SA')}
                        </span>
                      </div>
                    )}
                    {consultation.startedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">المدة:</span>
                        <span className="text-sm font-medium">
                          {formatDuration(consultation.startedAt, consultation.endedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {consultation.notes && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">الملاحظات:</span>
                    <p className="text-sm text-gray-900 mt-1">{consultation.notes}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {consultation.status === 'PENDING' && (
                    <Button
                      size="sm"
                      onClick={() => handleStartConsultation(consultation)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      بدء الاستشارة
                    </Button>
                  )}
                  {consultation.status === 'IN_PROGRESS' && (
                    <Button
                      size="sm"
                      onClick={() => handleEndConsultation(consultation)}
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      إنهاء الاستشارة
                    </Button>
                  )}
                  {consultation.status !== 'COMPLETED' && consultation.status !== 'CANCELLED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelConsultation(consultation)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      إلغاء الاستشارة
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => console.log('عرض تفاصيل الاستشارة:', consultation)}
                  >
                    عرض التفاصيل
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredConsultations.length === 0 && (
          <Card className="p-8">
            <CardContent className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد استشارات</h3>
              <p className="text-gray-600">لا توجد استشارات تطابق الفلاتر المحددة</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
