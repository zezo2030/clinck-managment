'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AppointmentsTable } from '@/components/admin/AppointmentsTable';
import { appointmentsService } from '@/lib/api/appointments';
import { adminService } from '@/lib/api/admin';
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

export default function AppointmentsManagementPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const queryClient = useQueryClient();

  // جلب المواعيد
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', page, statusFilter, dateFilter],
    queryFn: () => appointmentsService.getAppointments({
      page,
      limit: 10,
      status: statusFilter !== 'all' ? statusFilter as any : undefined,
      date: dateFilter || undefined,
    }),
  });

  // إحصائيات المواعيد
  const { data: appointmentsStats } = useQuery({
    queryKey: ['appointments-stats'],
    queryFn: () => appointmentsService.getAppointmentsStats(),
  });

  // إحصائيات المواعيد اليومية
  const { data: dailyStats } = useQuery({
    queryKey: ['appointments-daily-stats'],
    queryFn: () => adminService.getAppointmentsStats('day'),
  });

  // تأكيد موعد
  const confirmAppointmentMutation = useMutation({
    mutationFn: (id: number) => appointmentsService.confirmAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  // إلغاء موعد
  const cancelAppointmentMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      appointmentsService.cancelAppointment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const handleEditAppointment = (appointment: any) => {
    // TODO: فتح نموذج تعديل الموعد
    console.log('تعديل الموعد:', appointment);
  };

  const handleDeleteAppointment = (appointment: any) => {
    if (confirm(`هل أنت متأكد من حذف الموعد؟`)) {
      // TODO: تنفيذ حذف الموعد
      console.log('حذف الموعد:', appointment);
    }
  };

  const handleConfirmAppointment = (appointment: any) => {
    confirmAppointmentMutation.mutate(appointment.id);
  };

  const handleCancelAppointment = (appointment: any) => {
    const reason = prompt('سبب الإلغاء (اختياري):');
    cancelAppointmentMutation.mutate({ id: appointment.id, reason: reason || undefined });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">إدارة المواعيد</h1>
          <p className="text-gray-600">إدارة جميع المواعيد في النظام</p>
        </div>
      </div>

      <div className="p-6">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المواعيد</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointmentsStats?.totalAppointments || 0}
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
                <p className="text-sm font-medium text-gray-600">مواعيد معلقة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointmentsStats?.appointmentsByStatus?.SCHEDULED || 0}
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
                <p className="text-sm font-medium text-gray-600">مواعيد مكتملة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointmentsStats?.appointmentsByStatus?.COMPLETED || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">مواعيد ملغية</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointmentsStats?.appointmentsByStatus?.CANCELLED || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* فلترة المواعيد */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  فلترة حسب الحالة
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="SCHEDULED">مجدول</option>
                  <option value="CONFIRMED">مؤكد</option>
                  <option value="IN_PROGRESS">جاري</option>
                  <option value="COMPLETED">مكتمل</option>
                  <option value="CANCELLED">ملغي</option>
                  <option value="NO_SHOW">لم يحضر</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  فلترة حسب التاريخ
                </label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter('all');
                    setDateFilter('');
                  }}
                >
                  مسح الفلاتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* المواعيد القادمة اليوم */}
        {dailyStats?.upcomingAppointments && dailyStats.upcomingAppointments.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                المواعيد القادمة اليوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dailyStats.upcomingAppointments.slice(0, 6).map((appointment: any) => (
                  <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {appointment.patient?.profile?.firstName} {appointment.patient?.profile?.lastName}
                      </h4>
                      <Badge variant="secondary">
                        {new Date(appointment.appointmentTime).toLocaleTimeString('ar-SA', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      د. {appointment.doctor?.user?.profile?.firstName} {appointment.doctor?.user?.profile?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {appointment.clinic?.name}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* جدول المواعيد */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">قائمة المواعيد</CardTitle>
              <Button onClick={() => console.log('إضافة موعد جديد')}>
                <Plus className="w-4 h-4 mr-2" />
                إضافة موعد جديد
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <AppointmentsTable
              appointments={appointments || []}
              onEdit={handleEditAppointment}
              onDelete={handleDeleteAppointment}
              onConfirm={handleConfirmAppointment}
              onCancel={handleCancelAppointment}
              loading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Pagination */}
        {appointments && appointments.length > 0 && (
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                السابق
              </Button>
              <span className="px-4 py-2 text-sm text-gray-600">
                صفحة {page}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
              >
                التالي
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
