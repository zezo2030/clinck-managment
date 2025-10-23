'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { X, Edit, Trash2, Eye } from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
  fields: Array<{
    key: string;
    label: string;
    render?: (value: any) => React.ReactNode;
  }>;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export function DetailModal({
  isOpen,
  onClose,
  title,
  data,
  fields,
  onEdit,
  onDelete,
  onView,
}: DetailModalProps) {
  if (!isOpen) return null;

  const renderValue = (field: any, value: any) => {
    if (field.render) {
      return field.render(value);
    }
    
    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'نعم' : 'لا'}
        </Badge>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    
    return value?.toString() || '-';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <Card className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              {onView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onView}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.key} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="font-medium text-gray-700">
                    {field.label}:
                  </div>
                  <div className="md:col-span-2 text-gray-900">
                    {renderValue(field, data[field.key])}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2 space-x-reverse pt-6 border-t border-gray-200 mt-6">
              <Button variant="outline" onClick={onClose}>
                إغلاق
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
