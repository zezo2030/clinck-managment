export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export const AppointmentStatusLabels = {
  [AppointmentStatus.SCHEDULED]: 'مجدول',
  [AppointmentStatus.CONFIRMED]: 'مؤكد',
  [AppointmentStatus.CANCELLED]: 'ملغي',
  [AppointmentStatus.COMPLETED]: 'مكتمل',
  [AppointmentStatus.NO_SHOW]: 'لم يحضر',
};

export const AppointmentStatusColors = {
  [AppointmentStatus.SCHEDULED]: '#3B82F6', // أزرق
  [AppointmentStatus.CONFIRMED]: '#10B981', // أخضر
  [AppointmentStatus.CANCELLED]: '#EF4444', // أحمر
  [AppointmentStatus.COMPLETED]: '#6B7280', // رمادي
  [AppointmentStatus.NO_SHOW]: '#F59E0B', // برتقالي
};
