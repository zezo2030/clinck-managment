# 🐳 إعداد Docker للنظام الكامل

## 📋 نظرة عامة

إعداد Docker شامل لنظام إدارة العيادات يشمل:
- **Backend API** (NestJS)
- **Frontend Web** (Next.js)
- **Database** (PostgreSQL)
- **Cache** (Redis)
- **Reverse Proxy** (Nginx)

---

## 🏗️ هيكل Docker

```
clinic-management-system/
├── docker-compose.yml          # Docker Compose الرئيسي
├── docker-compose.dev.yml      # Docker Compose للتطوير
├── docker-compose.prod.yml     # Docker Compose للإنتاج
├── nginx/
│   ├── nginx.conf              # إعدادات Nginx
│   └── ssl/                    # شهادات SSL
├── backend/
│   ├── Dockerfile              # Dockerfile للباك إند
│   ├── Dockerfile.dev          # Dockerfile للتطوير
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile              # Dockerfile للفرونت إند
│   ├── Dockerfile.dev          # Dockerfile للتطوير
│   └── .dockerignore
├── database/
│   ├── init.sql                # سكريبت تهيئة قاعدة البيانات
│   └── migrations/             # ملفات ترحيل البيانات
└── scripts/
    ├── setup.sh                # سكريبت الإعداد
    └── deploy.sh               # سكريبت النشر
```

---

## 🐳 Docker Compose الرئيسي

### **docker-compose.yml**
```yaml
version: '3.8'

services:
  # قاعدة البيانات PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: clinic_postgres
    environment:
      POSTGRES_DB: clinic_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: clinic_password
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --lc-collate=C --lc-ctype=C"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
      - ./database/migrations:/docker-entrypoint-initdb.d/migrations
    ports:
      - "5432:5432"
    networks:
      - clinic_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis للتخزين المؤقت
  redis:
    image: redis:7-alpine
    container_name: clinic_redis
    command: redis-server --appendonly yes --requirepass clinic_redis_password
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - clinic_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # الباك إند NestJS
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: clinic_backend
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:clinic_password@postgres:5432/clinic_db
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASSWORD=clinic_redis_password
      - JWT_SECRET=your_jwt_secret_key_here
      - JWT_EXPIRES_IN=7d
      - PORT=3000
    volumes:
      - ./backend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    networks:
      - clinic_network
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # الفرونت إند Next.js
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: clinic_frontend
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
      - NEXT_PUBLIC_WS_URL=ws://localhost:3000
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    ports:
      - "3001:3000"
    networks:
      - clinic_network
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: clinic_nginx
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    ports:
      - "80:80"
      - "443:443"
    networks:
      - clinic_network
    depends_on:
      - backend
      - frontend
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  clinic_network:
    driver: bridge
```

---

## 🐳 Docker Compose للتطوير

### **docker-compose.dev.yml**
```yaml
version: '3.8'

services:
  # قاعدة البيانات للتطوير
  postgres-dev:
    image: postgres:15-alpine
    container_name: clinic_postgres_dev
    environment:
      POSTGRES_DB: clinic_db_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: clinic_password_dev
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5433:5432"
    networks:
      - clinic_network_dev

  # Redis للتطوير
  redis-dev:
    image: redis:7-alpine
    container_name: clinic_redis_dev
    command: redis-server --appendonly yes
    volumes:
      - redis_dev_data:/data
    ports:
      - "6380:6379"
    networks:
      - clinic_network_dev

  # الباك إند للتطوير
  backend-dev:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: clinic_backend_dev
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:clinic_password_dev@postgres-dev:5432/clinic_db_dev
      - REDIS_HOST=redis-dev
      - REDIS_PORT=6379
      - JWT_SECRET=dev_jwt_secret
      - PORT=3000
    volumes:
      - ./backend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    networks:
      - clinic_network_dev
    depends_on:
      - postgres-dev
      - redis-dev
    command: npm run start:dev

  # الفرونت إند للتطوير
  frontend-dev:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: clinic_frontend_dev
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    ports:
      - "3001:3000"
    networks:
      - clinic_network_dev
    depends_on:
      - backend-dev
    command: npm run dev

volumes:
  postgres_dev_data:
    driver: local
  redis_dev_data:
    driver: local

networks:
  clinic_network_dev:
    driver: bridge
```

---

## 🐳 Docker Compose للإنتاج

