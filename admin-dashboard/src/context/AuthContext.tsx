import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '@/services/auth.service';
import { LoginCredentials, User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // محاولة استعادة الجلسة من localStorage
  useEffect(() => {
    const bootstrap = async () => {
      try {
        // تحقق من وجود token
        const token = localStorage.getItem('admin_token');
        const storedUser = localStorage.getItem('admin_user');
        
        if (token && storedUser) {
          try {
            const parsed = JSON.parse(storedUser) as Partial<User>;
            if (parsed && parsed.email) {
              setUser({
                id: parsed.id || 0,
                email: parsed.email,
                role: (parsed.role as any) || 'ADMIN',
                isActive: true,
                createdAt: '',
                updatedAt: '',
                name: parsed.name,
                firstName: parsed.firstName,
                lastName: parsed.lastName,
                phone: parsed.phone,
                avatar: parsed.avatar,
              });
            }
          } catch (error) {
            console.error('Error parsing stored user:', error);
            // مسح البيانات التالفة
            localStorage.removeItem('admin_user');
            localStorage.removeItem('admin_token');
          }
        }
      } catch (error) {
        console.error('Error during auth bootstrap:', error);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const res = await authService.adminLogin(credentials);
      if (res?.user) {
        setUser({
          ...res.user,
          isActive: true,
          createdAt: '',
          updatedAt: '',
        } as User);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.adminLogout();
      setUser(null);
      // مسح البيانات المحلية
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

