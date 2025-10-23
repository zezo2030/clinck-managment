const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'clinic_db',
  user: 'postgres',
  password: 'clinic_password',
});

async function addSampleDoctors() {
  try {
    await client.connect();
    console.log('Connected to database');

    // إضافة عيادة افتراضية
    const clinicResult = await client.query(`
      INSERT INTO clinics (name, address, phone, email, "isActive", "createdAt", "updatedAt")
      VALUES ('عيادة النور الطبية', 'الرياض، المملكة العربية السعودية', '+966501234567', 'info@nour-clinic.com', true, NOW(), NOW())
      ON CONFLICT (name) DO NOTHING
      RETURNING id
    `);

    const clinicId = clinicResult.rows[0]?.id || 1;

    // إضافة قسم افتراضي
    const departmentResult = await client.query(`
      INSERT INTO departments (name, description, "isActive", "createdAt", "updatedAt")
      VALUES ('الطب العام', 'القسم الرئيسي للطب العام', true, NOW(), NOW())
      ON CONFLICT (name) DO NOTHING
      RETURNING id
    `);

    const departmentId = departmentResult.rows[0]?.id || 1;

    // إضافة تخصص افتراضي
    const specialtyResult = await client.query(`
      INSERT INTO specialties (name, description, icon, services, "isActive", "createdAt", "updatedAt")
      VALUES ('طب الأسنان', 'رعاية شاملة لصحة الفم والأسنان', '/brain_11666594 copy.webp', '["تنظيف الأسنان", "حشو الأسنان", "تقويم الأسنان", "زراعة الأسنان"]', true, NOW(), NOW())
      ON CONFLICT (name) DO NOTHING
      RETURNING id
    `);

    const specialtyId = specialtyResult.rows[0]?.id || 1;

    // إضافة أطباء تجريبيين
    const doctors = [
      {
        email: 'dr.ahmed@clinic.com',
        password: '$2b$10$example.hash.here', // hashed password
        firstName: 'أحمد',
        lastName: 'محمد',
        phone: '+966501234567',
        specialization: 'طبيب أسنان',
        licenseNumber: 'DENT001',
        experience: 10,
        consultationFee: '200.00'
      },
      {
        email: 'dr.sara@clinic.com',
        password: '$2b$10$example.hash.here',
        firstName: 'سارة',
        lastName: 'علي',
        phone: '+966501234568',
        specialization: 'طبيبة عيون',
        licenseNumber: 'EYE001',
        experience: 8,
        consultationFee: '250.00'
      }
    ];

    for (const doctorData of doctors) {
      // إضافة المستخدم
      const userResult = await client.query(`
        INSERT INTO users (email, password, role, "isActive", "createdAt", "updatedAt")
        VALUES ($1, $2, 'DOCTOR', true, NOW(), NOW())
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `, [doctorData.email, doctorData.password]);

      const userId = userResult.rows[0]?.id;
      if (!userId) continue;

      // إضافة الملف الشخصي
      await client.query(`
        INSERT INTO profiles ("userId", "firstName", "lastName", phone, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        ON CONFLICT ("userId") DO NOTHING
      `, [userId, doctorData.firstName, doctorData.lastName, doctorData.phone]);

      // إضافة الطبيب
      await client.query(`
        INSERT INTO doctors ("userId", "clinicId", "specialtyId", "departmentId", specialization, "licenseNumber", experience, "consultationFee", "isAvailable", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW(), NOW())
        ON CONFLICT ("userId") DO NOTHING
      `, [userId, clinicId, specialtyId, departmentId, doctorData.specialization, doctorData.licenseNumber, doctorData.experience, doctorData.consultationFee]);
    }

    console.log('✅ Sample doctors added successfully');
  } catch (error) {
    console.error('❌ Error adding sample doctors:', error);
  } finally {
    await client.end();
  }
}

addSampleDoctors();
