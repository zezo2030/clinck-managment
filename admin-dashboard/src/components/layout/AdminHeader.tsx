import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Menu, Search, User } from 'lucide-react';
import { useAuth } from '@/context';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="-m-2.5 p-2.5 lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">فتح القائمة</span>
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-border lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <div className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground pl-3" />
          <input
            className="block h-full w-full border-0 py-0 pl-10 pr-0 text-foreground placeholder:text-muted-foreground focus:ring-0 sm:text-sm bg-transparent"
            placeholder="البحث..."
            type="search"
            name="search"
          />
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">الإشعارات</span>
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" />

          {/* Profile dropdown */}
          <div className="flex items-center gap-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="hidden lg:block">
              <div className="text-sm font-medium">{user?.name || user?.email}</div>
              <div className="text-xs text-muted-foreground">أدمن</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

