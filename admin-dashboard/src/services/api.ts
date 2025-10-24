import { API_URL, API_BASE_URL } from '@/utils/constants';

export interface RequestOptions extends RequestInit {
  auth?: boolean;
}

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
};

export async function apiFetch<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  const { headers, auth = false, ...rest } = options;

  const finalHeaders: HeadersInit = {
    ...defaultHeaders,
    ...(headers || {}),
  };

  // إضافة JWT token إذا كان موجوداً
  if (auth) {
    const token = localStorage.getItem('admin_token');
    console.log('API Request - Token found:', !!token, 'Token value:', token ? token.substring(0, 20) + '...' : 'null');
    if (token) {
      (finalHeaders as any)['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('API Request - No token found in localStorage for authenticated request');
    }
  }

  const response = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    credentials: 'include', // إرسال الـ cookies مع جميع الطلبات
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : (await response.text());

  if (!response.ok) {
    const message = isJson && (data as any)?.message ? (data as any).message : response.statusText;
    throw new Error(message || 'Request failed');
  }

  return data as T;
}

function buildUrl(path: string, params?: Record<string, any>): string {
  const isAbsolute = /^https?:\/\//i.test(path);
  const useBase = path.startsWith('/api/') ? API_URL : API_BASE_URL;
  const base = isAbsolute ? '' : useBase;
  const sep = path.startsWith('/') ? '' : '/';
  const url = new URL(`${base}${sep}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

export const apiService = {
  async get<T = any>(path: string, options?: { params?: Record<string, any> }) {
    const data = await apiFetch<T>(buildUrl(path, options?.params), {
      method: 'GET',
      auth: true,
    });
    return { data } as { data: T };
  },
  async post<T = any>(path: string, body?: any, options?: { params?: Record<string, any> }) {
    const data = await apiFetch<T>(buildUrl(path, options?.params), {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      auth: true,
    });
    return { data } as { data: T };
  },
  async put<T = any>(path: string, body?: any, options?: { params?: Record<string, any> }) {
    const data = await apiFetch<T>(buildUrl(path, options?.params), {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      auth: true,
    });
    return { data } as { data: T };
  },
  async delete<T = any>(path: string, options?: { params?: Record<string, any> }) {
    const data = await apiFetch<T>(buildUrl(path, options?.params), {
      method: 'DELETE',
      auth: true,
    });
    return { data } as { data: T };
  },
};

// Export as 'api' for compatibility with other services
export const api = apiService;

