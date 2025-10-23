'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { doctorsService, Doctor } from '@/lib/api/doctors';
import { adminService } from '@/lib/api/admin';
import { 
  Stethoscope, 
  Plus, 
  Edit, 
  Trash2, 
  User,
  Building2,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Mail
} from 'lucide-react';

export default function DoctorsManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clinicFilter, setClinicFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // جلب الأطباء
  const { data: doctors, isLoading: doctorsLoading } = useQuery({
    queryKey: ['doctors', searchTerm, clinicFilter, specialtyFilter, availabilityFilter],
    queryFn: () => doctorsService.getDoctors({
      search: searchTerm || undefined,
      clinicId: clinicFilter !== 'all' ? parseInt(clinicFilter) : undefined,
      specialization: specialtyFilter !== 'all' ? specialtyFilter : undefined,
      isAvailable: availabilityFilter !== 'all' ? availabilityFilter === 'available' : undefined,
    }),
  });

  // إحصائيات الأطباء
  const { data: doctorsStats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-doctors-stats'],
    queryFn: () => adminService.getDoctorsStats(),
  });

  // إحصائيات عامة
  const { data: overviewStats } = useQuery({
    queryKey: ['admin-overview-stats'],
    queryFn: () => adminService.getOverviewStats(),
  });

  // حذف طبيب
  const deleteDoctorMutation = useMutation({
    mutationFn: (id: number) => doctorsService.deleteDoctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });

  // تغيير حالة التوفر
  const setAvailabilityMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: number; isAvailable: boolean }) =>
      doctorsService.setAvailability(id, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });

  const handleEditDoctor = (doctor: Doctor) => {
    // TODO: فتح نموذج تعديل الطبيب
    console.log('تعديل الطبيب:', doctor);
  };

  const handleDeleteDoctor = (doctor: Doctor) => {
    if (confirm(`هل أنت متأكد من حذف الطبيب ${doctor.user?.profile?.firstName} ${doctor.user?.profile?.lastName}؟`)) {
      deleteDoctorMutation.mutate(doctor.id);
    }
  };

  const handleToggleAvailability = (doctor: Doctor) => {
    setAvailabilityMutation.mutate({
      id: doctor.id,
      isAvailable: !doctor.isAvailable,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">إدارة الأطباء</h1>
          <p className="text-gray-600">إدارة جميع الأطباء في النظام</p>
        </div>
      </div>

      <div className="p-6">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الأطباء</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctorsStats?.totalDoctors || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الأطباء المتاحين</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctorsStats?.availableDoctors || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الأطباء غير المتاحين</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(doctorsStats?.totalDoctors || 0) - (doctorsStats?.availableDoctors || 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">متوسط التقييم</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
            </div>
          </Card>
        </div>

        {/* فلترة الأطباء */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البحث
                </label>
                <input
                  type="text"
                  placeholder="البحث عن طبيب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العيادة
                </label>
                <select
                  value={clinicFilter}
                  onChange={(e) => setClinicFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">جميع العيادات</option>
                  <option value="1">عيادة النور</option>
                  <option value="2">عيادة الأمل</option>
                  <option value="3">عيادة المستقبل</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التخصص
                </label>
                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">جميع التخصصات</option>
                  <option value="طب عام">طب عام</option>
                  <option value="أطفال">أطفال</option>
                  <option value="نساء">نساء</option>
                  <option value="عظام">عظام</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="available">متاح</option>
                  <option value="unavailable">غير متاح</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setClinicFilter('all');
                    setSpecialtyFilter('all');
                    setAvailabilityFilter('all');
                  }}
                >
                  مسح الفلاتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* قائمة الأطباء */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">قائمة الأطباء</h2>
          <Button onClick={() => console.log('إضافة طبيب جديد')}>
            <Plus className="w-4 h-4 mr-2" />
            إضافة طبيب جديد
          </Button>
        </div>

        {doctorsLoading ? (
          <Card className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors?.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="mr-4">
                        <h3 className="font-semibold text-gray-900">
                          د. {doctor.user?.profile?.firstName} {doctor.user?.profile?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      </div>
                    </div>
                    <Badge variant={doctor.isAvailable ? 'default' : 'secondary'}>
                      {doctor.isAvailable ? 'متاح' : 'غير متاح'}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      <span>{doctor.clinic?.name || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Stethoscope className="w-4 h-4 mr-2" />
                      <span>{doctor.specialty?.name || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{doctor.experience} سنوات خبرة</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">الترخيص:</span>
                      <span>{doctor.licenseNumber}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">رسوم الاستشارة:</span>
                      <span>{doctor.consultationFee} جنيه</span>
                    </div>
                  </div>

                  {/* تقييمات الطبيب */}
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 mr-2">(4.2)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditDoctor(doctor)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleAvailability(doctor)}
                    >
                      {doctor.isAvailable ? 'إلغاء التوفر' : 'تفعيل التوفر'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteDoctor(doctor)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {doctors?.length === 0 && (
          <Card className="p-8">
            <CardContent className="text-center">
              <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أطباء</h3>
              <p className="text-gray-600">لا توجد أطباء تطابق الفلاتر المحددة</p>
            </CardContent>
          </Card>
        )}

        {/* أفضل الأطباء */}
        {doctorsStats?.topDoctors && doctorsStats.topDoctors.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">أفضل الأطباء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctorsStats.topDoctors.slice(0, 6).map((doctor: any) => (
                  <div key={doctor.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                      <Badge variant="secondary">{doctor.specialization}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{doctor.clinic}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {doctor.appointmentCount} موعد
                      </span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 mr-1">
                          {doctor.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
