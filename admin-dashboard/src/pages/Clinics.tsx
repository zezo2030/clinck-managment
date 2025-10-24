import React from 'react';
import { AdminLayout } from '@/components/layout';
import { PageHeader, EmptyState } from '@/components/ui';
import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Clinics: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="إدارة العيادات"
          description="عرض وإدارة جميع العيادات في النظام"
        >
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إضافة عيادة
          </Button>
        </PageHeader>

        <EmptyState
          icon={Building2}
          title="صفحة العيادات"
          description="سيتم إضافة جدول العيادات وإدارة العيادات قريباً"
        />
      </div>
    </AdminLayout>
  );
};

export default Clinics;

