import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  children,
  className,
  headerAction,
}) => {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {headerAction}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

