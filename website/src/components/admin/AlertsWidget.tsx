'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  AlertCircle, 
  Clock, 
  Users, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  count?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AlertsWidgetProps {
  alerts?: Alert[];
  className?: string;
}

const defaultAlerts: Alert[] = [
  {
    id: 'pending-appointments',
    type: 'warning',
    title: 'مواعيد معلقة',
    message: '5 مواعيد تحتاج موافقة',
    count: 5,
    action: {
      label: 'عرض المواعيد',
      onClick: () => {},
    },
  },
  {
    id: 'long-waiting-lists',
    type: 'error',
    title: 'قوائم انتظار طويلة',
    message: '3 أقسام تحتاج انتباه',
    count: 3,
    action: {
      label: 'عرض قوائم الانتظار',
      onClick: () => {},
    },
  },
  {
    id: 'new-users',
    type: 'info',
    title: 'مستخدمين جدد',
    message: '12 مستخدم جديد اليوم',
    count: 12,
    action: {
      label: 'عرض المستخدمين',
      onClick: () => {},
    },
  },
  {
    id: 'system-health',
    type: 'success',
    title: 'حالة النظام',
    message: 'جميع الخدمات تعمل بشكل طبيعي',
    action: {
      label: 'عرض التفاصيل',
      onClick: () => {},
    },
  },
];

const alertIcons = {
  warning: AlertTriangle,
  error: XCircle,
  info: AlertCircle,
  success: CheckCircle,
};

const alertColors = {
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
};

export const AlertsWidget: React.FC<AlertsWidgetProps> = ({
  alerts = defaultAlerts,
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          التنبيهات
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = alertIcons[alert.type];
            return (
              <div
                key={alert.id}
                className={`flex items-center p-3 border rounded-lg ${alertColors[alert.type]}`}
              >
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{alert.title}</p>
                    {alert.count && (
                      <Badge variant="secondary" className="text-xs">
                        {alert.count}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm opacity-90">{alert.message}</p>
                </div>
                {alert.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-2 flex-shrink-0"
                    onClick={alert.action.onClick}
                  >
                    {alert.action.label}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
