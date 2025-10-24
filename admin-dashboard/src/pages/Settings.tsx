import React from 'react';
import { AdminLayout } from '@/components/layout';
import { PageHeader, EmptyState } from '@/components/ui';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="الإعدادات"
          description="إعدادات النظام والحساب"
        />

        <EmptyState
          icon={SettingsIcon}
          title="صفحة الإعدادات"
          description="سيتم إضافة إعدادات النظام قريباً"
        />
      </div>
    </AdminLayout>
  );
};

export default Settings;

