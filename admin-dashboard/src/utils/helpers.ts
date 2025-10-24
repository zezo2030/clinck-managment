import { format, parseISO, isValid, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

// Array helpers
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

// String helpers
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const generateCode = (length: number = 6): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Date helpers
export const isToday = (date: string | Date): boolean => {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(targetDate)) return false;
  
  const today = new Date();
  return format(targetDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
};

export const isTomorrow = (date: string | Date): boolean => {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(targetDate)) return false;
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return format(targetDate, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd');
};

export const isPast = (date: string | Date): boolean => {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(targetDate)) return false;
  
  return targetDate < new Date();
};

export const isFuture = (date: string | Date): boolean => {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(targetDate)) return false;
  
  return targetDate > new Date();
};

export const getDaysUntil = (date: string | Date): number => {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(targetDate)) return 0;
  
  return differenceInDays(targetDate, new Date());
};

export const getHoursUntil = (date: string | Date): number => {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(targetDate)) return 0;
  
  return differenceInHours(targetDate, new Date());
};

export const getMinutesUntil = (date: string | Date): number => {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(targetDate)) return 0;
  
  return differenceInMinutes(targetDate, new Date());
};

// Validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+966|966|0)?[5-9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidSaudiId = (id: string): boolean => {
  const idRegex = /^[1-2][0-9]{9}$/;
  return idRegex.test(id);
};

// Object helpers
export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const isEmpty = (value: any): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// URL helpers
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
};

export const parseQueryString = (queryString: string): Record<string, string | string[]> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string | string[]> = {};
  
  for (const [key, value] of params.entries()) {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        (result[key] as string[]).push(value);
      } else {
        result[key] = [result[key] as string, value];
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
};

// Local storage helpers
export const setStorageItem = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Debounce helper
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle helper
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

