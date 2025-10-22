'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              لوحة التحكم
            </h1>
            <p className="mt-2 text-gray-600">
              مرحباً بك في نظام إدارة العيادات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* معلومات المستخدم */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                معلومات الحساب
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">الاسم:</span> {user?.name || 'غير محدد'}</p>
                <p><span className="font-medium">البريد الإلكتروني:</span> {user?.email}</p>
                <p><span className="font-medium">الدور:</span>
                  <span className="capitalize ml-1">{user?.role?.toLowerCase()}</span>
                </p>
              </div>
            </Card>

            {/* إحصائيات سريعة */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                الإحصائيات
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>المواعيد</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span>الرسائل</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span>الإشعارات</span>
                  <span className="font-semibold">0</span>
                </div>
              </div>
            </Card>

            {/* الإجراءات السريعة */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                الإجراءات السريعة
              </h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  حجز موعد جديد
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  عرض المواعيد
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  تعديل الملف الشخصي
                </Button>
              </div>
            </Card>
          </div>

          {/* زر تسجيل الخروج */}
          <div className="mt-8 text-center">
            <Button
              onClick={logout}
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
