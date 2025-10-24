import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { MobileNav } from './MobileNav';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <MobileNav open={sidebarOpen} onOpenChange={setSidebarOpen} />
      
      {/* Desktop sidebar */}
      <AdminSidebar />
      
      {/* Main content */}
      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

