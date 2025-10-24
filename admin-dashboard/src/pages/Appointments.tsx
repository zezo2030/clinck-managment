import React from 'react';
import { AdminLayout } from '@/components/layout';
import { PageHeader, EmptyState } from '@/components/ui';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Appointments: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="إدارة المواعيد"
          description="عرض وإدارة جميع المواعيد في النظام"
        >
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إضافة موعد
          </Button>
        </PageHeader>

        <EmptyState
          icon={Calendar}
          title="صفحة المواعيد"
          description="سيتم إضافة جدول المواعيد وإدارة المواعيد قريباً"
        />
      </div>
    </AdminLayout>
  );
};

export default Appointments;

