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

  // محاولة استعادة الجلسة من الكوكي عبر verify
  useEffect(() => {
    const bootstrap = async () => {
      try {
        // جرّب التحقق من الجلسة عبر الكوكي
        const res = await authService.verifyAdmin();
        if (res?.user) {
          setUser({
            id: res.user.id as number,
            email: res.user.email,
            role: res.user.role as any,
            isActive: true,
            createdAt: '',
            updatedAt: '',
          });
          // حافظ نسخة خفيفة محلياً للاستفادة السريعة
          localStorage.setItem('admin_user', JSON.stringify(res.user));
        }
      } catch {
        // fallback: حاول قراءة المستخدم من التخزين المحلي
        const stored = localStorage.getItem('admin_user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as Partial<User>;
            if (parsed && parsed.email) {
              setUser({
                id: parsed.id || 0,
                email: parsed.email,
                role: (parsed.role as any) || 'ADMIN',
                isActive: true,
                createdAt: '',
                updatedAt: '',
                name: parsed.name,
              });
            }
          } catch {}
        }
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

