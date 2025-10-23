'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChartCard } from '@/components/admin/ChartCard';
import { StatsCard } from '@/components/admin/StatsCard';
import { adminService } from '@/lib/api/admin';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Building2,
  Stethoscope,
  FileText,
  BarChart3
} from 'lucide-react';

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedReport, setSelectedReport] = useState<string>('overview');

  // إحصائيات عامة
  const { data: overviewStats, isLoading: overviewLoading } = useQuery({
    queryKey: ['admin-overview-stats'],
    queryFn: () => adminService.getOverviewStats(),
  });

  // إحصائيات المواعيد
  const { data: appointmentsStats, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['admin-appointments-stats', selectedPeriod],
    queryFn: () => adminService.getAppointmentsStats(selectedPeriod === 'year' ? 'month' : selectedPeriod),
  });

  // إحصائيات الأطباء
  const { data: doctorsStats, isLoading: doctorsLoading } = useQuery({
    queryKey: ['admin-doctors-stats'],
    queryFn: () => adminService.getDoctorsStats(),
  });

  // نمو المستخدمين
  const { data: usersGrowthStats, isLoading: usersGrowthLoading } = useQuery({
    queryKey: ['admin-users-growth-stats', selectedPeriod],
    queryFn: () => adminService.getUsersGrowthStats(selectedPeriod),
  });

  // إحصائيات قوائم الانتظار
  const { data: waitingListStats, isLoading: waitingListLoading } = useQuery({
    queryKey: ['admin-waiting-list-stats'],
    queryFn: () => adminService.getWaitingListStats(),
  });

  // إحصائيات الاستشارات
  const { data: consultationsStats, isLoading: consultationsLoading } = useQuery({
    queryKey: ['admin-consultations-stats'],
    queryFn: () => adminService.getConsultationsStats(),
  });

  const handleExportReport = (format: 'pdf' | 'excel') => {
    // TODO: تنفيذ تصدير التقرير
    console.log(`تصدير التقرير بصيغة ${format}`);
  };

  const reportTypes = [
    { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
    { id: 'appointments', label: 'المواعيد', icon: Calendar },
    { id: 'users', label: 'المستخدمين', icon: Users },
    { id: 'doctors', label: 'الأطباء', icon: Stethoscope },
    { id: 'clinics', label: 'العيادات', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">التقارير والإحصائيات</h1>
          <p className="text-gray-600">تقارير شاملة عن أداء النظام</p>
        </div>
      </div>

      <div className="p-6">
        {/* أدوات التحكم */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع التقرير
                  </label>
                  <select
                    value={selectedReport}
                    onChange={(e) => setSelectedReport(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {reportTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفترة الزمنية
                  </label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                  <option value="week">أسبوعي</option>
                  <option value="month">شهري</option>
                  <option value="year">سنوي</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleExportReport('pdf')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  تصدير PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportReport('excel')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  تصدير Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* تقرير النظرة العامة */}
        {selectedReport === 'overview' && (
          <div className="space-y-6">
            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="إجمالي المستخدمين"
                value={overviewStats?.overview?.totalUsers || 0}
                icon={Users}
                color="blue"
                trend={{ value: '+12% من الشهر الماضي', isPositive: true }}
              />
              <StatsCard
                title="العيادات النشطة"
                value={overviewStats?.overview?.totalClinics || 0}
                icon={Building2}
                color="green"
              />
              <StatsCard
                title="المواعيد اليوم"
                value={overviewStats?.overview?.pendingAppointments || 0}
                icon={Calendar}
                color="purple"
              />
              <StatsCard
                title="الأطباء النشطين"
                value={overviewStats?.overview?.activeDoctors || 0}
                icon={Stethoscope}
                color="orange"
              />
            </div>

            {/* الرسوم البيانية */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="توزيع المستخدمين حسب النوع" description="إحصائيات المستخدمين">
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>رسم بياني للمستخدمين سيظهر هنا</p>
                  </div>
                </div>
              </ChartCard>

                <ChartCard title="نمو المستخدمين" description={`نمو المستخدمين ${selectedPeriod === 'week' ? 'الأسبوعي' : selectedPeriod === 'month' ? 'الشهري' : 'السنوي'}`}>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>رسم بياني للنمو سيظهر هنا</p>
                  </div>
                </div>
              </ChartCard>
            </div>
          </div>
        )}

        {/* تقرير المواعيد */}
        {selectedReport === 'appointments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="إجمالي المواعيد"
                value={appointmentsStats?.total || 0}
                icon={Calendar}
                color="blue"
              />
              <StatsCard
                title="المواعيد المكتملة"
                value={overviewStats?.overview?.completedAppointments || 0}
                icon={Calendar}
                color="green"
              />
              <StatsCard
                title="المواعيد الملغية"
                value={overviewStats?.overview?.pendingAppointments || 0}
                icon={Calendar}
                color="red"
              />
            </div>

            <ChartCard title="توزيع المواعيد حسب العيادة" description="إحصائيات المواعيد حسب العيادة">
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>رسم بياني للمواعيد سيظهر هنا</p>
                </div>
              </div>
            </ChartCard>
          </div>
        )}

        {/* تقرير المستخدمين */}
        {selectedReport === 'users' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="إجمالي المستخدمين"
                value={overviewStats?.overview?.totalUsers || 0}
                icon={Users}
                color="blue"
              />
              <StatsCard
                title="الأطباء"
                value={overviewStats?.usersByRole?.find(r => r.role === 'DOCTOR')?.count || 0}
                icon={Stethoscope}
                color="green"
              />
              <StatsCard
                title="المرضى"
                value={overviewStats?.usersByRole?.find(r => r.role === 'PATIENT')?.count || 0}
                icon={Users}
                color="purple"
              />
            </div>

            <ChartCard title="نمو المستخدمين" description="معدل نمو المستخدمين مع الوقت">
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>رسم بياني لنمو المستخدمين سيظهر هنا</p>
                </div>
              </div>
            </ChartCard>
          </div>
        )}

        {/* تقرير الأطباء */}
        {selectedReport === 'doctors' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="إجمالي الأطباء"
                value={doctorsStats?.totalDoctors || 0}
                icon={Stethoscope}
                color="blue"
              />
              <StatsCard
                title="الأطباء النشطين"
                value={doctorsStats?.availableDoctors || 0}
                icon={Stethoscope}
                color="green"
              />
              <StatsCard
                title="متوسط التقييم"
                value="4.8"
                icon={TrendingUp}
                color="orange"
              />
            </div>

            <ChartCard title="أكثر الأطباء حجزاً" description="الأطباء الأكثر طلباً">
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>رسم بياني للأطباء سيظهر هنا</p>
                </div>
              </div>
            </ChartCard>
          </div>
        )}

        {/* تقرير العيادات */}
        {selectedReport === 'clinics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="إجمالي العيادات"
                value={overviewStats?.overview?.totalClinics || 0}
                icon={Building2}
                color="blue"
              />
              <StatsCard
                title="التخصصات المتاحة"
                value={overviewStats?.overview?.totalSpecialties || 0}
                icon={Stethoscope}
                color="green"
              />
              <StatsCard
                title="قوائم الانتظار"
                value={overviewStats?.overview?.waitingListCount || 0}
                icon={Users}
                color="orange"
              />
            </div>

            <ChartCard title="توزيع العيادات" description="إحصائيات العيادات والأقسام">
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>رسم بياني للعيادات سيظهر هنا</p>
                </div>
              </div>
            </ChartCard>
          </div>
        )}
      </div>
    </div>
  );
}
