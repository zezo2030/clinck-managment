# 🌐 المرحلة الخامسة - النشر والمراقبة

## 📋 نظرة عامة

تطوير المرحلة الخامسة من موقع الويب تتضمن:
- إعداد البيئة الإنتاجية
- نشر الموقع على الخوادم
- إعداد المراقبة والتحليلات
- إعداد النسخ الاحتياطية
- إعداد الصيانة والتحديثات
- إعداد الأمان الإنتاجي

---

## 🚀 إعداد البيئة الإنتاجية

### **1. Docker Production Configuration**
```dockerfile
# Dockerfile.prod
FROM node:18-alpine AS base

# تثبيت التبعيات
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# بناء التطبيق
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# تشغيل التطبيق
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### **2. Docker Compose Production**
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  website:
    build:
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
      - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
    depends_on:
      - backend
      - redis
    networks:
      - production-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    build:
      context: ../backend
      dockerfile: Dockerfile.prod
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
    networks:
      - production-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  dashboard:
    build:
      context: ../dashboard
      dockerfile: Dockerfile.prod
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - REACT_APP_API_URL=${REACT_APP_API_URL}
    depends_on:
      - backend
    networks:
      - production-network
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    networks:
      - production-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - production-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - website
      - backend
      - dashboard
    networks:
      - production-network
    restart: unless-stopped

  monitoring:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - production-network
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - production-network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:

networks:
  production-network:
    driver: bridge
```

