import { API_BASE_URL } from '@/utils/constants';
import { apiFetch } from './api';
import { LoginCredentials, AuthResponse, User } from '@/types';

const BASE = `${API_BASE_URL}/auth`;

export const authService = {
  async adminLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await apiFetch<AuthResponse>(`${BASE}/admin/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
      auth: false, // لا نحتاج auth للـ login
    });

    // حفظ في localStorage للمزامنة مع الحارس والواجهة
    if (res?.user) {
      localStorage.setItem('admin_user', JSON.stringify(res.user));
    }
    // حفظ الـ token
    if ((res as any)?.token) {
      localStorage.setItem('admin_token', (res as any).token);
    }
    return res;
  },

  async verifyAdmin(): Promise<{ user: Pick<User, 'id' | 'email' | 'role'> }> {
    return apiFetch(`${BASE}/admin/verify`, {
      method: 'GET',
      auth: true,
    });
  },

  async adminLogout(): Promise<{ message: string }> {
    const res = await apiFetch<{ message: string }>(`${BASE}/admin/logout`, {
      method: 'POST',
      auth: true,
    });
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
    return res;
  },
};

