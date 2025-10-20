# 🧪 المرحلة السابعة - الاختبارات والتحسينات

## 📋 نظرة عامة على المرحلة

هذه المرحلة تركز على:
- اختبار شامل للتطبيق
- تحسين الأداء
- تحسين الأمان
- تحسين تجربة المستخدم
- إعداد الإنتاج

---

## 🎯 الميزات الرئيسية

### **1. الاختبارات الشاملة**
- اختبارات الوحدة (Unit Tests)
- اختبارات التكامل (Integration Tests)
- اختبارات الواجهة (E2E Tests)
- اختبارات الأداء (Performance Tests)

### **2. تحسين الأداء**
- تحسين تحميل الصفحات
- تحسين استهلاك الذاكرة
- تحسين استهلاك الشبكة
- تحسين قاعدة البيانات

### **3. تحسين الأمان**
- حماية من XSS
- حماية من CSRF
- تشفير البيانات
- إدارة الجلسات

### **4. تحسين تجربة المستخدم**
- تحسين التصميم
- تحسين الاستجابة
- تحسين إمكانية الوصول
- تحسين الأداء

### **5. إعداد الإنتاج**
- إعداد البيئة الإنتاجية
- إعداد النسخ الاحتياطي
- إعداد المراقبة
- إعداد الأمان

---

## 🧪 الاختبارات الشاملة

### **1. Unit Tests**

```typescript
// src/components/__tests__/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ui/Button';

describe('Button Component', () => {
  it('renders button with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct variant classes', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
  });

  it('applies correct size classes', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-12');
  });
});
```

### **2. Integration Tests**

```typescript
// src/pages/__tests__/PatientDashboard.integration.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PatientDashboard } from '../patient/Dashboard';
import { patientService } from '@/services/patientService';

// Mock the service
jest.mock('@/services/patientService');
const mockedPatientService = patientService as jest.Mocked<typeof patientService>;

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('Patient Dashboard Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard with stats and appointments', async () => {
    const mockStats = {
      upcomingAppointments: 3,
      completedConsultations: 15,
      rescheduledAppointments: 1,
      pendingPayments: 2,
    };

    const mockAppointments = {
      upcoming: [
        { id: '1', date: '2024-01-15', time: '10:00', doctorName: 'Dr. Smith' },
        { id: '2', date: '2024-01-16', time: '14:00', doctorName: 'Dr. Johnson' },
      ],
      recent: [
        { id: '3', date: '2024-01-10', time: '09:00', doctorName: 'Dr. Brown' },
      ],
    };

    mockedPatientService.getStats.mockResolvedValue(mockStats);
    mockedPatientService.getAppointments.mockResolvedValue(mockAppointments);

    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <PatientDashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('المواعيد القادمة')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    expect(mockedPatientService.getStats).toHaveBeenCalledTimes(1);
    expect(mockedPatientService.getAppointments).toHaveBeenCalledTimes(1);
  });

  it('handles loading state correctly', () => {
    mockedPatientService.getStats.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <PatientDashboard />
      </QueryClientProvider>
    );

    expect(screen.getByText('جاري التحميل...')).toBeInTheDocument();
  });

  it('handles error state correctly', async () => {
    mockedPatientService.getStats.mockRejectedValue(new Error('API Error'));

    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <PatientDashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('حدث خطأ في تحميل البيانات')).toBeInTheDocument();
    });
  });
});
```

### **3. E2E Tests**

```typescript
// cypress/e2e/patient-dashboard.cy.ts
describe('Patient Dashboard E2E', () => {
  beforeEach(() => {
    cy.visit('/patient/dashboard');
    cy.login('patient@example.com', 'password');
  });

  it('displays patient dashboard correctly', () => {
    cy.get('[data-testid="patient-dashboard"]').should('be.visible');
    cy.get('[data-testid="stats-cards"]').should('have.length', 4);
    cy.get('[data-testid="upcoming-appointments"]').should('be.visible');
  });

  it('allows booking new appointment', () => {
    cy.get('[data-testid="book-appointment-btn"]').click();
    cy.get('[data-testid="appointment-modal"]').should('be.visible');
    
    cy.get('[data-testid="doctor-select"]').click();
    cy.get('[data-testid="doctor-option-1"]').click();
    
    cy.get('[data-testid="date-input"]').type('2024-01-20');
    cy.get('[data-testid="time-select"]').click();
    cy.get('[data-testid="time-option-10:00"]').click();
    
    cy.get('[data-testid="submit-appointment"]').click();
    
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('allows rescheduling appointment', () => {
    cy.get('[data-testid="appointments-table"]').should('be.visible');
    cy.get('[data-testid="reschedule-btn-1"]').click();
    
    cy.get('[data-testid="reschedule-modal"]').should('be.visible');
    cy.get('[data-testid="new-date-input"]').type('2024-01-25');
    cy.get('[data-testid="confirm-reschedule"]').click();
    
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('allows canceling appointment', () => {
    cy.get('[data-testid="cancel-btn-1"]').click();
    cy.get('[data-testid="cancel-confirmation"]').should('be.visible');
    cy.get('[data-testid="confirm-cancel"]').click();
    
    cy.get('[data-testid="success-message"]').should('be.visible');
  });
});
```

