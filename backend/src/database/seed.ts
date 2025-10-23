import { DataSource } from 'typeorm';
import { Specialty } from './entities/specialty.entity';
import { Clinic } from './entities/clinic.entity';

export async function seedDatabase(dataSource: DataSource) {
  const specialtyRepository = dataSource.getRepository(Specialty);
  const clinicRepository = dataSource.getRepository(Clinic);

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

  console.log('تم إنشاء التخصصات الافتراضية بنجاح');
}
