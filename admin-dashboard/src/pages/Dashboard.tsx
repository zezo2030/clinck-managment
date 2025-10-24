import React from 'react';
import { AdminLayout } from '@/components/layout';
import { StatsCard, ChartCard, PageHeader } from '@/components/ui';
import { useOverviewStats, useAppointmentsStats, useUsersGrowthStats } from '@/hooks';
import { Users, Stethoscope, Building2, Calendar } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { APPOINTMENT_STATUS_LABELS, CHART_COLORS } from '@/utils/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Dashboard: React.FC = () => {
  const { data: overviewStats, isLoading: overviewLoading } = useOverviewStats();
  const [apptPeriod, setApptPeriod] = React.useState<'day' | 'week' | 'month'>('day');
  const [usersPeriod, setUsersPeriod] = React.useState<'week' | 'month' | 'year'>('month');
  const { data: appointmentsStats, isLoading: appointmentsLoading } = useAppointmentsStats(apptPeriod);
  const { data: usersGrowthStats, isLoading: usersGrowthLoading } = useUsersGrowthStats(usersPeriod);

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
            description="إحصائيات نمو المستخدمين حسب الفترة"
            headerAction={(
              <Select value={usersPeriod} onValueChange={(v: any) => setUsersPeriod(v)}>
                <SelectTrigger className="w-28 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">أسبوع</SelectItem>
                  <SelectItem value="month">شهر</SelectItem>
                  <SelectItem value="year">سنة</SelectItem>
                </SelectContent>
              </Select>
            )}
          >
            {usersGrowthLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usersGrowthStats?.byMonth || []} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" name="المستخدمون" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>

          <ChartCard
            title="إحصائيات المواعيد"
            description="توزيع المواعيد حسب الحالة"
            headerAction={(
              <Select value={apptPeriod} onValueChange={(v: any) => setApptPeriod(v)}>
                <SelectTrigger className="w-28 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">يوم</SelectItem>
                  <SelectItem value="week">أسبوع</SelectItem>
                  <SelectItem value="month">شهر</SelectItem>
                </SelectContent>
              </Select>
            )}
          >
            {appointmentsLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(appointmentsStats?.byStatus || []).map((s, i) => ({
                    name: APPOINTMENT_STATUS_LABELS[s.status as keyof typeof APPOINTMENT_STATUS_LABELS] || s.status,
                    count: s.count,
                    fill: CHART_COLORS[i % CHART_COLORS.length],
                  }))} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="عدد المواعيد">
                      {(appointmentsStats?.byStatus || []).map((_, i) => (
                        <rect key={i} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>
          <ChartCard
            title="المواعيد يومياً"
            description="عدد المواعيد حسب اليوم"
            headerAction={(
              <Select value={apptPeriod} onValueChange={(v: any) => setApptPeriod(v)}>
                <SelectTrigger className="w-28 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">يوم</SelectItem>
                  <SelectItem value="week">أسبوع</SelectItem>
                  <SelectItem value="month">شهر</SelectItem>
                </SelectContent>
              </Select>
            )}
          >
            {appointmentsLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={appointmentsStats?.byDay || []} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" name="عدد المواعيد" stroke="#10B981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
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

