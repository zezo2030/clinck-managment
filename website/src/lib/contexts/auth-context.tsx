'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api/auth';
import type { AuthContextType, User, LoginRequest, RegisterRequest } from '../../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // التحقق من وجود token عند تحميل التطبيق
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          // التحقق من صحة التوكن
          await authApi.verifyToken();
        } catch (error) {
          // إذا كان التوكن غير صالح، قم بمسح البيانات
          clearAuthData();
        }
      }
      setIsLoading(false);
    };

    // الاستماع إلى logout events من API client
    const handleLogout = () => {
      clearAuthData();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:logout', handleLogout);
    }

    initAuth();

    // تنظيف event listener
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth:logout', handleLogout);
      }
    };
  }, []);

  // حفظ البيانات في localStorage
  const saveAuthData = (token: string, user: User) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  // مسح البيانات من localStorage
  const clearAuthData = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
  };

  // تسجيل الدخول
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      saveAuthData(response.access_token, response.user);
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // التسجيل
  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authApi.register(userData);
      // بعد التسجيل الناجح، قم بتسجيل الدخول التلقائي
      await login({ email: userData.email, password: userData.password });
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل الخروج
  const logout = (): void => {
    clearAuthData();
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook لاستخدام Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
