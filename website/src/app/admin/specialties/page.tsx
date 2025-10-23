'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { specialtyService } from '@/lib/api/specialties';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

export default function SpecialtiesManagementPage() {
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const { data: specialties, isLoading } = useQuery({
    queryKey: ['specialties'],
    queryFn: () => specialtyService.getSpecialties(),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      specialtyService.updateSpecialty(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => specialtyService.deleteSpecialty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
    },
  });

  if (isLoading) return <div>جاري التحميل...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة التخصصات</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة تخصص جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialties?.map((specialty) => (
          <Card key={specialty.id} className="p-6">
            <div className="flex items-center mb-4">
              {specialty.icon && (
                <img 
                  src={specialty.icon} 
                  alt={specialty.name}
                  className="w-12 h-12 object-cover rounded-lg mr-4"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {specialty.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{specialty.doctors.length} طبيب</span>
                </div>
              </div>
              <Badge variant={specialty.isActive ? 'success' : 'secondary'}>
                {specialty.isActive ? 'نشط' : 'غير نشط'}
              </Badge>
            </div>

            {specialty.description && (
              <p className="text-sm text-gray-600 mb-4">{specialty.description}</p>
            )}

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">الخدمات:</h4>
              <div className="flex flex-wrap gap-1">
                {specialty.services.slice(0, 3).map((service, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {service}
                  </Badge>
                ))}
                {specialty.services.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{specialty.services.length - 3} أكثر
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsCreating(true)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleStatusMutation.mutate({
                  id: specialty.id,
                  isActive: !specialty.isActive
                })}
              >
                {specialty.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteMutation.mutate(specialty.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
