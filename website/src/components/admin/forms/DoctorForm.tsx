'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface DoctorFormData {
  userId: number;
  clinicId: number;
  specialtyId: number;
  departmentId: number;
  specialization: string;
  licenseNumber: string;
  experience: number;
  consultationFee: string;
  isAvailable: boolean;
}

interface DoctorFormProps {
  initialData?: Partial<DoctorFormData>;
  onSubmit: (data: DoctorFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  clinics?: Array<{ id: number; name: string }>;
  specialties?: Array<{ id: number; name: string }>;
  departments?: Array<{ id: number; name: string }>;
  users?: Array<{ id: number; name: string }>;
}

export function DoctorForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading = false,
  clinics = [],
  specialties = [],
  departments = [],
  users = []
}: DoctorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorFormData>({
    defaultValues: initialData,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>معلومات الطبيب</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المستخدم
              </label>
              <select
                {...register('userId', { required: 'المستخدم مطلوب' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">اختر المستخدم</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {errors.userId && (
                <p className="text-red-500 text-xs mt-1">{errors.userId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                العيادة
              </label>
              <select
                {...register('clinicId', { required: 'العيادة مطلوبة' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">اختر العيادة</option>
                {clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </select>
              {errors.clinicId && (
                <p className="text-red-500 text-xs mt-1">{errors.clinicId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                التخصص
              </label>
              <select
                {...register('specialtyId', { required: 'التخصص مطلوب' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">اختر التخصص</option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                ))}
              </select>
              {errors.specialtyId && (
                <p className="text-red-500 text-xs mt-1">{errors.specialtyId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                القسم
              </label>
              <select
                {...register('departmentId', { required: 'القسم مطلوب' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">اختر القسم</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <p className="text-red-500 text-xs mt-1">{errors.departmentId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                التخصص الدقيق
              </label>
              <Input
                {...register('specialization', { required: 'التخصص الدقيق مطلوب' })}
                placeholder="أدخل التخصص الدقيق"
                className={errors.specialization ? 'border-red-500' : ''}
              />
              {errors.specialization && (
                <p className="text-red-500 text-xs mt-1">{errors.specialization.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الرخصة
              </label>
              <Input
                {...register('licenseNumber', { required: 'رقم الرخصة مطلوب' })}
                placeholder="أدخل رقم الرخصة"
                className={errors.licenseNumber ? 'border-red-500' : ''}
              />
              {errors.licenseNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.licenseNumber.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                سنوات الخبرة
              </label>
              <Input
                type="number"
                {...register('experience', { 
                  required: 'سنوات الخبرة مطلوبة',
                  min: { value: 0, message: 'يجب أن تكون القيمة أكبر من أو تساوي 0' }
                })}
                placeholder="أدخل سنوات الخبرة"
                className={errors.experience ? 'border-red-500' : ''}
              />
              {errors.experience && (
                <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رسوم الاستشارة
              </label>
              <Input
                {...register('consultationFee', { required: 'رسوم الاستشارة مطلوبة' })}
                placeholder="أدخل رسوم الاستشارة"
                className={errors.consultationFee ? 'border-red-500' : ''}
              />
              {errors.consultationFee && (
                <p className="text-red-500 text-xs mt-1">{errors.consultationFee.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('isAvailable')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="mr-2 text-sm font-medium text-gray-700">
              متاح للاستشارات
            </label>
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