### **docker-compose.prod.yml**
```yaml
version: '3.8'

services:
  # قاعدة البيانات للإنتاج
  postgres-prod:
    image: postgres:15-alpine
    container_name: clinic_postgres_prod
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - clinic_network_prod
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis للإنتاج
  redis-prod:
    image: redis:7-alpine
    container_name: clinic_redis_prod
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_prod_data:/data
    networks:
      - clinic_network_prod
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "auth", "${REDIS_PASSWORD}", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # الباك إند للإنتاج
  backend-prod:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: clinic_backend_prod
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres-prod:5432/${POSTGRES_DB}
      - REDIS_HOST=redis-prod
      - REDIS_PORT=6379
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
      - PORT=3000
    networks:
      - clinic_network_prod
    depends_on:
      postgres-prod:
        condition: service_healthy
      redis-prod:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # الفرونت إند للإنتاج
  frontend-prod:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: clinic_frontend_prod
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
      - NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}
    networks:
      - clinic_network_prod
    depends_on:
      - backend-prod
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Nginx للإنتاج
  nginx-prod:
    image: nginx:alpine
    container_name: clinic_nginx_prod
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    ports:
      - "80:80"
      - "443:443"
    networks:
      - clinic_network_prod
    depends_on:
      - backend-prod
      - frontend-prod
    restart: unless-stopped

volumes:
  postgres_prod_data:
    driver: local
  redis_prod_data:
    driver: local

networks:
  clinic_network_prod:
    driver: bridge
```

---

## 🐳 Dockerfile للباك إند

### **backend/Dockerfile**
```dockerfile
# Multi-stage build للباك إند
FROM node:18-alpine AS base

# تثبيت الحزم المطلوبة
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# نسخ ملفات التبعيات
COPY package*.json ./
COPY prisma ./prisma/

# تثبيت التبعيات
RUN npm ci --only=production && npm cache clean --force

# نسخ الكود المصدري
COPY . .

# بناء التطبيق
RUN npm run build

# مرحلة الإنتاج
FROM node:18-alpine AS production

# تثبيت الحزم المطلوبة
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# نسخ التبعيات من المرحلة السابقة
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/package*.json ./
COPY --from=base /app/prisma ./prisma

# إنشاء مستخدم غير root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# تغيير ملكية الملفات
RUN chown -R nestjs:nodejs /app
USER nestjs

# فتح المنفذ
EXPOSE 3000

# متغيرات البيئة
ENV NODE_ENV=production
ENV PORT=3000

# تشغيل التطبيق
CMD ["npm", "run", "start:prod"]
```

### **backend/Dockerfile.dev**
```dockerfile
# Dockerfile للتطوير
FROM node:18-alpine

# تثبيت الحزم المطلوبة
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# نسخ ملفات التبعيات
COPY package*.json ./
COPY prisma ./prisma/

# تثبيت جميع التبعيات (بما في ذلك dev dependencies)
RUN npm ci

# نسخ الكود المصدري
COPY . .

# فتح المنفذ
EXPOSE 3000

# متغيرات البيئة
ENV NODE_ENV=development
ENV PORT=3000

# تشغيل التطبيق في وضع التطوير
CMD ["npm", "run", "start:dev"]
```

---

## 🐳 Dockerfile للفرونت إند

### **frontend/Dockerfile**
```dockerfile
# Multi-stage build للفرونت إند
FROM node:18-alpine AS base

# تثبيت الحزم المطلوبة
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# نسخ ملفات التبعيات
COPY package*.json ./

# تثبيت التبعيات
RUN npm ci --only=production && npm cache clean --force

# نسخ الكود المصدري
COPY . .

# بناء التطبيق
RUN npm run build

# مرحلة الإنتاج
FROM node:18-alpine AS production

# تثبيت الحزم المطلوبة
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# نسخ التبعيات من المرحلة السابقة
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package*.json ./
COPY --from=base /app/next.config.js ./

# إنشاء مستخدم غير root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# تغيير ملكية الملفات
RUN chown -R nextjs:nodejs /app
USER nextjs

# فتح المنفذ
EXPOSE 3000

# متغيرات البيئة
ENV NODE_ENV=production
ENV PORT=3000

# تشغيل التطبيق
CMD ["npm", "run", "start"]
```

