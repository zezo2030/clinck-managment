# سكريبت PowerShell لبناء Docker مع معالجة مشاكل الشبكة

Write-Host "🚀 بدء بناء Docker مع معالجة مشاكل الشبكة..." -ForegroundColor Green

# تنظيف Docker cache
Write-Host "🧹 تنظيف Docker cache..." -ForegroundColor Yellow
docker system prune -f
docker builder prune -f

# إعداد متغيرات البيئة للشبكة
$env:DOCKER_BUILDKIT = "1"
$env:COMPOSE_DOCKER_CLI_BUILD = "1"

# دالة لإعادة المحاولة
function Build-Service {
    param($ServiceName)
    
    Write-Host "🔨 بناء $ServiceName..." -ForegroundColor Cyan
    docker-compose -f docker-compose.dev.yml build --no-cache --parallel $ServiceName
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  فشل البناء الأول، إعادة المحاولة..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        docker-compose -f docker-compose.dev.yml build --no-cache $ServiceName
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "⚠️  فشل البناء الثاني، إعادة المحاولة مرة أخيرة..." -ForegroundColor Yellow
            Start-Sleep -Seconds 30
            docker-compose -f docker-compose.dev.yml build --no-cache $ServiceName
        }
    }
}

# بناء الخدمات
Build-Service "backend-dev"
Build-Service "admin-dashboard-dev"
Build-Service "website-dev"

Write-Host "✅ انتهى البناء!" -ForegroundColor Green
Write-Host "🚀 لتشغيل الخدمات: docker-compose -f docker-compose.dev.yml up" -ForegroundColor Cyan
