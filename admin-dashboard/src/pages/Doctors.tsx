import React from 'react';
import { AdminLayout } from '@/components/layout';
import { PageHeader, EmptyState } from '@/components/ui';
import { Stethoscope, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Doctors: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="إدارة الأطباء"
          description="عرض وإدارة جميع الأطباء في النظام"
        >
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إضافة طبيب
          </Button>
        </PageHeader>

        <EmptyState
          icon={Stethoscope}
          title="صفحة الأطباء"
          description="سيتم إضافة جدول الأطباء وإدارة الأطباء قريباً"
        />
      </div>
    </AdminLayout>
  );
};

export default Doctors;

