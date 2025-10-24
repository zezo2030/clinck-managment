import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AdminGuard } from '@/components/auth';
import { LoadingSpinner } from '@/components/ui';

// Lazy load pages
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Login = React.lazy(() => import('@/pages/Login'));

// Placeholder components for other pages
const Users = React.lazy(() => import('@/pages/Users'));
const Doctors = React.lazy(() => import('@/pages/Doctors'));
const Clinics = React.lazy(() => import('@/pages/Clinics'));
const Appointments = React.lazy(() => import('@/pages/Appointments'));
const Consultations = React.lazy(() => import('@/pages/Consultations'));
const Specialties = React.lazy(() => import('@/pages/Specialties'));
const WaitingList = React.lazy(() => import('@/pages/WaitingList'));
const Reports = React.lazy(() => import('@/pages/Reports'));
const Settings = React.lazy(() => import('@/pages/Settings'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground">جاري التحميل...</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AdminGuard>
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  </AdminGuard>
);

// Public route wrapper
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingFallback />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: '/doctors',
    element: (
      <ProtectedRoute>
        <Doctors />
      </ProtectedRoute>
    ),
  },
  {
    path: '/clinics',
    element: (
      <ProtectedRoute>
        <Clinics />
      </ProtectedRoute>
    ),
  },
  {
    path: '/appointments',
    element: (
      <ProtectedRoute>
        <Appointments />
      </ProtectedRoute>
    ),
  },
  {
    path: '/consultations',
    element: (
      <ProtectedRoute>
        <Consultations />
      </ProtectedRoute>
    ),
  },
  {
    path: '/specialties',
    element: (
      <ProtectedRoute>
        <Specialties />
      </ProtectedRoute>
    ),
  },
  {
    path: '/waiting-list',
    element: (
      <ProtectedRoute>
        <WaitingList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