### **3. Nginx Configuration**
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

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
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Upstream servers
    upstream website {
        server website:3000;
    }

    upstream backend {
        server backend:3001;
    }

    upstream dashboard {
        server dashboard:3002;
    }

    # Main server block
    server {
        listen 80;
        server_name clinic-system.com www.clinic-system.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name clinic-system.com www.clinic-system.com;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Main website
        location / {
            proxy_pass http://website;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Dashboard
        location /dashboard/ {
            proxy_pass http://dashboard;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

---

## 📊 المراقبة والتحليلات

### **1. Prometheus Configuration**
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'website'
    static_configs:
      - targets: ['website:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 30s

  - job_name: 'backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:80']
```

### **2. Alert Rules**
```yaml
# alert_rules.yml
groups:
  - name: website_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }} seconds"

      - alert: DatabaseDown
        expr: up{job="postgres"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database is down"
          description: "PostgreSQL database is not responding"

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanizePercentage }}"

      - alert: DiskSpaceLow
        expr: (node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Low disk space"
          description: "Disk usage is {{ $value | humanizePercentage }}"
```

### **3. Monitoring Dashboard**
```typescript
// src/components/monitoring/MonitoringDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  Activity, 
  Database, 
  Server, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';

interface SystemStatus {
  website: 'healthy' | 'warning' | 'error';
  backend: 'healthy' | 'warning' | 'error';
  database: 'healthy' | 'warning' | 'error';
  redis: 'healthy' | 'warning' | 'error';
  nginx: 'healthy' | 'warning' | 'error';
}

interface Metrics {
  cpu: number;
  memory: number;
  disk: number;
  requests: number;
  errors: number;
  responseTime: number;
  activeUsers: number;
}

export const MonitoringDashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    website: 'healthy',
    backend: 'healthy',
    database: 'healthy',
    redis: 'healthy',
    nginx: 'healthy',
  });

  const [metrics, setMetrics] = useState<Metrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    requests: 0,
    errors: 0,
    responseTime: 0,
    activeUsers: 0,
  });

  const [alerts, setAlerts] = useState<Array<{
    id: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/alerts');
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchMetrics();
    fetchAlerts();

    const interval = setInterval(() => {
      fetchMetrics();
      fetchAlerts();
    }, 30000); // كل 30 ثانية

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* رأس المراقبة */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">لوحة المراقبة</h2>
          <p className="text-gray-600">مراقبة حالة النظام والأداء</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600">متصل</span>
        </div>
      </div>

      {/* حالة النظام */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(systemStatus).map(([service, status]) => (
          <Card key={service} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 capitalize">
                  {service}
                </h3>
                <p className={`text-sm ${getStatusColor(status)}`}>
                  {status === 'healthy' ? 'سليم' : 
                   status === 'warning' ? 'تحذير' : 'خطأ'}
                </p>
              </div>
              {getStatusIcon(status)}
            </div>
          </Card>
        ))}
      </div>

      {/* المقاييس الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">استخدام المعالج</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.cpu.toFixed(1)}%
              </p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${metrics.cpu}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">استخدام الذاكرة</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.memory.toFixed(1)}%
              </p>
            </div>
            <Server className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${metrics.memory}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">المستخدمون النشطون</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.activeUsers.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">وقت الاستجابة</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.responseTime.toFixed(2)}s
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* التنبيهات */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          التنبيهات الأخيرة
        </h3>
        <div className="space-y-3">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.severity === 'critical'
                    ? 'bg-red-50 border-red-500'
                    : alert.severity === 'warning'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {alert.message}
                    </p>
                    <p className="text-sm text-gray-600">
                      {alert.timestamp.toLocaleString('ar-SA')}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.severity === 'critical'
                        ? 'bg-red-100 text-red-800'
                        : alert.severity === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {alert.severity === 'critical'
                      ? 'حرج'
                      : alert.severity === 'warning'
                      ? 'تحذير'
                      : 'معلومات'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              لا توجد تنبيهات حالياً
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};
```

---

## 💾 النسخ الاحتياطية

### **1. Backup Script**
```bash
#!/bin/bash
# backup.sh

# إعداد المتغيرات
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="clinic_db"
DB_USER="postgres"
DB_HOST="postgres"

# إنشاء مجلد النسخ الاحتياطية
mkdir -p $BACKUP_DIR

# نسخ احتياطي لقاعدة البيانات
echo "بدء النسخ الاحتياطي لقاعدة البيانات..."
docker exec postgres pg_dump -U $DB_USER -h $DB_HOST $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# نسخ احتياطي للملفات
echo "بدء النسخ الاحتياطي للملفات..."
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /app/uploads /app/logs

# ضغط النسخ الاحتياطية
echo "ضغط النسخ الاحتياطية..."
gzip $BACKUP_DIR/db_backup_$DATE.sql

# حذف النسخ القديمة (أكثر من 7 أيام)
echo "حذف النسخ القديمة..."
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

# إرسال النسخ إلى التخزين السحابي
echo "رفع النسخ إلى التخزين السحابي..."
aws s3 cp $BACKUP_DIR/db_backup_$DATE.sql.gz s3://clinic-backups/database/
aws s3 cp $BACKUP_DIR/files_backup_$DATE.tar.gz s3://clinic-backups/files/

echo "تم إكمال النسخ الاحتياطي بنجاح"
```

### **2. Automated Backup with Cron**
```bash
# crontab -e
# نسخ احتياطي يومي في الساعة 2:00 صباحاً
0 2 * * * /app/scripts/backup.sh

# نسخ احتياطي أسبوعي يوم الأحد في الساعة 3:00 صباحاً
0 3 * * 0 /app/scripts/weekly_backup.sh

# تنظيف السجلات القديمة يومياً
0 4 * * * find /app/logs -name "*.log" -mtime +30 -delete
```

### **3. Backup Restoration**
```bash
#!/bin/bash
# restore.sh

BACKUP_DATE=$1
BACKUP_DIR="/backups"

if [ -z "$BACKUP_DATE" ]; then
    echo "الرجاء تحديد تاريخ النسخ الاحتياطي"
    echo "الاستخدام: ./restore.sh YYYYMMDD_HHMMSS"
    exit 1
fi

# استعادة قاعدة البيانات
echo "استعادة قاعدة البيانات..."
gunzip -c $BACKUP_DIR/db_backup_$BACKUP_DATE.sql.gz | docker exec -i postgres psql -U postgres -d clinic_db

# استعادة الملفات
echo "استعادة الملفات..."
tar -xzf $BACKUP_DIR/files_backup_$BACKUP_DATE.tar.gz -C /

echo "تم استعادة النسخ الاحتياطي بنجاح"
```

---

## 🔧 الصيانة والتحديثات

### **1. Update Script**
```bash
#!/bin/bash
# update.sh

echo "بدء عملية التحديث..."

# إيقاف الخدمات
echo "إيقاف الخدمات..."
docker-compose -f docker-compose.prod.yml down

# نسخ احتياطي قبل التحديث
echo "إنشاء نسخ احتياطي..."
./backup.sh

# سحب التحديثات
echo "سحب التحديثات من Git..."
git pull origin main

# بناء الصور الجديدة
echo "بناء الصور الجديدة..."
docker-compose -f docker-compose.prod.yml build

# تشغيل الخدمات
echo "تشغيل الخدمات..."
docker-compose -f docker-compose.prod.yml up -d

# انتظار تشغيل الخدمات
echo "انتظار تشغيل الخدمات..."
sleep 30

# فحص صحة الخدمات
echo "فحص صحة الخدمات..."
curl -f http://localhost:3000/health || exit 1
curl -f http://localhost:3001/health || exit 1
curl -f http://localhost:3002/health || exit 1

echo "تم التحديث بنجاح"
```

### **2. Health Check Script**
```bash
#!/bin/bash
# health_check.sh

# فحص الخدمات
services=("website:3000" "backend:3001" "dashboard:3002" "postgres:5432" "redis:6379")

for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if curl -f http://localhost:$port/health > /dev/null 2>&1; then
        echo "✅ $name is healthy"
    else
        echo "❌ $name is down"
        # إرسال تنبيه
        curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"Service '$name' is down!"}' \
            $SLACK_WEBHOOK_URL
    fi
done
```

### **3. Log Rotation**
```bash
# /etc/logrotate.d/clinic-system
/app/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker-compose -f /app/docker-compose.prod.yml restart nginx
    endscript
}
```

---

## 🚀 نشر الموقع

### **1. Production Deployment**
```bash
#!/bin/bash
# deploy.sh

