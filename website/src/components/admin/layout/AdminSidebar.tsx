'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  Calendar,
  MessageSquare,
  Clock,
  BarChart3,
  Settings,
  Bell,
  Activity,
  FileText,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navigation = [
  {
    name: 'لوحة التحكم',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'المستخدمين',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'الأطباء',
    href: '/admin/doctors',
    icon: Stethoscope,
  },
  {
    name: 'العيادات',
    href: '/admin/clinics',
    icon: Building2,
  },
  {
    name: 'المواعيد',
    href: '/admin/appointments',
    icon: Calendar,
  },
  {
    name: 'الاستشارات',
    href: '/admin/consultations',
    icon: MessageSquare,
  },
  {
    name: 'قوائم الانتظار',
    href: '/admin/waiting-list',
    icon: Clock,
  },
  {
    name: 'التقارير',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    name: 'الأنشطة',
    href: '/admin/activity',
    icon: Activity,
  },
  {
    name: 'التنبيهات',
    href: '/admin/notifications',
    icon: Bell,
  },
  {
    name: 'الإعدادات',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 right-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="mr-2 text-xl font-bold text-gray-900">الإدارة</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "ml-3 h-5 w-5 flex-shrink-0",
                      isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">أ</span>
                </div>
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-700">المدير</p>
                <p className="text-xs text-gray-500">admin@clinic.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