### **frontend/Dockerfile.dev**
```dockerfile
# Dockerfile للتطوير
FROM node:18-alpine

# تثبيت الحزم المطلوبة
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# نسخ ملفات التبعيات
COPY package*.json ./

# تثبيت جميع التبعيات (بما في ذلك dev dependencies)
RUN npm ci

# نسخ الكود المصدري
COPY . .

# فتح المنفذ
EXPOSE 3000

# متغيرات البيئة
ENV NODE_ENV=development
ENV PORT=3000

# تشغيل التطبيق في وضع التطوير
CMD ["npm", "run", "dev"]
```

---

## 🌐 إعدادات Nginx

### **nginx/nginx.conf**
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Upstream servers
    upstream backend {
        server backend:3000;
    }

    upstream frontend {
        server frontend:3000;
    }

    # HTTP server (redirect to HTTPS)
    server {
        listen 80;
        server_name clinic.example.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name clinic.example.com;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # WebSocket support
        location /socket.io/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Frontend routes
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Static files caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            proxy_pass http://frontend;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

---

## 🔧 ملفات البيئة

### **.env.production**
```env
# Database
POSTGRES_DB=clinic_db_prod
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_production_password

# Redis
REDIS_PASSWORD=secure_redis_password

# JWT
JWT_SECRET=your_very_secure_jwt_secret_key
JWT_EXPIRES_IN=7d

# API URLs
NEXT_PUBLIC_API_URL=https://clinic.example.com/api/v1
NEXT_PUBLIC_WS_URL=wss://clinic.example.com

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key

# Agora
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### **.env.development**
```env
# Database
POSTGRES_DB=clinic_db_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=dev_password

# Redis
REDIS_PASSWORD=dev_redis_password

# JWT
JWT_SECRET=dev_jwt_secret
JWT_EXPIRES_IN=7d

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3000

# Firebase
FIREBASE_PROJECT_ID=your_dev_project_id
FIREBASE_PRIVATE_KEY=your_dev_private_key
FIREBASE_CLIENT_EMAIL=your_dev_client_email

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Agora
AGORA_APP_ID=your_dev_agora_app_id
AGORA_APP_CERTIFICATE=your_dev_agora_app_certificate

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_dev_email@gmail.com
SMTP_PASS=your_dev_app_password
```

---

## 🚀 سكريبتات الإعداد والنشر

### **scripts/setup.sh**
```bash
#!/bin/bash

# سكريبت إعداد النظام
echo "🏥 إعداد نظام إدارة العيادات..."

# التحقق من وجود Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker غير مثبت. يرجى تثبيت Docker أولاً."
    exit 1
fi

# التحقق من وجود Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose غير مثبت. يرجى تثبيت Docker Compose أولاً."
    exit 1
fi

# إنشاء ملفات البيئة
if [ ! -f .env ]; then
    echo "📝 إنشاء ملف البيئة..."
    cp .env.example .env
    echo "✅ تم إنشاء ملف .env. يرجى تحديث القيم المطلوبة."
fi

# إنشاء مجلدات SSL
echo "🔐 إنشاء مجلدات SSL..."
mkdir -p nginx/ssl

# إنشاء شهادات SSL للتطوير
if [ ! -f nginx/ssl/cert.pem ]; then
    echo "🔐 إنشاء شهادات SSL للتطوير..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/key.pem \
        -out nginx/ssl/cert.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
fi

# بناء الصور
echo "🐳 بناء صور Docker..."
docker-compose build

# تشغيل الخدمات
echo "🚀 تشغيل الخدمات..."
docker-compose up -d

# انتظار بدء الخدمات
echo "⏳ انتظار بدء الخدمات..."
sleep 30

# التحقق من حالة الخدمات
echo "🔍 التحقق من حالة الخدمات..."
docker-compose ps

# تشغيل ترحيل قاعدة البيانات
echo "🗄️ تشغيل ترحيل قاعدة البيانات..."
docker-compose exec backend npm run prisma:migrate:deploy

# تشغيل بذور البيانات
echo "🌱 تشغيل بذور البيانات..."
docker-compose exec backend npm run prisma:seed

echo "✅ تم إعداد النظام بنجاح!"
echo "🌐 الواجهة الأمامية: http://localhost:3001"
echo "🔧 API: http://localhost:3000"
echo "📊 قاعدة البيانات: localhost:5432"
echo "💾 Redis: localhost:6379"
```

### **scripts/deploy.sh**
```bash
#!/bin/bash

# سكريبت نشر النظام
echo "🚀 نشر نظام إدارة العيادات..."

# التحقق من وجود ملف البيئة للإنتاج
if [ ! -f .env.production ]; then
    echo "❌ ملف .env.production غير موجود."
    exit 1
fi

# نسخ ملف البيئة
cp .env.production .env

# إيقاف الخدمات الحالية
echo "⏹️ إيقاف الخدمات الحالية..."
docker-compose -f docker-compose.prod.yml down

# بناء الصور للإنتاج
echo "🐳 بناء صور Docker للإنتاج..."
docker-compose -f docker-compose.prod.yml build --no-cache

# تشغيل الخدمات للإنتاج
echo "🚀 تشغيل الخدمات للإنتاج..."
docker-compose -f docker-compose.prod.yml up -d

# انتظار بدء الخدمات
echo "⏳ انتظار بدء الخدمات..."
sleep 60

# التحقق من حالة الخدمات
echo "🔍 التحقق من حالة الخدمات..."
docker-compose -f docker-compose.prod.yml ps

# تشغيل ترحيل قاعدة البيانات
echo "🗄️ تشغيل ترحيل قاعدة البيانات..."
docker-compose -f docker-compose.prod.yml exec backend npm run prisma:migrate:deploy

echo "✅ تم نشر النظام بنجاح!"
```

---

## 📊 مراقبة النظام

### **scripts/monitor.sh**
```bash
#!/bin/bash

# سكريبت مراقبة النظام
echo "📊 مراقبة نظام إدارة العيادات..."

# حالة الخدمات
echo "🔍 حالة الخدمات:"
docker-compose ps

# استخدام الموارد
echo "💻 استخدام الموارد:"
docker stats --no-stream

# سجلات الأخطاء
echo "📝 سجلات الأخطاء:"
docker-compose logs --tail=50

# حالة قاعدة البيانات
echo "🗄️ حالة قاعدة البيانات:"
docker-compose exec postgres pg_isready -U postgres

# حالة Redis
echo "💾 حالة Redis:"
docker-compose exec redis redis-cli ping

# حالة الباك إند
echo "🔧 حالة الباك إند:"
curl -f http://localhost:3000/health || echo "❌ الباك إند غير متاح"

# حالة الفرونت إند
echo "🌐 حالة الفرونت إند:"
curl -f http://localhost:3001 || echo "❌ الفرونت إند غير متاح"
```

---

## 🔧 أوامر Docker المفيدة

### **أوامر التطوير**
```bash
# تشغيل النظام للتطوير
docker-compose -f docker-compose.dev.yml up -d

# مشاهدة السجلات
docker-compose -f docker-compose.dev.yml logs -f

# إعادة بناء الخدمات
docker-compose -f docker-compose.dev.yml build --no-cache

# إيقاف النظام
docker-compose -f docker-compose.dev.yml down

# حذف البيانات
docker-compose -f docker-compose.dev.yml down -v
```

### **أوامر الإنتاج**
```bash
# تشغيل النظام للإنتاج
docker-compose -f docker-compose.prod.yml up -d

# مشاهدة السجلات
docker-compose -f docker-compose.prod.yml logs -f

# إعادة بناء الخدمات
docker-compose -f docker-compose.prod.yml build --no-cache

# إيقاف النظام
docker-compose -f docker-compose.prod.yml down

# حذف البيانات
docker-compose -f docker-compose.prod.yml down -v
```

### **أوامر الصيانة**
```bash
# تنظيف الصور غير المستخدمة
docker system prune -a

# تنظيف الحاويات المتوقفة
docker container prune

# تنظيف الشبكات غير المستخدمة
docker network prune

# تنظيف الأحجام غير المستخدمة
docker volume prune

# نسخ احتياطي لقاعدة البيانات
docker-compose exec postgres pg_dump -U postgres clinic_db > backup.sql

# استعادة قاعدة البيانات
docker-compose exec -T postgres psql -U postgres clinic_db < backup.sql
```

---

## 📝 ملاحظات مهمة

1. **الأمان**: استخدام كلمات مرور قوية ومتغيرات بيئة آمنة
2. **النسخ الاحتياطي**: إجراء نسخ احتياطية منتظمة لقاعدة البيانات
3. **المراقبة**: مراقبة استخدام الموارد والأداء
4. **التحديثات**: تحديث الصور والحاويات بانتظام
5. **SSL**: استخدام شهادات SSL صحيحة للإنتاج

---

*تم إعداد هذا الدليل لضمان تشغيل النظام بكفاءة وأمان*
