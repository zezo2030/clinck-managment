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