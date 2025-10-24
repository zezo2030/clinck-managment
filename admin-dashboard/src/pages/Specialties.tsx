import React from 'react';
import { AdminLayout } from '@/components/layout';
import { PageHeader, EmptyState } from '@/components/ui';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Specialties: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="إدارة التخصصات"
          description="عرض وإدارة جميع التخصصات الطبية"
        >
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إضافة تخصص
          </Button>
        </PageHeader>

        <EmptyState
          icon={FileText}
          title="صفحة التخصصات"
          description="سيتم إضافة جدول التخصصات وإدارة التخصصات قريباً"
        />
      </div>
    </AdminLayout>
  );
};

export default Specialties;

