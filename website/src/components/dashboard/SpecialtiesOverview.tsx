'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Stethoscope, Users, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { specialtyService } from '@/lib/api/specialties';
import { mockSpecialties } from '@/lib/mock-specialties';
import { useRouter } from 'next/navigation';

export const SpecialtiesOverview: React.FC = () => {
  const router = useRouter();
  
  // استخدام البيانات الوهمية مؤقتاً حتى يتم تشغيل Backend
  const specialties = mockSpecialties;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-blue-600" />
          التخصصات المتاحة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specialties.slice(0, 6).map((specialty) => (
            <div key={specialty.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {specialty.icon && (
                    <img 
                      src={specialty.icon} 
                      alt={specialty.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  )}
                  <h3 className="font-semibold text-sm">{specialty.name}</h3>
                </div>
                <Badge variant={specialty.isActive ? 'default' : 'secondary'}>
                  {specialty.isActive ? 'نشط' : 'غير نشط'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{specialty.doctors.length} طبيب</span>
                </div>
              </div>

              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => router.push(`/specialties/${specialty.id}`)}
                >
                  عرض التفاصيل
                </Button>
                <Button 
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => router.push(`/appointments/new?specialtyId=${specialty.id}`)}
                >
                  حجز موعد
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button 
            variant="outline"
            onClick={() => router.push('/specialties')}
          >
            عرض جميع التخصصات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
