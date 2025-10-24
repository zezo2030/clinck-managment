#!/bin/bash

# سكريبت لبناء Docker مع معالجة مشاكل الشبكة

echo "🚀 بدء بناء Docker مع معالجة مشاكل الشبكة..."

# تنظيف Docker cache
echo "🧹 تنظيف Docker cache..."
docker system prune -f
docker builder prune -f

# إعداد متغيرات البيئة للشبكة
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# بناء الخدمات مع retry
echo "🔨 بناء backend..."
docker-compose -f docker-compose.dev.yml build --no-cache --parallel backend-dev || {
    echo "⚠️  فشل البناء الأول، إعادة المحاولة..."
    sleep 10
    docker-compose -f docker-compose.dev.yml build --no-cache backend-dev || {
        echo "⚠️  فشل البناء الثاني، إعادة المحاولة مرة أخيرة..."
        sleep 30
        docker-compose -f docker-compose.dev.yml build --no-cache backend-dev
    }
}

echo "🔨 بناء admin-dashboard..."
docker-compose -f docker-compose.dev.yml build --no-cache admin-dashboard-dev || {
    echo "⚠️  فشل البناء الأول، إعادة المحاولة..."
    sleep 10
    docker-compose -f docker-compose.dev.yml build --no-cache admin-dashboard-dev || {
        echo "⚠️  فشل البناء الثاني، إعادة المحاولة مرة أخيرة..."
        sleep 30
        docker-compose -f docker-compose.dev.yml build --no-cache admin-dashboard-dev
    }
}

echo "🔨 بناء website..."
docker-compose -f docker-compose.dev.yml build --no-cache website-dev || {
    echo "⚠️  فشل البناء الأول، إعادة المحاولة..."
    sleep 10
    docker-compose -f docker-compose.dev.yml build --no-cache website-dev || {
        echo "⚠️  فشل البناء الثاني، إعادة المحاولة مرة أخيرة..."
        sleep 30
        docker-compose -f docker-compose.dev.yml build --no-cache website-dev
    }
}

echo "✅ انتهى البناء!"
echo "🚀 لتشغيل الخدمات: docker-compose -f docker-compose.dev.yml up"
