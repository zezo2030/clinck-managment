'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const adminLoginSchema = z.object({
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

interface AdminLoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  onSuccess,
  className
}) => {
  const [error, setError] = useState<string>('');
  const { login, isLoading } = useAdminAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      setError('');
      await login(data);
      onSuccess?.();
    } catch (error: any) {
      setError(error.message || 'حدث خطأ أثناء تسجيل الدخول');
    }
  };

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div className="bg-white p-8 rounded-lg shadow-md border border-red-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            تسجيل دخول الأدمن
          </h2>
          <p className="text-gray-600 text-center mt-2">
            أدخل بيانات الأدمن للوصول إلى لوحة الإدارة
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="admin@example.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="كلمة المرور"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? 'جارٍ تسجيل الدخول...' : 'تسجيل دخول الأدمن'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            هذه الصفحة مخصصة للمديرين فقط
          </p>
        </div>
      </div>
    </div>
  );
};
