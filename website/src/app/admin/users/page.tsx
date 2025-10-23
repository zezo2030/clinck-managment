'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UsersTable } from '@/components/admin/UsersTable';
import { usersService, User } from '@/lib/api/users';
import { Plus, Users, UserCheck, UserX } from 'lucide-react';

export default function UsersManagementPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // جلب المستخدمين
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', page, searchTerm, roleFilter, statusFilter],
    queryFn: () => usersService.getUsers({
      page,
      limit: 10,
      search: searchTerm || undefined,
      role: roleFilter !== 'all' ? roleFilter as any : undefined,
      isActive: statusFilter !== 'all' ? statusFilter === 'active' : undefined,
    }),
  });

  // إحصائيات المستخدمين
  const { data: usersStats } = useQuery({
    queryKey: ['users-stats'],
    queryFn: () => usersService.getUsersStats(),
  });

  // حذف مستخدم
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // تغيير حالة المستخدم
  const toggleUserStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      usersService.toggleUserStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleEditUser = (user: User) => {
    // TODO: فتح نموذج تعديل المستخدم
    console.log('تعديل المستخدم:', user);
  };

  const handleDeleteUser = (user: User) => {
    if (confirm(`هل أنت متأكد من حذف المستخدم ${user.name || user.email}؟`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const handleToggleUserStatus = (user: User) => {
    toggleUserStatusMutation.mutate({
      id: user.id,
      isActive: !user.isActive,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <p className="text-gray-600">إدارة جميع المستخدمين في النظام</p>
        </div>
      </div>

      <div className="p-6">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-gray-900">
                  {usersStats?.totalUsers || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">المستخدمين النشطين</p>
                <p className="text-2xl font-bold text-gray-900">
                  {usersStats?.activeUsers || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">المستخدمين غير النشطين</p>
                <p className="text-2xl font-bold text-gray-900">
                  {usersStats?.inactiveUsers || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الأطباء</p>
                <p className="text-2xl font-bold text-gray-900">
                  {usersStats?.usersByRole?.find(r => r.role === 'DOCTOR')?.count || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* جدول المستخدمين */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">قائمة المستخدمين</CardTitle>
              <Button onClick={() => console.log('إضافة مستخدم جديد')}>
                <Plus className="w-4 h-4 mr-2" />
                إضافة مستخدم جديد
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <UsersTable
              users={usersData?.users || []}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onToggleStatus={handleToggleUserStatus}
              loading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Pagination */}
        {usersData && usersData.totalPages > 1 && (
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                السابق
              </Button>
              <span className="px-4 py-2 text-sm text-gray-600">
                صفحة {page} من {usersData.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === usersData.totalPages}
              >
                التالي
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
