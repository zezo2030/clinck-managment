import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  Calendar,
  MessageSquare,
  FileText,
  Layers,
  BarChart3,
  Settings,
  Bell,
  User,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '@/context';

const navigation = [
  { name: 'لوحة التحكم', href: '/', icon: LayoutDashboard },
  { name: 'المستخدمين', href: '/users', icon: Users },
  { name: 'الأطباء', href: '/doctors', icon: Stethoscope },
  { name: 'العيادات', href: '/clinics', icon: Building2 },
  { name: 'المواعيد', href: '/appointments', icon: Calendar },
  { name: 'الاستشارات', href: '/consultations', icon: MessageSquare },
  { name: 'التخصصات', href: '/specialties', icon: FileText },
  { name: 'الأقسام', href: '/departments', icon: Layers },
  { name: 'قوائم الانتظار', href: '/waiting-list', icon: Bell },
  { name: 'التقارير', href: '/reports', icon: BarChart3 },
  { name: 'الإعدادات', href: '/settings', icon: Settings },
];

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ open, onOpenChange }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-card p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-lg font-semibold">لوحة التحكم</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => onOpenChange(false)}
                      className={cn(
                        'group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-5 w-5 shrink-0',
                          isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center gap-x-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{user?.name || user?.email}</div>
                <div className="text-xs text-muted-foreground">أدمن</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

