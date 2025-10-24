export interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

