import React from 'react';
import { AdminLayout } from '@/components/layout';
import { PageHeader, EmptyState } from '@/components/ui';
import { Bell } from 'lucide-react';

const WaitingList: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="قوائم الانتظار"
          description="عرض وإدارة قوائم الانتظار للمرضى"
        />

        <EmptyState
          icon={Bell}
          title="صفحة قوائم الانتظار"
          description="سيتم إضافة إدارة قوائم الانتظار قريباً"
        />
      </div>
    </AdminLayout>
  );
};

export default WaitingList;

