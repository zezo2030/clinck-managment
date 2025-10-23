'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  Building2, 
  Calendar, 
  Stethoscope,
  UserPlus,
  Settings,
  FileText,
  Bell
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary';
}

interface QuickActionsProps {
  onActionClick?: (actionId: string) => void;
  className?: string;
}

const defaultActions: QuickAction[] = [
  {
    id: 'add-user',
    label: 'إضافة مستخدم',
    icon: UserPlus,
    onClick: () => {},
  },
  {
    id: 'add-doctor',
    label: 'إضافة طبيب',
    icon: Stethoscope,
    onClick: () => {},
  },
  {
    id: 'add-clinic',
    label: 'إضافة عيادة',
    icon: Building2,
    onClick: () => {},
  },
  {
    id: 'schedule-appointment',
    label: 'جدولة موعد',
    icon: Calendar,
    onClick: () => {},
  },
  {
    id: 'view-reports',
    label: 'التقارير',
    icon: FileText,
    onClick: () => {},
  },
  {
    id: 'notifications',
    label: 'التنبيهات',
    icon: Bell,
    onClick: () => {},
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    icon: Settings,
    onClick: () => {},
  },
  {
    id: 'manage-users',
    label: 'إدارة المستخدمين',
    icon: Users,
    onClick: () => {},
  },
];

export const QuickActions: React.FC<QuickActionsProps> = ({
  onActionClick,
  className,
}) => {
  const handleActionClick = (action: QuickAction) => {
    action.onClick();
    onActionClick?.(action.id);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          الإجراءات السريعة
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-3">
          {defaultActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant || 'outline'}
                className="justify-start h-auto p-3 flex-col gap-2"
                onClick={() => handleActionClick(action)}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
