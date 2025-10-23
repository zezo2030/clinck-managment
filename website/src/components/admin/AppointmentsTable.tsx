'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Calendar,
  User
} from 'lucide-react';

interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  clinicId: number;
  appointmentDate: string;
  appointmentTime: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  reason?: string;
  notes?: string;
  isEmergency: boolean;
  patient?: {
    profile: {
      firstName: string;
      lastName: string;
      phone: string;
    };
  };
  doctor?: {
    user: {
      profile: {
        firstName: string;
        lastName: string;
      };
    };
    specialization: string;
  };
  clinic?: {
    name: string;
  };
  specialty?: {
    name: string;
  };
}

interface AppointmentsTableProps {
  appointments: Appointment[];
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
  onConfirm?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  loading?: boolean;
  className?: string;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  onEdit,
  onDelete,
  onConfirm,
  onCancel,
  loading = false,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  const filteredAppointments = appointments.filter(appointment => {
    const patientName = `${appointment.patient?.profile?.firstName || ''} ${appointment.patient?.profile?.lastName || ''}`.trim();
    const doctorName = `${appointment.doctor?.user?.profile?.firstName || ''} ${appointment.doctor?.user?.profile?.lastName || ''}`.trim();
    
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.clinic?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    const matchesDate = !dateFilter || appointment.appointmentDate.startsWith(dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'secondary';
      case 'CONFIRMED': return 'default';
      case 'IN_PROGRESS': return 'default';
      case 'COMPLETED': return 'default';
      case 'CANCELLED': return 'destructive';
      case 'NO_SHOW': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'مجدول';
      case 'CONFIRMED': return 'مؤكد';
      case 'IN_PROGRESS': return 'جاري';
      case 'COMPLETED': return 'مكتمل';
      case 'CANCELLED': return 'ملغي';
      case 'NO_SHOW': return 'لم يحضر';
      default: return status;
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    return {
      date: appointmentDateTime.toLocaleDateString('ar-SA'),
      time: appointmentDateTime.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">المواعيد</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="البحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">جميع الحالات</option>
              <option value="SCHEDULED">مجدول</option>
              <option value="CONFIRMED">مؤكد</option>
              <option value="IN_PROGRESS">جاري</option>
              <option value="COMPLETED">مكتمل</option>
              <option value="CANCELLED">ملغي</option>
              <option value="NO_SHOW">لم يحضر</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المريض
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الطبيب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العيادة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ والوقت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => {
                const { date, time } = formatDateTime(appointment.appointmentDate, appointment.appointmentTime);
                return (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {`${appointment.patient?.profile?.firstName || ''} ${appointment.patient?.profile?.lastName || ''}`.trim() || 'غير محدد'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.patient?.profile?.phone || 'لا يوجد رقم هاتف'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {`د. ${appointment.doctor?.user?.profile?.firstName || ''} ${appointment.doctor?.user?.profile?.lastName || ''}`.trim() || 'غير محدد'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.doctor?.specialization || 'غير محدد'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.clinic?.name || 'غير محدد'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{date}</div>
                      <div className="text-sm text-gray-500">{time}</div>
                      {appointment.isEmergency && (
                        <Badge variant="destructive" className="text-xs mt-1">
                          طوارئ
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(appointment.status)}>
                        {getStatusLabel(appointment.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {appointment.status === 'SCHEDULED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onConfirm?.(appointment)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onCancel?.(appointment)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit?.(appointment)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDelete?.(appointment)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredAppointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد نتائج
          </div>
        )}
      </CardContent>
    </Card>
  );
};
