'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface AdminMobileNavProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function AdminMobileNav({ sidebarOpen, setSidebarOpen }: AdminMobileNavProps) {
  if (!sidebarOpen) return null;

  return (
    <div className="lg:hidden">
      {/* Mobile backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Mobile sidebar */}
      <div className="fixed inset-y-0 right-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">أ</span>
              </div>
              <span className="mr-2 text-xl font-bold text-gray-900">الإدارة</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {/* Navigation items will be rendered by AdminSidebar */}
          </nav>
        </div>
      </div>
    </div>
  );
}
