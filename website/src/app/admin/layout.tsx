'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminMobileNav } from '@/components/admin/layout/AdminMobileNav';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminAuthProvider } from '@/lib/contexts/AdminAuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // إذا كانت الصفحة صفحة تسجيل الدخول، لا نطبق AdminGuard
  const isLoginPage = pathname === '/admin/login';

  return (
    <AdminAuthProvider>
      {isLoginPage ? (
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      ) : (
        <AdminGuard>
          <div className="min-h-screen bg-gray-50">
            {/* Mobile Navigation */}
            <AdminMobileNav 
              sidebarOpen={sidebarOpen} 
              setSidebarOpen={setSidebarOpen} 
            />
            
            {/* Sidebar */}
            <AdminSidebar 
              sidebarOpen={sidebarOpen} 
              setSidebarOpen={setSidebarOpen} 
            />
            
            {/* Main Content */}
            <div className="lg:pl-64">
              {/* Header */}
              <AdminHeader setSidebarOpen={setSidebarOpen} />
              
              {/* Page Content */}
              <main className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </AdminGuard>
      )}
    </AdminAuthProvider>
  );
}
