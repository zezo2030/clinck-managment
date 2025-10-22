'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth';
import { useAuth } from '@/lib/contexts/auth-context';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Calendar, MessageSquare, Bell, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

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
              title="الرسائل الجديدة"
              value="5"
              icon={MessageSquare}
              color="green"
              trend="+2 اليوم"
            />
            <StatsCard
              title="الإشعارات"
              value="12"
              icon={Bell}
              color="orange"
              trend="+3 هذا الأسبوع"
            />
            <StatsCard
              title="نقاط الصحة"
              value="850"
              icon={TrendingUp}
              color="purple"
              trend="+50 هذا الشهر"
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