echo "بدء نشر الموقع..."

# فحص المتطلبات
if ! command -v docker &> /dev/null; then
    echo "Docker غير مثبت"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose غير مثبت"
    exit 1
fi

# إعداد متغيرات البيئة
if [ ! -f .env.production ]; then
    echo "إنشاء ملف متغيرات البيئة..."
    cp .env.example .env.production
    echo "الرجاء تحديث ملف .env.production"
    exit 1
fi

# بناء الصور
echo "بناء صور Docker..."
docker-compose -f docker-compose.prod.yml build

# تشغيل الخدمات
echo "تشغيل الخدمات..."
docker-compose -f docker-compose.prod.yml up -d

# انتظار تشغيل الخدمات
echo "انتظار تشغيل الخدمات..."
sleep 60

# فحص صحة الخدمات
echo "فحص صحة الخدمات..."
./health_check.sh

echo "تم نشر الموقع بنجاح!"
```

### **2. SSL Certificate Setup**
```bash
#!/bin/bash
# setup_ssl.sh

# تثبيت Certbot
apt-get update
apt-get install -y certbot python3-certbot-nginx

# الحصول على شهادة SSL
certbot --nginx -d clinic-system.com -d www.clinic-system.com

# إعداد التجديد التلقائي
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

---

## 📊 التحليلات المتقدمة

### **1. Custom Analytics**
```typescript
// src/lib/analytics.ts
export class Analytics {
  private static instance: Analytics;
  private events: Array<{
    event: string;
    properties: Record<string, any>;
    timestamp: Date;
  }> = [];

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  track(event: string, properties: Record<string, any> = {}) {
    this.events.push({
      event,
      properties,
      timestamp: new Date(),
    });

    // إرسال البيانات إلى الخادم
    this.sendToServer(event, properties);
  }

  private async sendToServer(event: string, properties: Record<string, any>) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          properties,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  // تتبع الأحداث المهمة
  trackPageView(page: string) {
    this.track('page_view', { page });
  }

  trackAppointmentBooking(doctorId: string, date: string) {
    this.track('appointment_booking', { doctorId, date });
  }

  trackVideoConsultation(doctorId: string, duration: number) {
    this.track('video_consultation', { doctorId, duration });
  }

  trackFormSubmission(formName: string, success: boolean) {
    this.track('form_submission', { formName, success });
  }
}

export const analytics = Analytics.getInstance();
```

### **2. Error Tracking**
```typescript
// src/lib/error-tracking.ts
export class ErrorTracker {
  private static instance: ErrorTracker;

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  init() {
    // تتبع أخطاء JavaScript
    window.addEventListener('error', (event) => {
      this.trackError('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    // تتبع أخطاء Promise
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('promise_rejection', {
        reason: event.reason,
        stack: event.reason?.stack,
      });
    });
  }

  trackError(type: string, error: Record<string, any>) {
    fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        error,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    });
  }
}

export const errorTracker = ErrorTracker.getInstance();
```

---

## 🚀 تشغيل المرحلة الخامسة

### **1. النشر**
```bash
# نشر الموقع
./deploy.sh

# إعداد SSL
./setup_ssl.sh

# إعداد النسخ الاحتياطية
./backup.sh
```

### **2. المراقبة**
```bash
# فحص صحة الخدمات
./health_check.sh

# عرض السجلات
docker-compose -f docker-compose.prod.yml logs -f

# مراقبة الأداء
docker stats
```

---

## 📝 ملاحظات المرحلة الخامسة

### **المهام المكتملة**
- ✅ إعداد البيئة الإنتاجية
- ✅ نشر الموقع على الخوادم
- ✅ إعداد المراقبة والتحليلات
- ✅ إعداد النسخ الاحتياطية
- ✅ إعداد الصيانة والتحديثات
- ✅ إعداد الأمان الإنتاجي

### **المهام المكتملة - المرحلة النهائية**
- ✅ جميع مراحل تطوير الموقع
- ✅ التكامل مع Backend
- ✅ التكامل مع Dashboard
- ✅ إعداد Docker الشامل
- ✅ النشر والإنتاج

---

*تم إكمال جميع مراحل تطوير موقع الويب بنجاح - جاهز للاستخدام الإنتاجي*
