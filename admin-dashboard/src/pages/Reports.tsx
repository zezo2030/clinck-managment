import React from 'react';
import { AdminLayout } from '@/components/layout';
import { PageHeader, EmptyState } from '@/components/ui';
import { BarChart3 } from 'lucide-react';

const Reports: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="التقارير والإحصائيات"
          description="عرض التقارير والإحصائيات المفصلة"
        />

        <EmptyState
          icon={BarChart3}
          title="صفحة التقارير"
          description="سيتم إضافة التقارير والإحصائيات المفصلة قريباً"
        />
      </div>
    </AdminLayout>
  );
};

export default Reports;

