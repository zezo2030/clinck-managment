'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth';
import { useAuth } from '@/lib/contexts/auth-context';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Calendar, MessageSquare, Bell, TrendingUp, Video, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { consultationService } from '@/lib/api/consultations';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  // الحصول على الاستشارات
  const { data: consultations } = useQuery({
    queryKey: ['consultations', user?.id, user?.role],
    queryFn: () => {
      if (user?.role === 'PATIENT') {
        return consultationService.getConsultations(parseInt(user.id));
      } else if (user?.role === 'DOCTOR') {
        return consultationService.getConsultations(undefined, parseInt(user.id));
      }
      return consultationService.getConsultations();
    },
  });

  // بيانات وهمية للعرض
  const mockAppointments = [
    {
      id: '1',
      doctor: 'د. أحمد محمد',
      specialty: 'طب الأسنان',
      date: '2025-10-25',
      time: '10:00 صباحاً',
      location: 'عيادة النور - الرياض',
      phone: '+966501234567',
      status: 'confirmed' as const,
    },
    {
      id: '2',
      doctor: 'د. فاطمة علي',
      specialty: 'طب العيون',
      date: '2025-10-28',
      time: '2:00 مساءً',
      location: 'مستشفى الملك فهد',
      phone: '+966501234568',
      status: 'pending' as const,
    },
  ];

  const mockActivities = [
    {
      id: '1',
      type: 'appointment' as const,
      title: 'تم تأكيد الموعد',
      description: 'موعدك مع د. أحمد محمد في 25 أكتوبر',
      time: 'منذ ساعتين',
      status: 'completed' as const,
    },
    {
      id: '2',
      type: 'message' as const,
      title: 'رسالة جديدة',
      description: 'رسالة من د. فاطمة علي حول نتائج الفحص',
      time: 'منذ 4 ساعات',
      status: 'pending' as const,
    },
    {
      id: '3',
      type: 'record' as const,
      title: 'تم تحديث السجل الطبي',
      description: 'تم إضافة نتائج فحص الدم الجديدة',
      time: 'منذ يوم',
      status: 'completed' as const,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header محسّن */}
        <DashboardHeader user={user} onLogout={logout} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* بطاقات الإحصائيات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="المواعيد القادمة"
              value="3"
              icon={Calendar}
              color="blue"
              trend="+1 هذا الأسبوع"
            />
            <StatsCard
              title="الاستشارات النشطة"
              value={consultations?.filter(c => c.status === 'IN_PROGRESS').length || 0}
              icon={Video}
              color="green"
              trend="جارية الآن"
            />
            <StatsCard
              title="الرسائل الجديدة"
              value="5"
              icon={MessageSquare}
              color="orange"
              trend="+2 اليوم"
            />
            <StatsCard
              title="الاستشارات المكتملة"
              value={consultations?.filter(c => c.status === 'COMPLETED').length || 0}
              icon={Users}
              color="purple"
              trend="هذا الشهر"
            />
          </div>

          {/* المحتوى الرئيسي */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* المواعيد القادمة */}
            <div className="lg:col-span-2">
              <UpcomingAppointments appointments={mockAppointments} />
            </div>

            {/* الإجراءات السريعة */}
            <div>
              <QuickActions />
            </div>
          </div>

          {/* النشاط الأخير */}
          <div className="mt-8">
            <RecentActivity activities={mockActivities} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
