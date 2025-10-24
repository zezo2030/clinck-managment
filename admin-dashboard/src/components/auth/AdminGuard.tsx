import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context';
import { LoadingSpinner } from '@/components/ui';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  console.log('AdminGuard: isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'user:', user, 'hasCheckedStorage:', hasCheckedStorage);

  // التحقق من localStorage عند التحميل
  useEffect(() => {
    console.log('AdminGuard: useEffect triggered, isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
    
    if (!isAuthenticated && !isLoading) {
      const storedUser = localStorage.getItem('admin_user');
      const storedToken = localStorage.getItem('admin_token');
      
      console.log('AdminGuard: Checking localStorage - storedUser:', storedUser, 'storedToken:', storedToken);
      
      if (storedUser && storedToken) {
        console.log('AdminGuard: Found stored credentials, waiting for AuthContext to update');
        // انتظر قليلاً للتأكد من تحديث AuthContext
        const timer = setTimeout(() => {
          console.log('AdminGuard: Timer completed, setting hasCheckedStorage to true');
          setHasCheckedStorage(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      } else {
        console.log('AdminGuard: No stored credentials found, setting hasCheckedStorage to true');
        setHasCheckedStorage(true);
      }
    } else {
      console.log('AdminGuard: Already authenticated or still loading, setting hasCheckedStorage to true');
      setHasCheckedStorage(true);
    }
  }, [isAuthenticated, isLoading]);

  // إذا كان في حالة تحميل، انتظر
  if (isLoading) {
    console.log('AdminGuard: Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // إذا لم يكن مصادق عليه، تحقق من localStorage مباشرة
  if (!isAuthenticated && hasCheckedStorage) {
    console.log('AdminGuard: Not authenticated and checked storage, redirecting to login');
    console.log('AdminGuard: Final check - storedUser:', localStorage.getItem('admin_user'), 'storedToken:', localStorage.getItem('admin_token'));
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // إذا لم يكن مصادق عليه ولكن لم يتم التحقق من localStorage بعد
  if (!isAuthenticated && !hasCheckedStorage) {
    console.log('AdminGuard: Not authenticated, checking localStorage...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">جاري التحقق من المصادقة...</p>
        </div>
      </div>
    );
  }

  // تحقق من دور المستخدم
  if (user?.role !== 'ADMIN') {
    console.log('AdminGuard: User role is not ADMIN:', user?.role);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">غير مصرح</h1>
          <p className="text-muted-foreground">
            هذه الصفحة مخصصة للأدمن فقط
          </p>
        </div>
      </div>
    );
  }

  console.log('AdminGuard: Access granted');
  return <>{children}</>;
};

