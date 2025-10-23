import { DoctorProfile, Rating } from '@/types';

// Mock data for doctors - will be replaced with real API calls
const mockDoctors: DoctorProfile[] = [
  {
    id: 1,
    userId: 1,
    specialization: 'جراحة الفم والأسنان',
    licenseNumber: 'DENT-2023-001',
    experience: 8,
    consultationFee: '150',
    isAvailable: true,
    user: {
      id: 1,
      email: 'ahmed.mohamed@clinic.com',
      profile: {
        firstName: 'أحمد',
        lastName: 'محمد',
        phone: '+966501234567',
        avatar: '/doctors/ahmed-mohamed.jpg'
      }
    },
    clinic: {
      id: 1,
      name: 'عيادة الأسنان المتقدمة',
      address: 'الرياض، حي النخيل'
    },
    specialty: {
      id: 1,
      name: 'طب الأسنان',
      icon: '/brain_11666594 copy.webp'
    },
    department: {
      id: 1,
      name: 'قسم طب الأسنان'
    },
    schedules: [
      {
        id: 1,
        doctorId: 1,
        dayOfWeek: 0, // Sunday
        startTime: new Date('2024-01-01T09:00:00'),
        endTime: new Date('2024-01-01T17:00:00'),
        isActive: true
      },
      {
        id: 2,
        doctorId: 1,
        dayOfWeek: 1, // Monday
        startTime: new Date('2024-01-01T09:00:00'),
        endTime: new Date('2024-01-01T17:00:00'),
        isActive: true
      }
    ],
    ratings: [
      {
        id: 1,
        doctorId: 1,
        patientId: 1,
        rating: 5,
        comment: 'طبيب ممتاز، تعامل مهني جداً',
        createdAt: new Date('2024-01-15'),
        patient: {
          id: 1,
          profile: {
            firstName: 'سارة',
            lastName: 'أحمد',
            avatar: '/patients/sara-ahmed.jpg'
          }
        }
      },
      {
        id: 2,
        doctorId: 1,
        patientId: 2,
        rating: 4,
        comment: 'خدمة جيدة، لكن الانتظار طويل',
        createdAt: new Date('2024-01-10'),
        patient: {
          id: 2,
          profile: {
            firstName: 'محمد',
            lastName: 'علي',
            avatar: '/patients/mohamed-ali.jpg'
          }
        }
      }
    ],
    averageRating: 4.5,
    totalRatings: 2
  },
  {
    id: 2,
    userId: 2,
    specialization: 'جراحة العيون',
    licenseNumber: 'EYE-2023-002',
    experience: 12,
    consultationFee: '200',
    isAvailable: true,
    user: {
      id: 2,
      email: 'fatima.ali@clinic.com',
      profile: {
        firstName: 'فاطمة',
        lastName: 'علي',
        phone: '+966501234568',
        avatar: '/doctors/fatima-ali.jpg'
      }
    },
    clinic: {
      id: 2,
      name: 'مركز العيون المتخصص',
      address: 'جدة، حي الزهراء'
    },
    specialty: {
      id: 2,
      name: 'طب العيون',
      icon: '/optometrist_750711 copy.webp'
    },
    department: {
      id: 2,
      name: 'قسم طب العيون'
    },
    schedules: [
      {
        id: 3,
        doctorId: 2,
        dayOfWeek: 0, // Sunday
        startTime: new Date('2024-01-01T08:00:00'),
        endTime: new Date('2024-01-01T16:00:00'),
        isActive: true
      }
    ],
    ratings: [
      {
        id: 3,
        doctorId: 2,
        patientId: 3,
        rating: 5,
        comment: 'دكتورة ممتازة ومهنية جداً',
        createdAt: new Date('2024-01-12'),
        patient: {
          id: 3,
          profile: {
            firstName: 'نورا',
            lastName: 'السعيد',
            avatar: '/patients/nora-saeed.jpg'
          }
        }
      }
    ],
    averageRating: 4.8,
    totalRatings: 1
  },
  {
    id: 3,
    userId: 3,
    specialization: 'طب الأطفال العام',
    licenseNumber: 'PED-2023-003',
    experience: 6,
    consultationFee: '120',
    isAvailable: true,
    user: {
      id: 3,
      email: 'sara.ahmed@clinic.com',
      profile: {
        firstName: 'سارة',
        lastName: 'أحمد',
        phone: '+966501234569',
        avatar: '/doctors/sara-ahmed.jpg'
      }
    },
    clinic: {
      id: 3,
      name: 'عيادة الأطفال الحديثة',
      address: 'الدمام، حي الفيصلية'
    },
    specialty: {
      id: 3,
      name: 'طب الأطفال',
      icon: '/pediactrics_17327901 copy.webp'
    },
    department: {
      id: 3,
      name: 'قسم طب الأطفال'
    },
    schedules: [
      {
        id: 4,
        doctorId: 3,
        dayOfWeek: 1, // Monday
        startTime: new Date('2024-01-01T09:00:00'),
        endTime: new Date('2024-01-01T17:00:00'),
        isActive: true
      }
    ],
    ratings: [
      {
        id: 4,
        doctorId: 3,
        patientId: 4,
        rating: 5,
        comment: 'دكتورة رائعة مع الأطفال',
        createdAt: new Date('2024-01-08'),
        patient: {
          id: 4,
          profile: {
            firstName: 'خالد',
            lastName: 'المطيري',
            avatar: '/patients/khalid-mutairi.jpg'
          }
        }
      }
    ],
    averageRating: 4.7,
    totalRatings: 1
  },
  {
    id: 4,
    userId: 4,
    specialization: 'جراحة القلب',
    licenseNumber: 'CARD-2023-004',
    experience: 15,
    consultationFee: '300',
    isAvailable: true,
    user: {
      id: 4,
      email: 'mohamed.saeed@clinic.com',
      profile: {
        firstName: 'محمد',
        lastName: 'السعيد',
        phone: '+966501234570',
        avatar: '/doctors/mohamed-saeed.jpg'
      }
    },
    clinic: {
      id: 4,
      name: 'مستشفى القلب المتخصص',
      address: 'الرياض، حي الملك فهد'
    },
    specialty: {
      id: 4,
      name: 'طب القلب',
      icon: '/life_15896804 copy.webp'
    },
    department: {
      id: 4,
      name: 'قسم جراحة القلب'
    },
    schedules: [
      {
        id: 5,
        doctorId: 4,
        dayOfWeek: 2, // Tuesday
        startTime: new Date('2024-01-01T08:00:00'),
        endTime: new Date('2024-01-01T18:00:00'),
        isActive: true
      }
    ],
    ratings: [
      {
        id: 5,
        doctorId: 4,
        patientId: 5,
        rating: 5,
        comment: 'طبيب متميز في جراحة القلب',
        createdAt: new Date('2024-01-05'),
        patient: {
          id: 5,
          profile: {
            firstName: 'عبدالله',
            lastName: 'الغامدي',
            avatar: '/patients/abdullah-ghamdi.jpg'
          }
        }
      }
    ],
    averageRating: 4.9,
    totalRatings: 1
  },
  {
    id: 5,
    userId: 5,
    specialization: 'أورام الدم',
    licenseNumber: 'ONC-2023-005',
    experience: 10,
    consultationFee: '250',
    isAvailable: true,
    user: {
      id: 5,
      email: 'nora.alzahrani@clinic.com',
      profile: {
        firstName: 'نورا',
        lastName: 'الزهراني',
        phone: '+966501234571',
        avatar: '/doctors/nora-alzahrani.jpg'
      }
    },
    clinic: {
      id: 5,
      name: 'مركز الأورام المتخصص',
      address: 'الرياض، حي الملك عبدالله'
    },
    specialty: {
      id: 5,
      name: 'طب الأورام',
      icon: '/oncology_10202691 copy.webp'
    },
    department: {
      id: 5,
      name: 'قسم طب الأورام'
    },
    schedules: [
      {
        id: 6,
        doctorId: 5,
        dayOfWeek: 3, // Wednesday
        startTime: new Date('2024-01-01T09:00:00'),
        endTime: new Date('2024-01-01T17:00:00'),
        isActive: true
      }
    ],
    ratings: [
      {
        id: 6,
        doctorId: 5,
        patientId: 6,
        rating: 5,
        comment: 'دكتورة متميزة في علاج الأورام',
        createdAt: new Date('2024-01-03'),
        patient: {
          id: 6,
          profile: {
            firstName: 'فهد',
            lastName: 'الخالدي',
            avatar: '/patients/fahad-khalidi.jpg'
          }
        }
      }
    ],
    averageRating: 4.9,
    totalRatings: 1
  },
  {
    id: 6,
    userId: 6,
    specialization: 'جراحة العظام',
    licenseNumber: 'ORTH-2023-006',
    experience: 14,
    consultationFee: '220',
    isAvailable: true,
    user: {
      id: 6,
      email: 'khalid.mutairi@clinic.com',
      profile: {
        firstName: 'خالد',
        lastName: 'المطيري',
        phone: '+966501234572',
        avatar: '/doctors/khalid-mutairi.jpg'
      }
    },
    clinic: {
      id: 6,
      name: 'عيادة العظام المتقدمة',
      address: 'الدمام، حي الشاطئ'
    },
    specialty: {
      id: 6,
      name: 'طب العظام',
      icon: '/orthopedics_11153168 copy.webp'
    },
    department: {
      id: 6,
      name: 'قسم جراحة العظام'
    },
    schedules: [
      {
        id: 7,
        doctorId: 6,
        dayOfWeek: 4, // Thursday
        startTime: new Date('2024-01-01T08:00:00'),
        endTime: new Date('2024-01-01T16:00:00'),
        isActive: true
      }
    ],
    ratings: [
      {
        id: 7,
        doctorId: 6,
        patientId: 7,
        rating: 4,
        comment: 'طبيب جيد في جراحة العظام',
        createdAt: new Date('2024-01-01'),
        patient: {
          id: 7,
          profile: {
            firstName: 'ريم',
            lastName: 'القحطاني',
            avatar: '/patients/reem-qahtani.jpg'
          }
        }
      }
    ],
    averageRating: 4.0,
    totalRatings: 1
  }
];

export const getDoctorById = async (id: number): Promise<DoctorProfile | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const doctor = mockDoctors.find(d => d.id === id);
  if (!doctor) return null;
  
  // Calculate average rating
  const ratings = doctor.ratings;
  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
    : 0;
  
  return {
    ...doctor,
    averageRating: Math.round(averageRating * 10) / 10,
    totalRatings: ratings.length
  };
};

export const getDoctorRatings = async (doctorId: number): Promise<Rating[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const doctor = mockDoctors.find(d => d.id === doctorId);
  return doctor?.ratings || [];
};

export const calculateAverageRating = (ratings: Rating[]): number => {
  if (ratings.length === 0) return 0;
  
  const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
};

export const getRatingDistribution = (ratings: Rating[]) => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  ratings.forEach(rating => {
    distribution[rating.rating as keyof typeof distribution]++;
  });
  
  return distribution;
};