### **4. Performance Tests**

```typescript
// src/__tests__/performance.test.ts
import { performance } from 'perf_hooks';

describe('Performance Tests', () => {
  it('dashboard loads within acceptable time', async () => {
    const start = performance.now();
    
    // Simulate dashboard load
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const end = performance.now();
    const loadTime = end - start;
    
    expect(loadTime).toBeLessThan(1000); // Should load within 1 second
  });

  it('large data table renders efficiently', () => {
    const start = performance.now();
    
    // Simulate rendering large table
    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.random(),
    }));
    
    // Render table component
    const end = performance.now();
    const renderTime = end - start;
    
    expect(renderTime).toBeLessThan(100); // Should render within 100ms
  });

  it('chart renders without blocking', async () => {
    const start = performance.now();
    
    // Simulate chart rendering
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const end = performance.now();
    const renderTime = end - start;
    
    expect(renderTime).toBeLessThan(200); // Should render within 200ms
  });
});
```

---

## ⚡ تحسين الأداء

### **1. Code Splitting**

```typescript
// src/pages/lazy.tsx
import { lazy } from 'react';

// Lazy load pages
export const PatientDashboard = lazy(() => import('./patient/Dashboard'));
export const DoctorDashboard = lazy(() => import('./doctor/Dashboard'));
export const AdminDashboard = lazy(() => import('./admin/Dashboard'));
export const ClinicDashboard = lazy(() => import('./clinic/Dashboard'));

// Lazy load components
export const LineChart = lazy(() => import('@/components/charts/LineChart'));
export const BarChart = lazy(() => import('@/components/charts/BarChart'));
export const PieChart = lazy(() => import('@/components/charts/PieChart'));
```

### **2. Memoization**

```typescript
// src/components/optimized/StatsCard.tsx
import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  trend?: string;
  trendText?: string;
  className?: string;
}

export const StatsCard = memo<StatsCardProps>(({
  title,
  value,
  icon,
  color,
  trend,
  trendText,
  className,
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
  };

  const trendClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  };

  const getTrendClass = (trend: string) => {
    if (trend.startsWith('+')) return trendClasses.positive;
    if (trend.startsWith('-')) return trendClasses.negative;
    return trendClasses.neutral;
  };

  return (
    <div className={cn(
      'bg-white rounded-lg border p-6',
      colorClasses[color],
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && trendText && (
            <p className={cn('text-xs mt-1', getTrendClass(trend))}>
              {trend} {trendText}
            </p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';
```

### **3. Virtual Scrolling for Large Lists**

```typescript
// src/components/optimized/VirtualizedTable.tsx
import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualizedTableProps {
  data: any[];
  height: number;
  itemHeight: number;
  renderRow: (index: number, style: React.CSSProperties) => React.ReactNode;
}

export const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
  data,
  height,
  itemHeight,
  renderRow,
}) => {
  const itemCount = data.length;

  return (
    <List
      height={height}
      itemCount={itemCount}
      itemSize={itemHeight}
      width="100%"
    >
      {({ index, style }) => renderRow(index, style)}
    </List>
  );
};
```

### **4. Image Optimization**

```typescript
// src/components/optimized/OptimizedImage.tsx
import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  lazy?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+',
  lazy = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
};
```

---

## 🔒 تحسين الأمان

### **1. XSS Protection**

```typescript
// src/utils/security.ts
import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html);
};

export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const validateInput = (input: string, type: 'email' | 'phone' | 'text'): boolean => {
  switch (type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    case 'phone':
      return /^[\+]?[1-9][\d]{0,15}$/.test(input);
    case 'text':
      return input.length > 0 && input.length < 1000;
    default:
      return false;
  }
};
```

### **2. CSRF Protection**

```typescript
// src/utils/csrf.ts
export const getCsrfToken = (): string => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  return token || '';
};

export const addCsrfToken = (data: any): any => {
  return {
    ...data,
    _token: getCsrfToken(),
  };
};
```

### **3. Data Encryption**

```typescript
// src/utils/encryption.ts
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'default-key';

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
```

---

## 🎨 تحسين تجربة المستخدم

### **1. Loading States**

```typescript
// src/components/ui/Loading.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'جاري التحميل...',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        <div
          className={cn(
            'animate-spin rounded-full border-b-2 border-primary-600',
            sizeClasses[size]
          )}
        />
        {text && <p className="text-sm text-gray-600">{text}</p>}
      </div>
    </div>
  );
};
```

