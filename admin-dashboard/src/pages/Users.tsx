import React from 'react';
import { AdminLayout } from '@/components/layout';
import { PageHeader, EmptyState } from '@/components/ui';
import { Users as UsersIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Users: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="إدارة المستخدمين"
          description="عرض وإدارة جميع المستخدمين في النظام"
        >
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إضافة مستخدم
          </Button>
        </PageHeader>

        <EmptyState
          icon={UsersIcon}
          title="صفحة المستخدمين"
          description="سيتم إضافة جدول المستخدمين وإدارة المستخدمين قريباً"
        />
      </div>
    </AdminLayout>
  );
};

export default Users;

