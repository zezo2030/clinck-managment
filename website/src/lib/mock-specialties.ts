export const mockSpecialties = [
  {
    id: 1,
    name: 'طب الأسنان',
    description: 'رعاية شاملة لصحة الفم والأسنان',
    icon: '/brain_11666594 copy.webp',
    services: ['تنظيف الأسنان', 'حشو الأسنان', 'تقويم الأسنان', 'زراعة الأسنان'],
    isActive: true,
    doctors: [
      {
        id: 1,
        specialization: 'جراحة الفم والأسنان',
        experience: 8,
        consultationFee: '150',
        isAvailable: true,
        avatar: '/doctors/ahmed-mohamed.jpg',
        clinic: { id: 1, name: 'عيادة الأسنان المتقدمة', address: 'الرياض، حي النخيل' },
        department: { id: 1, name: 'قسم طب الأسنان' },
        specialty: { id: 1, name: 'طب الأسنان', icon: '/brain_11666594 copy.webp' },
        averageRating: 4.5,
        totalRatings: 2,
        user: {
          profile: {
            firstName: 'أحمد',
            lastName: 'محمد'
          }
        }
      }
    ]
  },
  {
    id: 2,
    name: 'طب العيون',
    description: 'تشخيص وعلاج أمراض العيون',
    icon: '/optometrist_750711 copy.webp',
    services: ['فحص النظر', 'جراحة العيون', 'علاج الجلوكوما', 'جراحة الساد'],
    isActive: true,
    doctors: [
      {
        id: 2,
        specialization: 'جراحة العيون',
        experience: 12,
        consultationFee: '200',
        isAvailable: true,
        avatar: '/doctors/fatima-ali.jpg',
        clinic: { id: 2, name: 'مركز العيون المتخصص', address: 'جدة، حي الزهراء' },
        department: { id: 2, name: 'قسم طب العيون' },
        specialty: { id: 2, name: 'طب العيون', icon: '/optometrist_750711 copy.webp' },
        averageRating: 4.8,
        totalRatings: 5,
        user: {
          profile: {
            firstName: 'فاطمة',
            lastName: 'علي'
          }
        }
      }
    ]
  },
  {
    id: 3,
    name: 'طب الأطفال',
    description: 'رعاية صحية شاملة للأطفال',
    icon: '/pediactrics_17327901 copy.webp',
    services: ['فحص النمو', 'التطعيمات', 'علاج الأمراض الشائعة', 'الاستشارات الغذائية'],
    isActive: true,
    doctors: [
      {
        id: 3,
        specialization: 'طب الأطفال العام',
        experience: 6,
        consultationFee: '120',
        isAvailable: true,
        avatar: '/doctors/sara-ahmed.jpg',
        clinic: { id: 3, name: 'عيادة الأطفال الحديثة', address: 'الدمام، حي الفيصلية' },
        department: { id: 3, name: 'قسم طب الأطفال' },
        specialty: { id: 3, name: 'طب الأطفال', icon: '/pediactrics_17327901 copy.webp' },
        averageRating: 4.7,
        totalRatings: 8,
        user: {
          profile: {
            firstName: 'سارة',
            lastName: 'أحمد'
          }
        }
      }
    ]
  },
  {
    id: 4,
    name: 'طب القلب',
    description: 'تشخيص وعلاج أمراض القلب والأوعية الدموية',
    icon: '/life_15896804 copy.webp',
    services: ['قسطرة القلب', 'جراحة القلب المفتوح', 'زراعة القلب', 'علاج اضطرابات النظم'],
    isActive: true,
    doctors: [
      {
        id: 4,
        specialization: 'جراحة القلب',
        experience: 15,
        consultationFee: '300',
        isAvailable: true,
        avatar: '/doctors/mohamed-saeed.jpg',
        clinic: { id: 4, name: 'مستشفى القلب المتخصص', address: 'الرياض، حي الملك فهد' },
        department: { id: 4, name: 'قسم جراحة القلب' },
        specialty: { id: 4, name: 'طب القلب', icon: '/life_15896804 copy.webp' },
        averageRating: 4.9,
        totalRatings: 12,
        user: {
          profile: {
            firstName: 'محمد',
            lastName: 'السعيد'
          }
        }
      }
    ]
  },
  {
    id: 5,
    name: 'طب الأورام',
    description: 'تشخيص وعلاج السرطان',
    icon: '/oncology_10202691 copy.webp',
    services: ['العلاج الكيميائي', 'العلاج الإشعاعي', 'الجراحة', 'العلاج المناعي'],
    isActive: true,
    doctors: [
      {
        id: 5,
        specialization: 'أورام الدم',
        user: {
          profile: {
            firstName: 'نورا',
            lastName: 'الزهراني'
          }
        }
      }
    ]
  },
  {
    id: 6,
    name: 'طب العظام',
    description: 'علاج إصابات وأمراض الجهاز العضلي الهيكلي',
    icon: '/orthopedics_11153168 copy.webp',
    services: ['جراحة العظام', 'العلاج الطبيعي', 'استبدال المفاصل', 'علاج الكسور'],
    isActive: true,
    doctors: [
      {
        id: 6,
        specialization: 'جراحة العظام',
        user: {
          profile: {
            firstName: 'خالد',
            lastName: 'المطيري'
          }
        }
      }
    ]
  },
  {
    id: 7,
    name: 'طب النفس',
    description: 'علاج الاضطرابات النفسية والعقلية',
    icon: '/psychiatry_18314806 copy.webp',
    services: ['العلاج النفسي', 'العلاج الدوائي', 'الاستشارات النفسية', 'علاج الاكتئاب'],
    isActive: true,
    doctors: [
      {
        id: 7,
        specialization: 'الطب النفسي',
        user: {
          profile: {
            firstName: 'ريم',
            lastName: 'القحطاني'
          }
        }
      }
    ]
  },
  {
    id: 8,
    name: 'طب المسالك البولية',
    description: 'علاج أمراض الجهاز البولي والتناسلي',
    icon: '/urology_17306383 copy.webp',
    services: ['جراحة المسالك البولية', 'علاج حصوات الكلى', 'جراحة البروستاتا', 'علاج العقم'],
    isActive: true,
    doctors: [
      {
        id: 8,
        specialization: 'جراحة المسالك البولية',
        user: {
          profile: {
            firstName: 'عبدالله',
            lastName: 'الغامدي'
          }
        }
      }
    ]
  },
  {
    id: 9,
    name: 'طب الجهاز الهضمي',
    description: 'تشخيص وعلاج أمراض الجهاز الهضمي',
    icon: '/stomach_7283076 copy.webp',
    services: ['منظار المعدة', 'منظار القولون', 'علاج القرحة', 'جراحة البطن'],
    isActive: true,
    doctors: [
      {
        id: 9,
        specialization: 'جراحة الجهاز الهضمي',
        user: {
          profile: {
            firstName: 'هند',
            lastName: 'السبيعي'
          }
        }
      }
    ]
  },
  {
    id: 10,
    name: 'طب النساء والولادة',
    description: 'رعاية صحية شاملة للمرأة',
    icon: '/reproductive_13981126 copy.webp',
    services: ['فحص الحوض', 'متابعة الحمل', 'الولادة الطبيعية', 'الولادة القيصرية'],
    isActive: true,
    doctors: [
      {
        id: 10,
        specialization: 'أمراض النساء والولادة',
        user: {
          profile: {
            firstName: 'مريم',
            lastName: 'الخالدي'
          }
        }
      }
    ]
  },
  {
    id: 11,
    name: 'الأشعة',
    description: 'التشخيص بالأشعة والتصوير الطبي',
    icon: '/x-ray_469450 copy.webp',
    services: ['الأشعة السينية', 'الرنين المغناطيسي', 'الأشعة المقطعية', 'الموجات فوق الصوتية'],
    isActive: true,
    doctors: [
      {
        id: 11,
        specialization: 'أشعة تشخيصية',
        user: {
          profile: {
            firstName: 'يوسف',
            lastName: 'النعيمي'
          }
        }
      }
    ]
  }
];
