export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const API_BASE_URL = `${API_URL}/api/v1`;
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Admin Dashboard';

export const ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
} as const;

export const USER_ROLES = [
  { value: 'ADMIN', label: 'أدمن' },
  { value: 'DOCTOR', label: 'طبيب' },
  { value: 'PATIENT', label: 'مريض' },
];

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
} as const;

export const APPOINTMENT_STATUS_LABELS = {
  SCHEDULED: 'مجدول',
  CONFIRMED: 'مؤكد',
  IN_PROGRESS: 'قيد التنفيذ',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغي',
  NO_SHOW: 'لم يحضر',
};

export const CONSULTATION_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const CONSULTATION_STATUS_LABELS = {
  PENDING: 'في الانتظار',
  ACTIVE: 'نشط',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغي',
};

export const CONSULTATION_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export const CONSULTATION_PRIORITY_LABELS = {
  LOW: 'منخفض',
  MEDIUM: 'متوسط',
  HIGH: 'عالي',
  URGENT: 'عاجل',
};

export const STATUS_COLORS = {
  SCHEDULED: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
  NO_SHOW: 'bg-orange-100 text-orange-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACTIVE: 'bg-green-100 text-green-800',
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100],
};

export const DATE_FORMATS = {
  DATE: 'yyyy-MM-dd',
  DATETIME: 'yyyy-MM-dd HH:mm',
  TIME: 'HH:mm',
  DISPLAY_DATE: 'dd/MM/yyyy',
  DISPLAY_DATETIME: 'dd/MM/yyyy HH:mm',
};

export const CHART_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
];

