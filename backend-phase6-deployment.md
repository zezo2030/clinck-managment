# 🚀 المرحلة السادسة: النشر والإنتاج - نظام إدارة العيادات

## 📋 نظرة عامة على المرحلة السادسة

هذه المرحلة تركز على إعداد البيئة الإنتاجية ونشر النظام مع مراقبة الأداء والأمان.

**المدة المقدرة:** 4 أسابيع  
**الهدف:** نشر النظام في البيئة الإنتاجية مع مراقبة شاملة

---

## 🛠️ التقنيات المطلوبة

### **Containerization:**
- **Docker** - حاويات التطبيقات
- **Docker Compose** - إدارة الحاويات
- **Kubernetes** - إدارة الحاويات المتقدمة

### **Cloud Platforms:**
- **AWS** - منصة السحابة
- **Google Cloud** - منصة السحابة البديلة
- **Azure** - منصة السحابة البديلة

### **Monitoring & Logging:**
- **Prometheus** - مراقبة الأداء
- **Grafana** - لوحات المراقبة
- **ELK Stack** - تحليل السجلات

### **CI/CD:**
- **GitHub Actions** - التكامل المستمر
- **Jenkins** - التكامل المستمر البديل
- **GitLab CI** - التكامل المستمر البديل

---

## 🏗️ هيكل المشروع للمرحلة السادسة

```
backend/
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   └── nginx/
│       └── nginx.conf
├── k8s/
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
├── scripts/
│   ├── build.sh
│   ├── deploy.sh
│   ├── backup.sh
│   └── restore.sh
├── monitoring/
│   ├── prometheus/
│   │   └── prometheus.yml
│   ├── grafana/
│   │   └── dashboards/
│   └── elk/
│       └── logstash.conf
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── cd.yml
│       └── security.yml
└── docs/
    ├── deployment.md
    ├── monitoring.md
    └── troubleshooting.md
```

---

## 🚀 خطوات التنفيذ

### **الأسبوع الأول: Containerization**

#### **1.1 Dockerfile**
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy the built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

USER nestjs

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "run", "start:prod"]
```

#### **1.2 Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/clinic_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=clinic_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

#### **1.3 Docker Compose للإنتاج**
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
    depends_on:
      - db
      - redis
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '0.25'
          memory: 256M
        reservations:
          cpus: '0.1'
          memory: 128M

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### **الأسبوع الثاني: Kubernetes**

#### **2.1 Namespace**
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: clinic-management
  labels:
    name: clinic-management
```

#### **2.2 ConfigMap**
```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: clinic-config
  namespace: clinic-management
data:
  NODE_ENV: "production"
  PORT: "3000"
  API_PREFIX: "api/v1"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
```

#### **2.3 Secret**
```yaml
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: clinic-secrets
  namespace: clinic-management
type: Opaque
data:
  DATABASE_URL: <base64-encoded-database-url>
  JWT_SECRET: <base64-encoded-jwt-secret>
  STRIPE_SECRET_KEY: <base64-encoded-stripe-secret>
  FIREBASE_PRIVATE_KEY: <base64-encoded-firebase-key>
```

#### **2.4 Deployment**
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: clinic-backend
  namespace: clinic-management
spec:
  replicas: 3
  selector:
    matchLabels:
      app: clinic-backend
  template:
    metadata:
      labels:
        app: clinic-backend
    spec:
      containers:
      - name: clinic-backend
        image: clinic-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: clinic-config
              key: NODE_ENV
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: clinic-secrets
              key: DATABASE_URL
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: clinic-secrets
              key: JWT_SECRET
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### **2.5 Service**
```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: clinic-backend-service
  namespace: clinic-management
spec:
  selector:
    app: clinic-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
```

#### **2.6 Ingress**
```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: clinic-ingress
  namespace: clinic-management
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - api.clinic.com
    secretName: clinic-tls
  rules:
  - host: api.clinic.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: clinic-backend-service
            port:
              number: 80
```

### **الأسبوع الثالث: CI/CD Pipeline**

#### **3.1 GitHub Actions - CI**
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Generate Prisma client
      run: npx prisma generate
    
    - name: Run database migrations
      run: npx prisma migrate deploy
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm run test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        REDIS_URL: redis://localhost:6379
        JWT_SECRET: test-secret
    
    - name: Run e2e tests
      run: npm run test:e2e
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        REDIS_URL: redis://localhost:6379
        JWT_SECRET: test-secret
    
    - name: Build application
      run: npm run build
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

