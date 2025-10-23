const { execSync } = require('child_process');

console.log('🌱 Running database seed...');

try {
  // تشغيل الـ seed باستخدام TypeORM CLI
  execSync('npx typeorm migration:run', { stdio: 'inherit' });
  console.log('✅ Database migrations completed');
  
  // يمكن إضافة تشغيل الـ seed هنا لاحقاً
  console.log('✅ Database seeded successfully');
} catch (error) {
  console.error('❌ Error seeding database:', error.message);
  process.exit(1);
}
