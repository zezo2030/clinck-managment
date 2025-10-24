'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/contexts/auth-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  firstName: z.string().min(2, 'الاسم الأول يجب أن يكون حرفين على الأقل'),
  lastName: z.string().min(2, 'الاسم الأخير يجب أن يكون حرفين على الأقل'),
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  role: z.enum(['PATIENT', 'DOCTOR']).default('PATIENT'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  className?: string;
}

const roleOptions = [
  { value: 'PATIENT', label: 'مريض' },
  { value: 'DOCTOR', label: 'طبيب' },
];

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  className
}) => {
  const [error, setError] = useState<string>('');
  const { register: registerUser, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'PATIENT',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      const { confirmPassword, ...registerData } = data;

      await registerUser(registerData);
      onSuccess?.();
    } catch (error: any) {
      setError(error.message || 'حدث خطأ أثناء إنشاء الحساب');
    }
  };

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            إنشاء حساب جديد
          </h2>
          <p className="text-gray-600 text-center mt-2">
            أدخل بياناتك لإنشاء حساب جديد
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="الاسم الأول"
              type="text"
              placeholder="الاسم الأول"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Input
              label="الاسم الأخير"
              type="text"
              placeholder="الاسم الأخير"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>

          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="example@email.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="رقم الهاتف (اختياري)"
            type="tel"
            placeholder="+966501234567"
            {...register('phone')}
            error={errors.phone?.message}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              نوع الحساب
            </label>
            <select
              {...register('role')}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.role?.message && (
              <p className="text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <Input
            label="كلمة المرور"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />

          <Input
            label="تأكيد كلمة المرور"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'جارٍ إنشاء الحساب...' : 'إنشاء الحساب'}
          </Button>
        </form>

        {onSwitchToLogin && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              لديك حساب بالفعل؟{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                تسجيل الدخول
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
