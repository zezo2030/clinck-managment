import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء عملية بذر البيانات...');

  // إنشاء مدير النظام
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@clinic.com' },
    update: {},
    create: {
      email: 'admin@clinic.com',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      profile: {
        create: {
          firstName: 'مدير',
          lastName: 'النظام',
          phone: '+966501234567',
          address: 'الرياض، المملكة العربية السعودية',
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log('✅ تم إنشاء مدير النظام:', admin.email);

  // إنشاء طبيب تجريبي
  const doctorPassword = await bcrypt.hash('doctor123', 10);
  
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@clinic.com' },
    update: {},
    create: {
      email: 'doctor@clinic.com',
      password: doctorPassword,
      role: 'DOCTOR',
      isActive: true,
      profile: {
        create: {
          firstName: 'د. أحمد',
          lastName: 'محمد',
          phone: '+966501234568',
          address: 'الرياض، المملكة العربية السعودية',
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log('✅ تم إنشاء طبيب تجريبي:', doctor.email);

  // إنشاء مريض تجريبي
  const patientPassword = await bcrypt.hash('patient123', 10);
  
  const patient = await prisma.user.upsert({
    where: { email: 'patient@clinic.com' },
    update: {},
    create: {
      email: 'patient@clinic.com',
      password: patientPassword,
      role: 'PATIENT',
      isActive: true,
      profile: {
        create: {
          firstName: 'سارة',
          lastName: 'أحمد',
          phone: '+966501234569',
          address: 'الرياض، المملكة العربية السعودية',
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log('✅ تم إنشاء مريض تجريبي:', patient.email);

  console.log('🎉 تم إكمال عملية بذر البيانات بنجاح!');
  console.log('\n📋 بيانات الدخول:');
  console.log('👨‍💼 المدير: admin@clinic.com / admin123');
  console.log('👨‍⚕️ الطبيب: doctor@clinic.com / doctor123');
  console.log('👤 المريض: patient@clinic.com / patient123');
}

main()
  .catch((e) => {
    console.error('❌ خطأ في عملية بذر البيانات:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
