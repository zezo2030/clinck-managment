import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const AdminBreadcrumb: React.FC<AdminBreadcrumbProps> = ({ 
  items, 
  className 
}) => {
  const location = useLocation();

  // Generate breadcrumb items from current path if not provided
  const breadcrumbItems = items || React.useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [
      { label: 'لوحة التحكم', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      items.push({
        label,
        href: isLast ? undefined : currentPath
      });
    });

    return items;
  }, [location.pathname]);

  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
            )}
            {index === 0 && <Home className="w-4 h-4 text-muted-foreground mr-1" />}
            {item.href ? (
              <Link
                to={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

