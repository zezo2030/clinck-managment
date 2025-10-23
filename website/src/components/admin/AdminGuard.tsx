'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Shield } from 'lucide-react';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user, verifySession } = useAdminAuth();

  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        // التحقق من الجلسة عبر Backend
        await verifySession();
        setIsLoading(false);
      } catch (error) {
        console.error('خطأ في التحقق من جلسة الأدمن:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    checkAdminSession();
  }, [verifySession]);

  useEffect(() => {
    if (hasError || (!isLoading && !isAuthenticated)) {
      // إعادة توجيه إلى صفحة تسجيل دخول الأدمن
      router.push('/admin/login');
    }
  }, [hasError, isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التحقق من جلسة الأدمن...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasError || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <CardContent className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              جلسة الأدمن منتهية الصلاحية
            </h2>
            <p className="text-gray-600 mb-4">
              يرجى تسجيل الدخول مرة أخرى للوصول إلى لوحة الإدارة.
            </p>
            <button
              onClick={() => router.push('/admin/login')}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              تسجيل دخول الأدمن
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // التحقق من أن المستخدم أدمن
  if (user && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <CardContent className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              غير مصرح لك بالوصول
            </h2>
            <p className="text-gray-600 mb-4">
              هذه الصفحة مخصصة للمديرين فقط. لا تملك الصلاحيات المطلوبة للوصول إلى لوحة الإدارة.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              العودة إلى الداشبورد
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
