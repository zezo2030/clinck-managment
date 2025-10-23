'use client';

import React from 'react';
import { mockSpecialties } from '@/lib/mock-specialties';
import { SpecialtyCard } from './SpecialtyCard';

export const SpecialtiesList: React.FC = () => {
  // استخدام البيانات الوهمية مؤقتاً حتى يتم تشغيل Backend
  const specialties = mockSpecialties;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {specialties.map((specialty) => (
        <SpecialtyCard
          key={specialty.id}
          id={specialty.id}
          name={specialty.name}
          icon={specialty.icon}
        />
      ))}
    </div>
  );
};
