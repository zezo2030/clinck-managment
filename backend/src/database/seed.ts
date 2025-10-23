import { DataSource } from 'typeorm';
import { Specialty } from './entities/specialty.entity';
import { Clinic } from './entities/clinic.entity';
import { Department } from './entities/department.entity';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Doctor } from './entities/doctor.entity';
import { RoleEnum } from './enums/role.enum';

export async function seedDatabase(dataSource: DataSource) {
  const specialtyRepository = dataSource.getRepository(Specialty);
  const clinicRepository = dataSource.getRepository(Clinic);
  const departmentRepository = dataSource.getRepository(Department);
  const userRepository = dataSource.getRepository(User);
  const profileRepository = dataSource.getRepository(Profile);
  const doctorRepository = dataSource.getRepository(Doctor);

  // إنشاء عيادة افتراضية
  const defaultClinic = clinicRepository.create({
    name: 'عيادة النور الطبية',
    address: 'الرياض، المملكة العربية السعودية',
    phone: '+966501234567',
    email: 'info@nour-clinic.com',
    isActive: true,
  });
  await clinicRepository.save(defaultClinic);

  // التخصصات الافتراضية
  const specialties = [
    {
      name: 'طب الأسنان',
      description: 'رعاية شاملة لصحة الفم والأسنان',
      icon: '/brain_11666594 copy.webp',
      services: ['تنظيف الأسنان', 'حشو الأسنان', 'تقويم الأسنان', 'زراعة الأسنان']
    },
    {
      name: 'طب العيون',
      description: 'تشخيص وعلاج أمراض العيون',
      icon: '/optometrist_750711 copy.webp',
      services: ['فحص النظر', 'جراحة العيون', 'علاج الجلوكوما', 'جراحة الساد']
    },
    {
      name: 'طب الأطفال',
      description: 'رعاية صحية شاملة للأطفال',
      icon: '/pediactrics_17327901 copy.webp',
      services: ['فحص النمو', 'التطعيمات', 'علاج الأمراض الشائعة', 'الاستشارات الغذائية']
    },
    {
      name: 'طب القلب',
      description: 'تشخيص وعلاج أمراض القلب والأوعية الدموية',
      icon: '/life_15896804 copy.webp',
      services: ['قسطرة القلب', 'جراحة القلب المفتوح', 'زراعة القلب', 'علاج اضطرابات النظم']
    },
    {
      name: 'طب الأورام',
      description: 'تشخيص وعلاج السرطان',
      icon: '/oncology_10202691 copy.webp',
      services: ['العلاج الكيميائي', 'العلاج الإشعاعي', 'الجراحة', 'العلاج المناعي']
    },
    {
      name: 'طب العظام',
      description: 'علاج إصابات وأمراض الجهاز العضلي الهيكلي',
      icon: '/orthopedics_11153168 copy.webp',
      services: ['جراحة العظام', 'العلاج الطبيعي', 'استبدال المفاصل', 'علاج الكسور']
    },
    {
      name: 'طب النفس',
      description: 'علاج الاضطرابات النفسية والعقلية',
      icon: '/psychiatry_18314806 copy.webp',
      services: ['العلاج النفسي', 'العلاج الدوائي', 'الاستشارات النفسية', 'علاج الاكتئاب']
    },
    {
      name: 'طب المسالك البولية',
      description: 'علاج أمراض الجهاز البولي والتناسلي',
      icon: '/urology_17306383 copy.webp',
      services: ['جراحة المسالك البولية', 'علاج حصوات الكلى', 'جراحة البروستاتا', 'علاج العقم']
    },
    {
      name: 'طب الجهاز الهضمي',
      description: 'تشخيص وعلاج أمراض الجهاز الهضمي',
      icon: '/stomach_7283076 copy.webp',
      services: ['منظار المعدة', 'منظار القولون', 'علاج القرحة', 'جراحة البطن']
    },
    {
      name: 'طب النساء والولادة',
      description: 'رعاية صحية شاملة للمرأة',
      icon: '/reproductive_13981126 copy.webp',
      services: ['فحص الحوض', 'متابعة الحمل', 'الولادة الطبيعية', 'الولادة القيصرية']
    },
    {
      name: 'الأشعة',
      description: 'التشخيص بالأشعة والتصوير الطبي',
      icon: '/x-ray_469450 copy.webp',
      services: ['الأشعة السينية', 'الرنين المغناطيسي', 'الأشعة المقطعية', 'الموجات فوق الصوتية']
    }
  ];

  for (const specialtyData of specialties) {
    const specialty = specialtyRepository.create(specialtyData);
    await specialtyRepository.save(specialty);
  }

  // إنشاء قسم افتراضي
  const defaultDepartment = departmentRepository.create({
    name: 'الطب العام',
    description: 'القسم الرئيسي للطب العام',
    isActive: true,
  });
  await departmentRepository.save(defaultDepartment);

  // إنشاء أطباء تجريبيين
  const doctorsData = [
    {
      email: 'dr.ahmed@clinic.com',
      password: 'password123',
      firstName: 'أحمد',
      lastName: 'محمد',
      phone: '+966501234567',
      specialization: 'طبيب أسنان',
      licenseNumber: 'DENT001',
      experience: 10,
      consultationFee: '200.00',
    },
    {
      email: 'dr.sara@clinic.com',
      password: 'password123',
      firstName: 'سارة',
      lastName: 'علي',
      phone: '+966501234568',
      specialization: 'طبيبة عيون',
      licenseNumber: 'EYE001',
      experience: 8,
      consultationFee: '250.00',
    },
    {
      email: 'dr.omar@clinic.com',
      password: 'password123',
      firstName: 'عمر',
      lastName: 'حسن',
      phone: '+966501234569',
      specialization: 'طبيب أطفال',
      licenseNumber: 'PED001',
      experience: 12,
      consultationFee: '180.00',
    }
  ];

  for (const doctorData of doctorsData) {
    // إنشاء المستخدم
    const user = userRepository.create({
      email: doctorData.email,
      password: doctorData.password,
      role: RoleEnum.DOCTOR,
    });
    await userRepository.save(user);

    // إنشاء الملف الشخصي
    const profile = profileRepository.create({
      userId: user.id,
      firstName: doctorData.firstName,
      lastName: doctorData.lastName,
      phone: doctorData.phone,
    });
    await profileRepository.save(profile);

    // إنشاء الطبيب
    const doctor = doctorRepository.create({
      userId: user.id,
      clinicId: defaultClinic.id,
      specialtyId: 1, // طب الأسنان
      departmentId: defaultDepartment.id,
      specialization: doctorData.specialization,
      licenseNumber: doctorData.licenseNumber,
      experience: doctorData.experience,
      consultationFee: doctorData.consultationFee,
      isAvailable: true,
    });
    await doctorRepository.save(doctor);
  }

  console.log('تم إنشاء التخصصات والأطباء الافتراضية بنجاح');
}
