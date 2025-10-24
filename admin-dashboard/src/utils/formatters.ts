import { format, parseISO, isValid } from 'date-fns';
import { DATE_FORMATS } from './constants';

export const formatDate = (date: string | Date, formatStr: string = DATE_FORMATS.DISPLAY_DATE): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'تاريخ غير صحيح';
    return format(dateObj, formatStr);
  } catch {
    return 'تاريخ غير صحيح';
  }
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, DATE_FORMATS.DISPLAY_DATETIME);
};

export const formatTime = (date: string | Date): string => {
  return formatDate(date, DATE_FORMATS.TIME);
};

export const formatCurrency = (amount: number, currency: string = 'SAR'): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('ar-SA').format(number);
};

export const formatPhone = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Saudi phone numbers
  if (cleaned.startsWith('966')) {
    return `+966 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  } else if (cleaned.startsWith('0')) {
    return `+966 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 بايت';
  
  const k = 1024;
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} دقيقة`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ساعة`;
  }
  
  return `${hours} ساعة و ${remainingMinutes} دقيقة`;
};

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(targetDate)) return 'تاريخ غير صحيح';
  
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'الآن';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} دقيقة`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `منذ ${diffInHours} ساعة`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `منذ ${diffInDays} يوم`;
  }
  
  return formatDate(targetDate);
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

