const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
    name?: string;
  };
}

export interface AdminVerifyResponse {
  user: {
    id: string;
    email: string;
    role: string;
    name?: string;
  };
}

class AdminApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // إعداد headers مع credentials
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const config: RequestInit = {
      headers,
      credentials: 'include', // مهم جداً لإرسال cookies
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // التعامل مع حالة 401 (غير مصرح)
      if (response.status === 401) {
        throw new Error('جلسة الأدمن منتهية الصلاحية - يرجى تسجيل الدخول مرة أخرى');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Admin API Error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Admin API request failed:', error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }
}

const adminApiClient = new AdminApiClient(API_BASE_URL);

export const adminAuthApi = {
  // تسجيل دخول الأدمن
  login: async (credentials: AdminLoginRequest): Promise<AdminLoginResponse> => {
    return adminApiClient.post<AdminLoginResponse>('/auth/admin/login', credentials);
  },

  // التحقق من صحة جلسة الأدمن
  verifySession: async (): Promise<AdminVerifyResponse> => {
    return adminApiClient.get<AdminVerifyResponse>('/auth/admin/verify');
  },

  // تسجيل خروج الأدمن
  logout: async (): Promise<{ message: string }> => {
    return adminApiClient.post<{ message: string }>('/auth/admin/logout', {});
  },
};