#### **3.2 GitHub Actions - CD**
```yaml
# .github/workflows/cd.yml
name: CD

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: |
          clinic-backend:latest
          clinic-backend:${{ github.sha }}
          clinic-backend:${{ github.ref_name }}
    
    - name: Deploy to Kubernetes
      uses: azure/k8s-deploy@v1
      with:
        manifests: |
          k8s/namespace.yaml
          k8s/configmap.yaml
          k8s/secret.yaml
          k8s/deployment.yaml
          k8s/service.yaml
          k8s/ingress.yaml
        kubeconfig: ${{ secrets.KUBE_CONFIG }}
        namespace: clinic-management
```

#### **3.3 Security Scanning**
```yaml
# .github/workflows/security.yml
name: Security

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  push:
    branches: [ main ]

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy scan results to GitHub Security tab
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'
    
    - name: Run npm audit
      run: npm audit --audit-level high
    
    - name: Run Snyk to check for vulnerabilities
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high
```

### **الأسبوع الرابع: Monitoring & Logging**

#### **4.1 Prometheus Configuration**
```yaml
# monitoring/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

scrape_configs:
  - job_name: 'clinic-backend'
    static_configs:
      - targets: ['clinic-backend:3000']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

#### **4.2 Grafana Dashboard**
```json
{
  "dashboard": {
    "id": null,
    "title": "Clinic Management System",
    "tags": ["clinic", "healthcare"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "id": 2,
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "id": 3,
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ]
      },
      {
        "id": 4,
        "title": "Database Connections",
        "type": "graph",
        "targets": [
          {
            "expr": "pg_stat_database_numbackends",
            "legendFormat": "Active connections"
          }
        ]
      }
    ]
  }
}
```

#### **4.3 Health Check Endpoint**
```typescript
// src/common/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { RedisHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private redisHealth: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database'),
      () => this.redisHealth.pingCheck('redis'),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database'),
      () => this.redisHealth.pingCheck('redis'),
    ]);
  }

  @Get('live')
  live() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
```

#### **4.4 Logging Configuration**
```typescript
// src/common/logging/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor(private configService: ConfigService) {
    this.logger = winston.createLogger({
      level: this.configService.get('LOG_LEVEL', 'info'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
```

---

## 🔧 إعدادات البيئة

### **متغيرات البيئة للإنتاج**
```env
# Production Environment
NODE_ENV=production
PORT=3000
API_PREFIX=api/v1

# Database
DATABASE_URL=postgresql://username:password@host:5432/database
DB_HOST=postgres-service
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=secure_password
DB_NAME=clinic_db

# Redis
REDIS_URL=redis://redis-service:6379
REDIS_HOST=redis-service
REDIS_PORT=6379
REDIS_PASSWORD=secure_redis_password

# JWT
JWT_SECRET=super_secure_jwt_secret_key
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret

# Firebase
FIREBASE_PROJECT_ID=your_production_project_id
FIREBASE_PRIVATE_KEY=your_production_private_key
FIREBASE_CLIENT_EMAIL=your_production_client_email

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_production_email@gmail.com
SMTP_PASS=your_production_app_password

# Monitoring
LOG_LEVEL=info
PROMETHEUS_ENABLED=true
GRAFANA_ENABLED=true

# Security
CORS_ORIGIN=https://clinic.com
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100
```

---

## 📊 مؤشرات النجاح

### **المخرجات المطلوبة:**
1. ✅ Docker containers تعمل بنجاح
2. ✅ Kubernetes deployment يعمل
3. ✅ CI/CD pipeline يعمل
4. ✅ Monitoring system يعمل
5. ✅ Logging system يعمل
6. ✅ Security scanning يعمل

### **الاختبارات المطلوبة:**
- [ ] Health checks تعمل
- [ ] Load balancing يعمل
- [ ] Auto-scaling يعمل
- [ ] Backup system يعمل
- [ ] Security scanning يعمل
- [ ] Performance monitoring يعمل

---

## 🚀 الخطوات التالية

بعد إكمال المرحلة السادسة، ستكون النظام جاهزاً للإنتاج مع:
- **مراقبة شاملة** للأداء والأمان
- **نسخ احتياطية** منتظمة
- **تحديثات تلقائية** آمنة
- **دعم فني** متكامل

---

*هذه المرحلة تضمن استقرار وأمان النظام في البيئة الإنتاجية*
