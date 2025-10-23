'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminAuthApi } from '../api/admin-auth';
import { useIsClient } from '../utils/client-only';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export interface AdminAuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  verifySession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isClient = useIsClient();

  // التحقق من جلسة الأدمن عند تحميل التطبيق
  useEffect(() => {
    if (!isClient) return;

    const initAdminAuth = async () => {
      try {
        await verifySession();
      } catch (error) {
        console.log('Admin session verification failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAdminAuth();
  }, [isClient]);

  // التحقق من صحة الجلسة
  const verifySession = async (): Promise<void> => {
    try {
      const userData = await adminAuthApi.verifySession();
      setUser(userData.user);
    } catch (error) {
      console.log('Admin session verification failed:', error);
      setUser(null);
      throw error;
    }
  };

  // تسجيل دخول الأدمن
  const login = async (credentials: { email: string; password: string }): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await adminAuthApi.login(credentials);
      setUser(response.user);
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل خروج الأدمن
  const logout = async (): Promise<void> => {
    try {
      await adminAuthApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value: AdminAuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    verifySession,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

// Hook لاستخدام Admin Auth Context
export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