### **2. Error Boundaries**

```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                حدث خطأ غير متوقع
              </h2>
              <p className="text-gray-600 mb-6">
                نعتذر، حدث خطأ في تحميل الصفحة. يرجى المحاولة مرة أخرى.
              </p>
              <div className="space-x-4">
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-primary-600 text-white"
                >
                  إعادة تحميل الصفحة
                </Button>
                <Button
                  onClick={() => window.history.back()}
                  variant="outline"
                >
                  العودة للصفحة السابقة
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### **3. Accessibility Improvements**

```typescript
// src/components/accessible/AccessibleButton.tsx
import React from 'react';
import { Button } from '@/components/ui/Button';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-busy={loading}
    >
      {loading && (
        <span className="sr-only">جاري التحميل...</span>
      )}
      {children}
    </Button>
  );
};
```

---

## 🚀 إعداد الإنتاج

### **1. Environment Configuration**

```typescript
// src/config/environment.ts
interface EnvironmentConfig {
  apiUrl: string;
  wsUrl: string;
  appName: string;
  version: string;
  debug: boolean;
  features: {
    notifications: boolean;
    analytics: boolean;
    monitoring: boolean;
  };
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = process.env.NODE_ENV;
  
  switch (env) {
    case 'production':
      return {
        apiUrl: process.env.REACT_APP_API_URL || 'https://api.clinic.com',
        wsUrl: process.env.REACT_APP_WS_URL || 'wss://ws.clinic.com',
        appName: 'Clinic Management System',
        version: process.env.REACT_APP_VERSION || '1.0.0',
        debug: false,
        features: {
          notifications: true,
          analytics: true,
          monitoring: true,
        },
      };
    case 'staging':
      return {
        apiUrl: process.env.REACT_APP_API_URL || 'https://staging-api.clinic.com',
        wsUrl: process.env.REACT_APP_WS_URL || 'wss://staging-ws.clinic.com',
        appName: 'Clinic Management System (Staging)',
        version: process.env.REACT_APP_VERSION || '1.0.0-staging',
        debug: true,
        features: {
          notifications: true,
          analytics: false,
          monitoring: true,
        },
      };
    default:
      return {
        apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
        wsUrl: process.env.REACT_APP_WS_URL || 'ws://localhost:3000',
        appName: 'Clinic Management System (Development)',
        version: process.env.REACT_APP_VERSION || '1.0.0-dev',
        debug: true,
        features: {
          notifications: false,
          analytics: false,
          monitoring: false,
        },
      };
  }
};

export const config = getEnvironmentConfig();
```

### **2. Build Optimization**

```typescript
// vite.config.prod.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          ui: ['@headlessui/react', '@heroicons/react'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
```

### **3. Monitoring Setup**

```typescript
// src/utils/monitoring.ts
interface MonitoringConfig {
  enabled: boolean;
  apiKey: string;
  environment: string;
}

const monitoringConfig: MonitoringConfig = {
  enabled: process.env.NODE_ENV === 'production',
  apiKey: process.env.REACT_APP_MONITORING_API_KEY || '',
  environment: process.env.NODE_ENV || 'development',
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (!monitoringConfig.enabled) return;
  
  // Send to monitoring service
  console.log('Event tracked:', eventName, properties);
};

export const trackError = (error: Error, context?: Record<string, any>) => {
  if (!monitoringConfig.enabled) return;
  
  // Send error to monitoring service
  console.error('Error tracked:', error, context);
};

export const trackPerformance = (metricName: string, value: number) => {
  if (!monitoringConfig.enabled) return;
  
  // Send performance metric to monitoring service
  console.log('Performance tracked:', metricName, value);
};
```

---

## 📊 تقارير الأداء

### **1. Performance Report**

```typescript
// src/utils/performance.ts
export const generatePerformanceReport = () => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');
  
  const report = {
    pageLoad: {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      totalTime: navigation.loadEventEnd - navigation.fetchStart,
    },
    paint: {
      firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
    },
    resources: performance.getEntriesByType('resource').length,
    memory: (performance as any).memory ? {
      used: (performance as any).memory.usedJSHeapSize,
      total: (performance as any).memory.totalJSHeapSize,
      limit: (performance as any).memory.jsHeapSizeLimit,
    } : null,
  };
  
  return report;
};
```

---

## 📝 ملاحظات المرحلة السابعة

1. **الاختبارات**: اختبار شامل لجميع المكونات والوظائف
2. **الأداء**: تحسين الأداء والسرعة
3. **الأمان**: حماية شاملة للتطبيق
4. **تجربة المستخدم**: تحسين تجربة المستخدم
5. **الإنتاج**: إعداد بيئة الإنتاج

---

*تم إعداد هذه المرحلة لضمان جودة عالية وأداء ممتاز للتطبيق*
