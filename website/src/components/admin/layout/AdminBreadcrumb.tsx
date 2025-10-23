'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Home } from 'lucide-react';

interface AdminBreadcrumbProps {
  pathname: string;
}

const breadcrumbMap: Record<string, { label: string; href?: string }[]> = {
  '/admin': [{ label: 'لوحة التحكم' }],
  '/admin/users': [
    { label: 'لوحة التحكم', href: '/admin' },
    { label: 'المستخدمين' }
  ],
  '/admin/doctors': [
    { label: 'لوحة التحكم', href: '/admin' },
    { label: 'الأطباء' }
  ],
  '/admin/clinics': [
    { label: 'لوحة التحكم', href: '/admin' },
    { label: 'العيادات' }
  ],
  '/admin/appointments': [
    { label: 'لوحة التحكم', href: '/admin' },
    { label: 'المواعيد' }
  ],
  '/admin/consultations': [
    { label: 'لوحة التحكم', href: '/admin' },
    { label: 'الاستشارات' }
  ],
  '/admin/waiting-list': [
    { label: 'لوحة التحكم', href: '/admin' },
    { label: 'قوائم الانتظار' }
  ],
  '/admin/reports': [
    { label: 'لوحة التحكم', href: '/admin' },
    { label: 'التقارير' }
  ],
  '/admin/activity': [
    { label: 'لوحة التحكم', href: '/admin' },
    { label: 'الأنشطة' }
  ],
  '/admin/notifications': [
    { label: 'لوحة التحكم', href: '/admin' },
    { label: 'التنبيهات' }
  ],
  '/admin/settings': [
    { label: 'لوحة التحكم', href: '/admin' },
    { label: 'الإعدادات' }
  ],
};

export function AdminBreadcrumb({ pathname }: AdminBreadcrumbProps) {
  const breadcrumbs = breadcrumbMap[pathname] || [{ label: 'لوحة التحكم', href: '/admin' }];

  return (
    <nav className="flex items-center space-x-1 space-x-reverse" aria-label="Breadcrumb">
      <Link
        href="/admin"
        className="text-gray-400 hover:text-gray-500"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">الرئيسية</span>
      </Link>
      
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={index}>
          <ChevronLeft className="h-4 w-4 text-gray-400" />
          {breadcrumb.href ? (
            <Link
              href={breadcrumb.href}
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              {breadcrumb.label}
            </Link>
          ) : (
            <span className="text-sm font-medium text-gray-900">
              {breadcrumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
