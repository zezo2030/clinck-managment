import React from 'react';
import { AdminLayout } from '@/components/layout';
import { StatsCard, ChartCard, PageHeader } from '@/components/ui';
import { useOverviewStats, useAppointmentsStats, useUsersGrowthStats } from '@/hooks';
import { Users, Stethoscope, Building2, Calendar, MessageSquare, TrendingUp } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui';

const Dashboard: React.FC = () => {
  const { data: overviewStats, isLoading: overviewLoading } = useOverviewStats();
  const { data: appointmentsStats, isLoading: appointmentsLoading } = useAppointmentsStats('day');
  const { data: usersGrowthStats, isLoading: usersGrowthLoading } = useUsersGrowthStats('month');

  if (overviewLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="لوحة التحكم"
          description="نظرة عامة على النظام والإحصائيات"
        />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="إجمالي المستخدمين"
            value={overviewStats?.totalUsers || 0}
            icon={Users}
            trend={{
              value: 12,
              label: 'من الشهر الماضي',
              isPositive: true,
            }}
          />
          <StatsCard
            title="الأطباء"
            value={overviewStats?.totalDoctors || 0}
            icon={Stethoscope}
            trend={{
              value: 8,
              label: 'من الشهر الماضي',
              isPositive: true,
            }}
          />
          <StatsCard
            title="العيادات"
            value={overviewStats?.totalClinics || 0}
            icon={Building2}
            trend={{
              value: 2,
              label: 'من الشهر الماضي',
              isPositive: true,
            }}
          />
          <StatsCard
            title="المواعيد اليوم"
            value={overviewStats?.activeAppointments || 0}
            icon={Calendar}
            trend={{
              value: 15,
              label: 'من الأمس',
              isPositive: true,
            }}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard
            title="نمو المستخدمين"
            description="إحصائيات نمو المستخدمين خلال الشهر الماضي"
          >
            {usersGrowthLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                  <p>رسم بياني لنمو المستخدمين</p>
                  <p className="text-sm">سيتم إضافة الرسوم البيانية قريباً</p>
                </div>
              </div>
            )}
          </ChartCard>

          <ChartCard
            title="إحصائيات المواعيد"
            description="توزيع المواعيد حسب الحالة"
          >
            {appointmentsLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-2" />
                  <p>رسم بياني للمواعيد</p>
                  <p className="text-sm">سيتم إضافة الرسوم البيانية قريباً</p>
                </div>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">إجراءات سريعة</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-2 hover:bg-muted rounded">
                إضافة مستخدم جديد
              </button>
              <button className="w-full text-left p-2 hover:bg-muted rounded">
                إضافة طبيب جديد
              </button>
              <button className="w-full text-left p-2 hover:bg-muted rounded">
                إضافة عيادة جديدة
              </button>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">الأنشطة الأخيرة</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• تم تسجيل مستخدم جديد</p>
              <p>• تم إضافة موعد جديد</p>
              <p>• تم إنهاء استشارة</p>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">التنبيهات</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800">3 مواعيد معلقة</p>
              </div>
              <div className="p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800">استشارة عاجلة</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

