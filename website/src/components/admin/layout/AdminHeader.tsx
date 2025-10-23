'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { NotificationBell } from '@/components/admin/NotificationBell';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import {
  Search,
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface AdminHeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export function AdminHeader({ setSidebarOpen }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    // Implement logout functionality
    console.log('Logging out...');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumb */}
          <AdminBreadcrumb pathname={pathname} />
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-lg mx-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="البحث في النظام..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 pl-4 w-full"
              />
            </div>
          </form>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4 space-x-reverse">
          {/* Notifications */}
          <NotificationBell />

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 space-x-reverse"
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">أ</span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">المدير</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>

            {/* User dropdown menu */}
            {userMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">المدير</p>
                  <p className="text-xs text-gray-500">admin@clinic.com</p>
                </div>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User className="h-4 w-4 ml-3" />
                  الملف الشخصي
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="h-4 w-4 ml-3" />
                  الإعدادات
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 ml-3" />
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
