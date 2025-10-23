'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { clinicsService, Clinic } from '@/lib/api/clinics';
import { departmentsService, Department } from '@/lib/api/departments';
import { adminService } from '@/lib/api/admin';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Phone, 
  Mail,
  Clock,
  Users,
  Stethoscope,
  Settings
} from 'lucide-react';

export default function ClinicsManagementPage() {
  const [activeTab, setActiveTab] = useState<'clinics' | 'departments'>('clinics');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // جلب العيادات
  const { data: clinics, isLoading: clinicsLoading } = useQuery({
    queryKey: ['clinics', searchTerm, statusFilter],
    queryFn: () => clinicsService.getClinics({
      search: searchTerm || undefined,
      isActive: statusFilter !== 'all' ? statusFilter === 'active' : undefined,
    }),
  });

  // جلب الأقسام
  const { data: departments, isLoading: departmentsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsService.getDepartments(),
  });

  // إحصائيات العيادات
  const { data: overviewStats } = useQuery({
    queryKey: ['admin-overview-stats'],
    queryFn: () => adminService.getOverviewStats(),
  });

  // حذف عيادة
  const deleteClinicMutation = useMutation({
    mutationFn: (id: number) => clinicsService.deleteClinic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
    },
  });

  // تغيير حالة العيادة
  const toggleClinicStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      clinicsService.toggleClinicStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
    },
  });

  // حذف قسم
  const deleteDepartmentMutation = useMutation({
    mutationFn: (id: number) => departmentsService.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });

  // تغيير حالة القسم
  const toggleDepartmentStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      departmentsService.toggleDepartmentStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });

  const handleEditClinic = (clinic: Clinic) => {
    // TODO: فتح نموذج تعديل العيادة
    console.log('تعديل العيادة:', clinic);
  };

  const handleDeleteClinic = (clinic: Clinic) => {
    if (confirm(`هل أنت متأكد من حذف العيادة ${clinic.name}؟`)) {
      deleteClinicMutation.mutate(clinic.id);
    }
  };

  const handleToggleClinicStatus = (clinic: Clinic) => {
    toggleClinicStatusMutation.mutate({
      id: clinic.id,
      isActive: !clinic.isActive,
    });
  };

  const handleEditDepartment = (department: Department) => {
    // TODO: فتح نموذج تعديل القسم
    console.log('تعديل القسم:', department);
  };

  const handleDeleteDepartment = (department: Department) => {
    if (confirm(`هل أنت متأكد من حذف القسم ${department.name}؟`)) {
      deleteDepartmentMutation.mutate(department.id);
    }
  };

  const handleToggleDepartmentStatus = (department: Department) => {
    toggleDepartmentStatusMutation.mutate({
      id: department.id,
      isActive: !department.isActive,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">إدارة العيادات والأقسام</h1>
          <p className="text-gray-600">إدارة جميع العيادات والأقسام في النظام</p>
        </div>
      </div>

      <div className="p-6">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي العيادات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overviewStats?.overview?.totalClinics || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الأقسام</p>
                <p className="text-2xl font-bold text-gray-900">
                  {departments?.length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Stethoscope className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">التخصصات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overviewStats?.overview?.totalSpecialties || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الأطباء</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overviewStats?.overview?.activeDoctors || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('clinics')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'clinics'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building2 className="w-4 h-4 mr-2" />
            العيادات
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'departments'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4 mr-2" />
            الأقسام
          </button>
        </div>

        {/* فلترة */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البحث
                </label>
                <input
                  type="text"
                  placeholder="البحث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              {activeTab === 'clinics' && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    فلترة حسب الحالة
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                  </select>
                </div>
              )}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  مسح الفلاتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* تبويب العيادات */}
        {activeTab === 'clinics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">قائمة العيادات</h2>
              <Button onClick={() => console.log('إضافة عيادة جديدة')}>
                <Plus className="w-4 h-4 mr-2" />
                إضافة عيادة جديدة
              </Button>
            </div>

            {clinicsLoading ? (
              <Card className="p-6">
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clinics?.map((clinic) => (
                  <Card key={clinic.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="mr-4">
                            <h3 className="font-semibold text-gray-900">{clinic.name}</h3>
                            <p className="text-sm text-gray-600">{clinic.email}</p>
                          </div>
                        </div>
                        <Badge variant={clinic.isActive ? 'default' : 'secondary'}>
                          {clinic.isActive ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{clinic.address}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{clinic.phone}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          <span>{clinic.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>ساعات العمل: 8:00 - 16:00</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClinic(clinic)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleClinicStatus(clinic)}
                        >
                          {clinic.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClinic(clinic)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {clinics?.length === 0 && (
              <Card className="p-8">
                <CardContent className="text-center">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد عيادات</h3>
                  <p className="text-gray-600">لا توجد عيادات تطابق الفلاتر المحددة</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* تبويب الأقسام */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">قائمة الأقسام</h2>
              <Button onClick={() => console.log('إضافة قسم جديد')}>
                <Plus className="w-4 h-4 mr-2" />
                إضافة قسم جديد
              </Button>
            </div>

            {departmentsLoading ? (
              <Card className="p-6">
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments?.map((department) => (
                  <Card key={department.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Settings className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="mr-4">
                            <h3 className="font-semibold text-gray-900">{department.name}</h3>
                            <p className="text-sm text-gray-600">{department.clinic?.name}</p>
                          </div>
                        </div>
                        <Badge variant={department.isActive ? 'default' : 'secondary'}>
                          {department.isActive ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </div>

                      {department.description && (
                        <p className="text-sm text-gray-600 mb-4">{department.description}</p>
                      )}

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditDepartment(department)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleDepartmentStatus(department)}
                        >
                          {department.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteDepartment(department)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {departments?.length === 0 && (
              <Card className="p-8">
                <CardContent className="text-center">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أقسام</h3>
                  <p className="text-gray-600">لا توجد أقسام في النظام</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
