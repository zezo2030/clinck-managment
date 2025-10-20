# 🌐 المرحلة الأولى - إعداد البيئة والهيكل الأساسي للموقع

## 📋 نظرة عامة

تطوير المرحلة الأولى من موقع الويب تتضمن:
- إعداد البيئة التطويرية
- إنشاء هيكل المشروع الأساسي
- إعداد Docker للتطوير
- تكوين Next.js مع TypeScript
- إعداد Tailwind CSS
- إنشاء المكونات الأساسية

---

## 🛠️ التقنيات المستخدمة

### **Core Technologies**
- **Next.js 14** - App Router
- **React 18** - مع TypeScript
- **Tailwind CSS** - للتصميم
- **Docker** - للحاويات
- **ESLint & Prettier** - لجودة الكود

### **Development Tools**
- **TypeScript** - أنواع البيانات
- **ESLint** - فحص الكود
- **Prettier** - تنسيق الكود
- **Husky** - Git hooks
- **Lint-staged** - فحص الملفات المحدثة

---

## 🏗️ هيكل المشروع

```
website/
├── .docker/
│   ├── Dockerfile.dev
│   └── docker-compose.dev.yml
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── api/
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── index.ts
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Navigation.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── validations.ts
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       └── globals.css
├── .env.local
├── .env.example
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── docker-compose.yml
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🐳 إعداد Docker

### **1. Dockerfile للتطوير**
```dockerfile
# .docker/Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# تثبيت التبعيات
COPY package*.json ./
RUN npm ci

# نسخ الكود
COPY . .

# فتح المنفذ
EXPOSE 3000

# تشغيل التطبيق
CMD ["npm", "run", "dev"]
```

### **2. Docker Compose للتطوير**
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  website:
    build:
      context: .
      dockerfile: .docker/Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      - backend
    networks:
      - clinic-network

  backend:
    build:
      context: ../backend
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3001"
    volumes:
      - ../backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/clinic_db
    depends_on:
      - postgres
    networks:
      - clinic-network

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=clinic_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - clinic-network

  dashboard:
    build:
      context: ../dashboard
      dockerfile: Dockerfile.dev
    ports:
      - "3002:3002"
    volumes:
      - ../dashboard:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - REACT_APP_API_URL=http://backend:3001
    depends_on:
      - backend
    networks:
      - clinic-network

volumes:
  postgres_data:

networks:
  clinic-network:
    driver: bridge
```

---

## 📦 إعداد Package.json

### **package.json**
```json
{
  "name": "clinic-website",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "docker:dev": "docker-compose -f docker-compose.dev.yml up",
    "docker:build": "docker-compose -f docker-compose.dev.yml build",
    "docker:down": "docker-compose -f docker-compose.dev.yml down"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.2.2",
    "@types/node": "20.8.0",
    "@types/react": "18.2.25",
    "@types/react-dom": "18.2.11",
    "tailwindcss": "3.3.3",
    "autoprefixer": "10.4.16",
    "postcss": "8.4.31",
    "clsx": "2.0.0",
    "class-variance-authority": "0.7.0",
    "lucide-react": "0.292.0",
    "framer-motion": "10.16.4",
    "react-hook-form": "7.47.0",
    "@hookform/resolvers": "3.3.2",
    "zod": "3.22.4",
    "swiper": "10.3.1",
    "aos": "2.3.4"
  },
  "devDependencies": {
    "eslint": "8.51.0",
    "eslint-config-next": "14.0.0",
    "@typescript-eslint/eslint-plugin": "6.7.4",
    "@typescript-eslint/parser": "6.7.4",
    "prettier": "3.0.3",
    "prettier-plugin-tailwindcss": "0.5.6",
    "husky": "8.0.3",
    "lint-staged": "15.0.2",
    "jest": "29.7.0",
    "@testing-library/react": "13.4.0",
    "@testing-library/jest-dom": "6.1.4",
    "jest-environment-jsdom": "29.7.0"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
}
```

---

## ⚙️ إعداد TypeScript

### **tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 🎨 إعداد Tailwind CSS

### **tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

---

## 🧩 المكونات الأساسية

### **1. Button Component**
```typescript
// src/components/ui/Button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50',
        secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200',
        ghost: 'hover:bg-primary-50 hover:text-primary-600',
        link: 'underline-offset-4 hover:underline text-primary-600',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### **2. Card Component**
```typescript
// src/components/ui/Card.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-white shadow-sm',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
```

### **3. Input Component**
```typescript
// src/components/ui/Input.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
```

---

## 🏠 الصفحة الرئيسية الأساسية

### **src/app/(main)/page.tsx**
```typescript
import React from 'react';
import { Hero } from '@/components/sections/Hero';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
```

### **src/components/sections/Hero.tsx**
```typescript
import React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon, PlayIcon } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                رعاية طبية
                <span className="text-primary-600 block">
                  متطورة وذكية
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                احجز موعدك بسهولة، احصل على استشارات طبية افتراضية، 
                وأدار صحتك بطريقة ذكية مع نظام إدارة العيادات المتطور
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary-600 text-white hover:bg-primary-700">
                احجز موعدك الآن
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-600 text-primary-600 hover:bg-primary-50"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                شاهد الفيديو
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">500+</div>
                <div className="text-sm text-gray-600">طبيب متخصص</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">10K+</div>
                <div className="text-sm text-gray-600">مريض راضٍ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">50+</div>
                <div className="text-sm text-gray-600">عيادة شريكة</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="w-full h-96 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PlayIcon className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-gray-600">صورة لوحة التحكم</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
```

---

## 🧪 الاختبارات الأساسية

### **jest.config.js**
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
```

### **jest.setup.js**
```javascript
import '@testing-library/jest-dom';
```

### **اختبار Button Component**
```typescript
// src/components/ui/__tests__/Button.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
```

---

## 🚀 تشغيل المشروع

### **1. التطوير المحلي**
```bash
# تثبيت التبعيات
npm install

# تشغيل التطوير
npm run dev

# فحص الكود
npm run lint

# تنسيق الكود
npm run format
```

### **2. التطوير مع Docker**
```bash
# تشغيل جميع الخدمات
npm run docker:dev

# إعادة بناء الحاويات
npm run docker:build

# إيقاف الخدمات
npm run docker:down
```

### **3. الاختبارات**
```bash
# تشغيل الاختبارات
npm test

# تشغيل الاختبارات مع المراقبة
npm run test:watch

# تقرير التغطية
npm run test:coverage
```

---

## 📝 ملاحظات المرحلة الأولى

### **المهام المكتملة**
- ✅ إعداد البيئة التطويرية
- ✅ تكوين Docker للتطوير
- ✅ إعداد Next.js مع TypeScript
- ✅ إعداد Tailwind CSS
- ✅ إنشاء المكونات الأساسية
- ✅ إعداد الاختبارات

### **المهام التالية (المرحلة الثانية)**
- 🔄 إنشاء الصفحات الأساسية
- 🔄 تطوير مكونات التخطيط
- 🔄 إضافة الرسوم المتحركة
- 🔄 تحسين التصميم

---

*تم إعداد المرحلة الأولى بنجاح - جاهز للمرحلة الثانية*
