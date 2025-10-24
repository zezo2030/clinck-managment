import React from 'react';
import { AdminLayout } from '@/components/layout';
import { PageHeader, EmptyState } from '@/components/ui';
import { MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Consultations: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="إدارة الاستشارات"
          description="عرض وإدارة جميع الاستشارات في النظام"
        >
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إضافة استشارة
          </Button>
        </PageHeader>

        <EmptyState
          icon={MessageSquare}
          title="صفحة الاستشارات"
          description="سيتم إضافة جدول الاستشارات وإدارة الاستشارات قريباً"
        />
      </div>
    </AdminLayout>
  );
};

export default Consultations;

